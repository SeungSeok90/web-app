'use client';
export const runtime = 'edge';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/project-store';
import { Project, FormField } from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectSettingsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { projects, updateProject } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState<'common' | 'schedule' | 'design' | 'form'>('common');

    // Load project data
    useEffect(() => {
        const foundProject = projects.find((p) => p.id === id);
        if (foundProject) {
            const projectData = JSON.parse(JSON.stringify(foundProject));
            // Migration for existing data: ensure seo object exists
            if (!projectData.seo) {
                projectData.seo = {
                    title: projectData.landingPage?.title || projectData.name,
                    description: projectData.landingPage?.description || '',
                };
            }
            setProject(projectData);
        } else {
            router.push('/admin/projects');
        }
    }, [id, projects, router]);

    if (!project) return <div>Loading...</div>;

    const handleSave = () => {
        updateProject(project.id, project);
        alert('저장되었습니다.');
    };

    // --- SEO Handlers ---
    const handleSeoChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            seo: { ...(project.seo || {}), [field]: value },
        });
    };

    // --- Landing Page Handlers ---
    const handleLandingChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            landingPage: { ...project.landingPage, [field]: value },
        });
    };

    // --- Registration Page Handlers ---
    const handleRegistrationChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            registrationPage: { ...project.registrationPage, [field]: value },
        });
    };

    // --- New Config Handlers ---
    const handleScheduleChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            schedule: { ...(project.schedule || {}), [field]: value },
        });
    };

    const handlePolicyChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            policy: { ...(project.policy || {}), [field]: value },
        });
    };

    const handleDesignChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            design: { ...(project.design || {}), [field]: value },
        });
    };

    const handleTermsChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            terms: { ...(project.terms || {}), [field]: value },
        });
    };

    const handleNotificationChange = (field: string, value: any) => {
        if (!project) return;
        setProject({
            ...project,
            notification: { ...(project.notification || {}), [field]: value },
        });
    };

    const addField = () => {
        if (!project) return;
        const newField: FormField = {
            id: Math.random().toString(36).substring(2, 9),
            type: 'text',
            label: '새로운 질문',
            required: false,
        };
        setProject({
            ...project,
            registrationPage: {
                ...project.registrationPage,
                fields: [...project.registrationPage.fields, newField],
            },
        });
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        if (!project) return;
        setProject({
            ...project,
            registrationPage: {
                ...project.registrationPage,
                fields: project.registrationPage.fields.map(f => f.id === id ? { ...f, ...updates } : f)
            }
        });
    };

    const removeField = (id: string) => {
        if (!project) return;
        setProject({
            ...project,
            registrationPage: {
                ...project.registrationPage,
                fields: project.registrationPage.fields.filter(f => f.id !== id)
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {project.name} 설정
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm font-semibold"
                >
                    변경사항 저장
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('common')}
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'common'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    기본 설정 (SEO)
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'schedule'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    일정 및 정책
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'design'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    디자인 설정
                </button>
                <button
                    onClick={() => setActiveTab('form')}
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'form'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    신청 폼 및 약관
                </button>
            </div>

            {/* Common (SEO) Settings */}
            {activeTab === 'common' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">SEO 및 메타데이터 설정</h3>
                    <p className="text-sm text-gray-500">
                        이 프로젝트의 모든 페이지(랜딩, 신청 폼 등)에 공통으로 적용되는 메타데이터입니다.
                    </p>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">브라우저 탭 제목 (Meta Title)</label>
                            <input
                                type="text"
                                value={project.seo?.title || ''}
                                onChange={(e) => handleSeoChange('title', e.target.value)}
                                placeholder="브라우저 탭에 표시될 제목"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">메타 설명 (Meta Description)</label>
                            <textarea
                                rows={3}
                                value={project.seo?.description || ''}
                                onChange={(e) => handleSeoChange('description', e.target.value)}
                                placeholder="검색 결과나 공유 시 표시될 설명"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">OG 이미지 URL</label>
                            <input
                                type="text"
                                value={project.seo?.ogImage || ''}
                                onChange={(e) => handleSeoChange('ogImage', e.target.value)}
                                placeholder="https://example.com/og-image.jpg"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">파비콘 URL (Favicon)</label>
                            <input
                                type="text"
                                value={project.seo?.faviconUrl || ''}
                                onChange={(e) => handleSeoChange('faviconUrl', e.target.value)}
                                placeholder="https://example.com/favicon.ico"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Landing Page Settings (Now under Design) & New Design Settings */}
            {activeTab === 'design' && (
                <div className="space-y-6">
                    {/* Design Config */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">브랜드 디자인</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">로고 URL</label>
                                <input
                                    type="text"
                                    value={project.design?.logoUrl || ''}
                                    onChange={(e) => handleDesignChange('logoUrl', e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">푸터 텍스트 (Copyright 등)</label>
                                <input
                                    type="text"
                                    value={project.design?.footerText || ''}
                                    onChange={(e) => handleDesignChange('footerText', e.target.value)}
                                    placeholder="© 2024 Company Name. All rights reserved."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">연락처 정보 (푸터 노출)</label>
                                <input
                                    type="text"
                                    value={project.design?.contactInfo || ''}
                                    onChange={(e) => handleDesignChange('contactInfo', e.target.value)}
                                    placeholder="문의: contact@example.com | 02-1234-5678"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Original Landing Page Settings */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">랜딩 페이지 설정</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={project.landingPage.isEnabled}
                                    onChange={(e) => handleLandingChange('isEnabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">페이지 제목 (Hero Section)</label>
                                <input
                                    type="text"
                                    value={project.landingPage.title}
                                    onChange={(e) => handleLandingChange('title', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">상세 설명 (Content)</label>
                                <textarea
                                    rows={5}
                                    value={project.landingPage.description}
                                    onChange={(e) => handleLandingChange('description', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">테마 색상 (Hex Code)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={project.landingPage.themeColor}
                                        onChange={(e) => handleLandingChange('themeColor', e.target.value)}
                                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer shadow-sm"
                                    />
                                    <span className="text-gray-900 font-medium text-sm">{project.landingPage.themeColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">배경 이미지 URL</label>
                                <input
                                    type="text"
                                    value={project.landingPage.heroImage || ''}
                                    onChange={(e) => handleLandingChange('heroImage', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Page Settings (Now under Form) & Terms & Notifications */}
            {activeTab === 'form' && (
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">알림 및 메시지</h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">신청 완료 메시지</label>
                            <textarea
                                rows={2}
                                value={project.notification?.successMessage || ''}
                                onChange={(e) => handleNotificationChange('successMessage', e.target.value)}
                                placeholder="신청이 완료되었습니다. 감사합니다!"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">약관 설정</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-800">개인정보 수집 및 이용 동의 (필수)</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={project.terms?.requirePrivacy || false}
                                            onChange={(e) => handleTermsChange('requirePrivacy', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <textarea
                                    rows={4}
                                    value={project.terms?.privacyPolicy || ''}
                                    onChange={(e) => handleTermsChange('privacyPolicy', e.target.value)}
                                    placeholder="개인정보 처리방침 내용을 입력하세요..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-800">마케팅 정보 수신 동의 (선택)</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={project.terms?.requireMarketing || false}
                                            onChange={(e) => handleTermsChange('requireMarketing', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <textarea
                                    rows={3}
                                    value={project.terms?.marketingConsent || ''}
                                    onChange={(e) => handleTermsChange('marketingConsent', e.target.value)}
                                    placeholder="마케팅 활용 동의 문구를 입력하세요..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Fields (Original Registration Page Settings) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">등록 폼 활성화</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={project.registrationPage.isEnabled}
                                onChange={(e) => handleRegistrationChange('isEnabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1">등록 페이지 제목</label>
                            <input
                                type="text"
                                value={project.registrationPage.title}
                                onChange={(e) => handleRegistrationChange('title', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">신청 폼 필드 설정</h4>
                                <button
                                    onClick={addField}
                                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md transition"
                                >
                                    <Plus size={16} /> 항목 추가
                                </button>
                            </div>

                            <div className="space-y-4">
                                {project.registrationPage.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-1">질문 제목</label>
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    placeholder="예: 이름, 연락처"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-1">입력 타입</label>
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="text">텍스트 (한 줄)</option>
                                                    <option value="textarea">텍스트 (여러 줄)</option>
                                                    <option value="email">이메일</option>
                                                    <option value="tel">전화번호</option>
                                                    <option value="select">선택형 (드롭다운)</option>
                                                    <option value="radio">선택형 (라디오 버튼)</option>
                                                    <option value="checkbox">선택형 (체크박스)</option>
                                                </select>
                                            </div>

                                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                                <div className="md:col-span-2 space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                                                            옵션 목록 <span className="text-gray-500 font-normal text-xs">(콤마로 구분, 예: S, M, L)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.options?.join(', ') || ''}
                                                            onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                                                            placeholder="예: 옵션1, 옵션2, 옵션3"
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`other-${field.id}`}
                                                            checked={field.hasOtherOption || false}
                                                            onChange={(e) => updateField(field.id, { hasOtherOption: e.target.checked })}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <label htmlFor={`other-${field.id}`} className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                                                            '기타(직접 입력)' 항목 포함
                                                        </label>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    id={`req-${field.id}`}
                                                    checked={field.required}
                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`req-${field.id}`} className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                                                    필수 항목으로 설정
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                            title="삭제"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule & Policy */}
            {activeTab === 'schedule' && (
                <div className="space-y-6">
                    {/* Schedule */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">일정 관리</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">접수 시작 일시</label>
                                <input
                                    type="datetime-local"
                                    value={project.schedule?.applicationStart || ''}
                                    onChange={(e) => handleScheduleChange('applicationStart', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">접수 마감 일시</label>
                                <input
                                    type="datetime-local"
                                    value={project.schedule?.applicationEnd || ''}
                                    onChange={(e) => handleScheduleChange('applicationEnd', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">행사 시작 일시</label>
                                <input
                                    type="datetime-local"
                                    value={project.schedule?.eventStart || ''}
                                    onChange={(e) => handleScheduleChange('eventStart', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">행사 종료 일시</label>
                                <input
                                    type="datetime-local"
                                    value={project.schedule?.eventEnd || ''}
                                    onChange={(e) => handleScheduleChange('eventEnd', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Policy */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">운영 정책</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1">최대 모집 인원 (0 또는 빈칸은 무제한)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={project.policy?.maxParticipants || ''}
                                    onChange={(e) => handlePolicyChange('maxParticipants', e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="무제한"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="allowDuplicate"
                                    checked={project.policy?.allowDuplicate || false}
                                    onChange={(e) => handlePolicyChange('allowDuplicate', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="allowDuplicate" className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                                    중복 접수 허용 (동일 정보로 여러 번 신청 가능)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
