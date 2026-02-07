'use client';

import {
    FolderKanban,
    Users,
    Calendar,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { title: '진행 중인 프로젝트', value: '4', icon: FolderKanban, color: 'bg-blue-500' },
        { title: '전체 회원', value: '12', icon: Users, color: 'bg-green-500' },
        { title: '이번 주 행사', value: '2', icon: Calendar, color: 'bg-purple-500' },
        { title: '조치 필요', value: '1', icon: AlertCircle, color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`rounded-lg p-3 ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section (Empty for now) */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">최근 활동</h2>
                <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    표시할 최근 활동이 없습니다.
                </div>
            </div>
        </div>
    );
}
