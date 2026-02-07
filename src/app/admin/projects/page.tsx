'use client';

import Link from 'next/link';
import { useProjectStore } from '@/lib/project-store';
import { Plus, Calendar, MapPin, User, Search, SortDesc } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
    const { projects, members, registrations } = useProjectStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

    const getManagerName = (managerId: string) => {
        const member = members.find((m) => m.id === managerId);
        return member ? member.name : '미지정';
    };

    const getRegistrationCount = (projectId: string) => {
        return registrations.filter((r) => r.projectId === projectId).length;
    };

    const filteredProjects = projects
        .filter((project) => {
            const managerName = getManagerName(project.managerId);
            return (
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                managerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        })
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (sortBy === 'most-registrations') {
                return getRegistrationCount(b.id) - getRegistrationCount(a.id);
            } else if (sortBy === 'least-registrations') {
                return getRegistrationCount(a.id) - getRegistrationCount(b.id);
            } else if (sortBy === 'name-asc') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">프로젝트 관리</h1>
                <Link
                    href="/admin/projects/create"
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition w-full md:w-auto justify-center"
                >
                    <Plus size={20} />
                    <span>새 프로젝트</span>
                </Link>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="프로젝트 이름 또는 담당자 검색..."
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
                        <option value="latest">최신 등록순</option>
                        <option value="oldest">오래된 순</option>
                        <option value="most-registrations">등록 인원 많은 순</option>
                        <option value="least-registrations">등록 인원 적은 순</option>
                        <option value="name-asc">이름순 (가나다)</option>
                    </select>

                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden ml-2">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 ${viewMode === 'card' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            title="카드 보기"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            title="리스트 보기"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            <Link href={`/admin/projects/${project.id}/registrations`} className="block flex-1 cursor-pointer group">
                                <div className="mb-4">
                                    <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${project.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : project.status === 'planning'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {project.status === 'active'
                                            ? '진행 중'
                                            : project.status === 'planning'
                                                ? '계획 중'
                                                : '완료'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h2>
                                <div className="space-y-2.5 text-sm text-gray-700 font-medium">
                                    <div className="flex items-center gap-2">
                                        <User size={18} className="text-gray-500" />
                                        <span>담당자: <span className="text-gray-900">{getManagerName(project.managerId)}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-gray-500" />
                                        <span>{project.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-gray-500" />
                                        <span>{project.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            현재 등록: {getRegistrationCount(project.id)}명
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                <Link
                                    href={`/event/${project.id}?preview=true`}
                                    target="_blank"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    미리보기
                                </Link>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/projects/${project.id}/edit`}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        수정
                                    </Link>
                                    <Link
                                        href={`/admin/projects/${project.id}/settings`}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        설정
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록자 수</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/projects/${project.id}/registrations`} className="text-sm font-bold text-gray-900 hover:text-blue-600">
                                            {project.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${project.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : project.status === 'planning'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {project.status === 'active'
                                                ? '진행 중'
                                                : project.status === 'planning'
                                                    ? '계획 중'
                                                    : '완료'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getManagerName(project.managerId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {project.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getRegistrationCount(project.id)}명
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/event/${project.id}?preview=true`} target="_blank" className="text-blue-600 hover:text-blue-900">미리보기</Link>
                                            <span className="text-gray-300">|</span>
                                            <Link href={`/admin/projects/${project.id}/edit`} className="text-gray-600 hover:text-gray-900">수정</Link>
                                            <span className="text-gray-300">|</span>
                                            <Link href={`/admin/projects/${project.id}/settings`} className="text-gray-600 hover:text-gray-900">설정</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 프로젝트가 없습니다. 새로운 프로젝트를 추가해주세요.'}
                </div>
            )}
        </div>
    );
}
