"use client";

import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center px-6 lg:px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <Input
            type="search"
            placeholder="Search courses, topics..."
            className="pl-10 bg-[#F8FAFC] border-[#E5E7EB] focus-visible:ring-[#065F46]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-[#6B7280]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-[#065F46]">
            <AvatarFallback className="bg-[#065F46] text-white font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#1F2937]">John Doe</p>
            <p className="text-xs text-[#6B7280]">Medical Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
