"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  entity_type?: string;
  entity_id?: string;
  action_url?: string;
  is_read: boolean;
  is_email_sent: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async (limit: number = 20) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (dbError) throw dbError;

      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unread count only
  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const { count, error: dbError } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (dbError) throw dbError;
      setUnreadCount(count || 0);
    } catch (err: any) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error: dbError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (dbError) throw dbError;

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return true;
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return false;

    try {
      const { error: dbError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (dbError) throw dbError;

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      return true;
    } catch (err: any) {
      console.error("Error marking all as read:", err);
      return false;
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find((n) => n.id === notificationId);

      const { error: dbError } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (dbError) throw dbError;

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return true;
    } catch (err: any) {
      console.error("Error deleting notification:", err);
      return false;
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!user) return false;

    try {
      const { error: dbError } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (dbError) throw dbError;

      setNotifications([]);
      setUnreadCount(0);

      return true;
    } catch (err: any) {
      console.error("Error clearing notifications:", err);
      return false;
    }
  };

  // Create a notification (for internal use)
  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    notificationType: string,
    options?: {
      entityType?: string;
      entityId?: string;
      actionUrl?: string;
    }
  ) => {
    try {
      const { error: dbError } = await supabase.from("notifications").insert({
        user_id: userId,
        title,
        message,
        notification_type: notificationType,
        entity_type: options?.entityType,
        entity_id: options?.entityId,
        action_url: options?.actionUrl,
      });

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error creating notification:", err);
      return false;
    }
  };

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    createNotification,
  };
}