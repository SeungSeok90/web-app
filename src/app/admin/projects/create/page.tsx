'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/project-store';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
    const router = useRouter();
    const { addProject, members } = useProjectStore();

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        managerId: '',
        status: 'planning',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.date || !formData.managerId) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        addProject({
            name: formData.name,
            date: formData.date,
            location: formData.location,
            managerId: formData.managerId,
            status: formData.status as 'planning' | 'active' | 'completed',
        });

        router.push('/admin/projects');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/projects"
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">새 프로젝트 만들기</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트명 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="예: 2024 상반기 워크샵"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                행사일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                장소
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="예: 서울 코엑스"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            담당자 <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">담당자를 선택하세요</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            상태
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="planning">계획 중</option>
                            <option value="active">진행 중</option>
                            <option value="completed">완료</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/admin/projects"
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
                        >
                            프로젝트 생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
