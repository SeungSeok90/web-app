'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/project-store';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageMetadata from '@/components/PageMetadata';

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { projects, registrations, addRegistration } = useProjectStore();
    const project = projects.find((p) => p.id === id);

    if (!project || !project.registrationPage.isEnabled) {
        notFound();
    }

    const { title, description, fields } = project.registrationPage;
    const { title: metaTitle, description: metaDescription, faviconUrl } = project.seo || {};
    const { schedule, policy, terms, notification } = project;

    // --- Validation Logic ---
    const now = new Date();
    const projectRegistrations = registrations.filter(r => r.projectId === id);
    const currentCount = projectRegistrations.length;

    let errorState: 'not_started' | 'ended' | 'full' | null = null;

    if (schedule?.applicationStart && new Date(schedule.applicationStart) > now) {
        errorState = 'not_started';
    } else if (schedule?.applicationEnd && new Date(schedule.applicationEnd) < now) {
        errorState = 'ended';
    } else if (policy?.maxParticipants && policy.maxParticipants > 0 && currentCount >= policy.maxParticipants) {
        errorState = 'full';
    }

    // --- Form State ---
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [otherValues, setOtherValues] = useState<Record<string, string>>({});
    const [agreements, setAgreements] = useState({
        privacy: false,
        marketing: false,
    });

    const handleChange = (id: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };

    // ... (keep handleCheckboxChange, handleOtherChange helpers) ...
    const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
        setFormValues((prev) => {
            const currentValues = (prev[id] as string[]) || [];
            if (checked) {
                return { ...prev, [id]: [...currentValues, option] };
            } else {
                return { ...prev, [id]: currentValues.filter((v) => v !== option) };
            }
        });
    };

    const handleOtherChange = (id: string, value: string) => {
        setOtherValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (terms?.requirePrivacy && !agreements.privacy) {
            alert('개인정보 수집 및 이용에 동의해야 합니다.');
            return;
        }

        // 데이터 병합: 기타 항목 내용이 있으면 값에 포함시킴
        const finalData = { ...formValues };
        fields.forEach(field => {
            if (field.hasOtherOption && otherValues[field.id]) {
                if (field.type === 'radio' && finalData[field.id] === '기타') {
                    finalData[field.id] = `기타: ${otherValues[field.id]}`;
                } else if (field.type === 'checkbox' && (finalData[field.id] as string[])?.includes('기타')) {
                    finalData[field.id] = finalData[field.id].map((v: string) => v === '기타' ? `기타: ${otherValues[field.id]}` : v);
                }
            }
        });

        // Save to store
        addRegistration({
            projectId: id,
            answers: finalData,
        });

        console.log('Submitted Data:', finalData);
        // alert(notification?.successMessage || '참가 신청이 접수되었습니다! (데모)');
        router.push(`/event/${project.id}/register/success`);
    };

    if (errorState) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {errorState === 'not_started' && '접수 기간이 아닙니다.'}
                        {errorState === 'ended' && '접수가 마감되었습니다.'}
                        {errorState === 'full' && '모집 인원이 마감되었습니다.'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {errorState === 'not_started' && `접수 시작일: ${new Date(schedule?.applicationStart!).toLocaleString()}`}
                        {errorState === 'ended' && '아쉽지만 다음 기회에 참여해주세요.'}
                        {errorState === 'full' && '선착순 모집이 완료되었습니다.'}
                    </p>
                    <Link href={`/event/${id}`} className="text-blue-600 hover:underline">
                        이벤트 페이지로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <PageMetadata
                title={metaTitle || title}
                description={metaDescription || description}
                faviconUrl={faviconUrl}
            />
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
                    <Link href={`/event/${project.id}`} className="text-white hover:text-gray-300">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white truncate">{project.name}</h1>
                </div>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        {description && <p className="mt-2 text-gray-700 font-medium whitespace-pre-line">{description}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {fields.map((field) => (
                            <div key={field.id}>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    {field.label} {field.required && <span className="text-red-600 font-bold">*</span>}
                                </label>

                                {field.type === 'select' ? (
                                    <select
                                        required={field.required}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                                    >
                                        <option value="">선택해주세요</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm text-gray-900 placeholder:text-gray-400 font-medium focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                                        rows={4}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm text-gray-900 placeholder:text-gray-400 font-medium focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Terms Agreement */}
                        {(terms?.requirePrivacy || terms?.requireMarketing) && (
                            <div className="border-t pt-6 space-y-4">
                                {terms.requirePrivacy && (
                                    <div>
                                        <div className="flex items-start gap-2">
                                            <input
                                                id="privacy"
                                                type="checkbox"
                                                required
                                                checked={agreements.privacy}
                                                onChange={(e) => setAgreements(prev => ({ ...prev, privacy: e.target.checked }))}
                                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="privacy" className="text-sm text-gray-700 leading-tight">
                                                <span className="text-red-500 font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                                            </label>
                                        </div>
                                        {terms.privacyPolicy && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 h-24 overflow-y-auto whitespace-pre-line">
                                                {terms.privacyPolicy}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {terms.requireMarketing && (
                                    <div>
                                        <div className="flex items-start gap-2">
                                            <input
                                                id="marketing"
                                                type="checkbox"
                                                checked={agreements.marketing}
                                                onChange={(e) => setAgreements(prev => ({ ...prev, marketing: e.target.checked }))}
                                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="marketing" className="text-sm text-gray-700 leading-tight">
                                                [선택] 마케팅 정보 수신에 동의합니다.
                                            </label>
                                        </div>
                                        {terms.marketingConsent && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 h-24 overflow-y-auto whitespace-pre-line">
                                                {terms.marketingConsent}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            제출하기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
