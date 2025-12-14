"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  ClipboardList,
  Calendar,
  BarChart3,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: BookOpen, label: 'My Courses', href: '/courses' },
  { icon: Bot, label: 'AI Tutor', href: '/ai-tutor' },
  { icon: ClipboardList, label: 'Quizzes', href: '/quizzes' },
  { icon: Calendar, label: 'Book Session', href: '/sessions' },
  { icon: BarChart3, label: 'My Progress', href: '/progress' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#065F46] text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#065F46] to-[#047857]
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#065F46] font-bold text-xl">M</span>
            </div>
            <span className="text-white font-bold text-xl">ClinAid</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-white
                    transition-colors duration-200
                    ${active
                      ? 'bg-[#10B981]'
                      : 'hover:bg-[#047857]'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Help Card */}
          <div className="mt-auto">
            <div className="bg-[#047857] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Need Help?</span>
              </div>
              <p className="text-white/90 text-sm">
                Get support from our team
              </p>
              <Button
                className="w-full bg-white text-[#065F46] hover:bg-white/90 font-medium"
              >
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}