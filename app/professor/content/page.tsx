"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
  BookOpen,
  Search,
  Eye,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  file_name: string;
  file_size: number;
  is_embedded: boolean;
  embedded_at: string;
  created_at: string;
}

export default function ProfessorContentPage() {
  const { user, profile } = useAuth();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [contentType, setContentType] = useState<"file" | "text">("file");

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("professor_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching content:", error);
    } else {
      setContents(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF, TXT, or Word document");
        return;
      }
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (contentType === "file" && !file) {
      setError("Please select a file");
      return;
    }

    if (contentType === "text" && !textContent.trim()) {
      setError("Please enter content");
      return;
    }

    setUploading(true);

    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;
      let richTextContent = null;

      if (contentType === "file" && file) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const filePath = `${user?.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("content-files")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Failed to upload file: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("content-files")
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileSize = file.size;
      } else {
        richTextContent = textContent;
      }

      // Create content item
      const { data: contentItem, error: insertError } = await supabase
        .from("content_items")
        .insert({
          professor_id: user?.id,
          title: title.trim(),
          description: description.trim(),
          content_type: contentType === "file" ? file?.type : "text",
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          rich_text_content: richTextContent,
          is_published: true,
          is_active: true,
          is_embedded: false,
          created_by: user?.id,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error("Failed to save content: " + insertError.message);
      }

      // Process embeddings
      if (contentItem) {
        await processEmbeddings(contentItem.id, richTextContent || "");
      }

      setSuccess("Content uploaded and processed successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setTextContent("");
      fetchContent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const processEmbeddings = async (contentItemId: string, text: string) => {
    setProcessing(contentItemId);

    try {
      // For text content, chunk and embed directly
      // For files, we'd need server-side processing (simplified here)
      
      if (!text) {
        // For file uploads, we'll mark as needing processing
        // In production, this would trigger a background job
        console.log("File uploaded - embedding processing would happen server-side");
        return;
      }

      // Chunk the text (simple chunking - 1000 chars with 200 overlap)
      const chunks = chunkText(text, 1000, 200);

      // Get embeddings from OpenAI
      const apiKey = localStorage.getItem("openai_api_key");
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please set it in AI Tutor first.");
      }

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Get embedding
        const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: chunk,
          }),
        });

        const embeddingData = await embeddingResponse.json();

        if (embeddingData.error) {
          throw new Error(embeddingData.error.message);
        }

        const embedding = embeddingData.data[0].embedding;

        // Store in database
        await supabase.from("content_embeddings").insert({
          content_item_id: contentItemId,
          chunk_text: chunk,
          chunk_index: i,
          embedding: embedding,
          professor_id: user?.id,
        });
      }

      // Mark content as embedded
      await supabase
        .from("content_items")
        .update({ is_embedded: true, embedded_at: new Date().toISOString() })
        .eq("id", contentItemId);

    } catch (err: any) {
      console.error("Embedding error:", err);
      setError("Failed to process embeddings: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const chunkText = (text: string, chunkSize: number, overlap: number): string[] => {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start += chunkSize - overlap;
    }

    return chunks;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    // Delete embeddings first
    await supabase.from("content_embeddings").delete().eq("content_item_id", id);

    // Delete content item
    const { error } = await supabase.from("content_items").delete().eq("id", id);

    if (error) {
      setError("Failed to delete content");
    } else {
      fetchContent();
      setSuccess("Content deleted successfully");
    }
  };

  const handleReprocess = async (item: ContentItem) => {
    if (item.content_type === "text") {
      // Get the content
      const { data } = await supabase
        .from("content_items")
        .select("rich_text_content")
        .eq("id", item.id)
        .single();

      if (data?.rich_text_content) {
        // Delete old embeddings
        await supabase.from("content_embeddings").delete().eq("content_item_id", item.id);
        // Reprocess
        await processEmbeddings(item.id, data.rich_text_content);
        fetchContent();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
        <p className="text-gray-500">Upload materials for AI-powered student assistance</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Content</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Content Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setContentType("file")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                contentType === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setContentType("text")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                contentType === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Paste Text
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1: Cardiac Anatomy"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the content"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          {contentType === "file" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File (PDF, DOC, TXT - Max 10MB)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  {file ? (
                    <p className="text-blue-600 font-medium">{file.name}</p>
                  ) : (
                    <p className="text-gray-500">Click to upload or drag and drop</p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Text Content */}
          {contentType === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your lecture notes, study materials, or any text content here..."
                rows={8}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {textContent.length} characters
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Process
              </>
            )}
          </button>
        </form>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Content</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : contents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No content uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contents.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.file_name || "Text content"} •{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Embedding Status */}
                  {processing === item.id ? (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : item.is_embedded ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Indexed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleReprocess(item)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Process
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload your lecture notes, study materials, or paste text content</li>
          <li>• Content is automatically processed and indexed using AI</li>
          <li>• Students can ask questions and get answers based on your materials</li>
          <li>• The AI will prioritize your content when answering student questions</li>
        </ul>
      </div>
    </div>
  );
}