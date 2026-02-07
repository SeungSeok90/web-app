'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/project-store';
import { ArrowLeft, Search, SortDesc } from 'lucide-react';
import Link from 'next/link';

export default function ProjectRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { projects, registrations } = useProjectStore();
    const project = projects.find((p) => p.id === id);

    if (!project) {
        return <div className="p-8">Loading...</div>;
    }

    const projectRegistrations = registrations.filter(r => r.projectId === id);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    // 필터링 및 정렬 로직
    const filteredRegistrations = projectRegistrations
        .filter((reg) => {
            if (!searchTerm) return true;
            // 모든 답변 값을 하나의 문자열로 합쳐서 검색 (간편 구현)
            const allAnswers = Object.values(reg.answers).join(' ').toLowerCase();
            return allAnswers.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
            } else {
                return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
            }
        });

    const { fields } = project.registrationPage;

    return (
        <div className="p-6 md:p-10 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {project.name} - 신청자 목록
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        총 {filteredRegistrations.length}명의 참가 신청이 검색되었습니다. (전체 {projectRegistrations.length}명)
                    </p>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="이름, 연락처 등 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SortDesc className="text-gray-500" size={20} />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="latest">최신 신청순</option>
                        <option value="oldest">과거 신청순</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    신청 일시
                                </th>
                                {fields.map((field) => (
                                    <th key={field.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        {field.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={fields.length + 1} className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm ? '검색 결과가 없습니다.' : '아직 접수된 신청서가 없습니다.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(reg.submittedAt).toLocaleString()}
                                        </td>
                                        {fields.map((field) => {
                                            const value = reg.answers[field.id];
                                            return (
                                                <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {Array.isArray(value) ? value.join(', ') : value?.toString() || '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
