'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        // 클라이언트 사이드에서만 인증 체크 (Hydration issue 방지)
        const checkAuth = () => {
            // 실제로는 여기서 토큰 유효성 등을 검사하거나, 
            // zustand persist가 복원될 때까지 기다려야 할 수도 있음.
            // 여기서는 간단하게 처리.
            if (!useAuthStore.getState().isAuthenticated) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isAuthenticated) {
        return null; // 리다이렉트 중 깜빡임 방지
    }

    const menuItems = [
        { name: '대시보드', href: '/admin', icon: LayoutDashboard },
        { name: '프로젝트 관리', href: '/admin/projects', icon: FolderKanban },
        { name: '회원 관리', href: '/admin/users', icon: Users },
        { name: '설정', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full lg:hidden"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 font-bold text-xl border-b border-slate-800">
                    <span>관리자 페이지</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs">관리자</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                            title="로그아웃"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        {/* Header Right Side (Notifications, etc.) */}
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
