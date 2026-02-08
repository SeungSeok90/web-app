'use client';
export const runtime = 'edge';

import { use, useEffect } from 'react';
import { useProjectStore } from '@/lib/project-store';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function RegistrationSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { projects, fetchProjects, isLoading } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const project = projects.find((p) => p.id === id);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!project) {
        notFound();
    }

    const { themeColor } = project.landingPage;
    const { successMessage } = project.notification || {};

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    신청이 완료되었습니다!
                </h2>

                <div className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">
                    {successMessage || '이벤트 신청이 성공적으로 접수되었습니다.\n참여해 주셔서 감사합니다.'}
                </div>

                <Link
                    href={`/event/${id}`}
                    className="block w-full py-3 px-4 rounded-lg text-white font-bold shadow-md transition-transform hover:scale-105"
                    style={{ backgroundColor: themeColor || '#3B82F6' }}
                >
                    확인
                </Link>
            </div>
        </div>
    );
}
