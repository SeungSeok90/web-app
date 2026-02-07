'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/lib/project-store';
import Link from 'next/link';
import PageMetadata from '@/components/PageMetadata';

interface EventPageClientProps {
    id: string;
}

export default function EventPageClient({ id }: EventPageClientProps) {
    const { projects, registrations } = useProjectStore();
    const searchParams = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    const project = projects.find((p) => p.id === id);

    if (!project || (!project.landingPage.isEnabled && !isPreview)) {
        notFound();
    }

    const { title, description, themeColor, heroImage } = project.landingPage;
    // Fallback for metadata on client-side
    const { title: metaTitle, description: metaDescription, faviconUrl } = project.seo || {};

    // Design & Schedule
    const { logoUrl, footerText, contactInfo } = project.design || {};
    const { eventStart, eventEnd, applicationStart, applicationEnd } = project.schedule || {};
    const { maxParticipants } = project.policy || {};

    // Logic: Check Application Status
    const now = new Date();
    const projectRegistrations = registrations.filter(r => r.projectId === id);
    const currentCount = projectRegistrations.length;

    let buttonState: 'open' | 'not_started' | 'ended' | 'full' | 'closed' = 'open';
    const isRegEnabled = project.registrationPage.isEnabled;

    if (!isRegEnabled) {
        buttonState = 'closed';
    } else if (applicationStart && new Date(applicationStart) > now) {
        buttonState = 'not_started';
    } else if (applicationEnd && new Date(applicationEnd) < now) {
        buttonState = 'ended';
    } else if (maxParticipants && maxParticipants > 0 && currentCount >= maxParticipants) {
        buttonState = 'full';
    }

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <PageMetadata
                title={metaTitle || title}
                description={metaDescription || description}
                faviconUrl={faviconUrl}
            />
            {/* Hero Section */}
            <div
                className="relative h-96 w-full flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}
            >
                {heroImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                )}

                <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6">
                    {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="h-16 md:h-20 object-contain drop-shadow-md" />
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">{title}</h1>

                    {(eventStart || eventEnd) && (
                        <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm md:text-base font-medium">
                            {eventStart && formatDateTime(eventStart)}
                            {eventEnd && ` ~ ${formatDateTime(eventEnd)}`}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="prose lg:prose-xl mx-auto whitespace-pre-line text-gray-700">
                    {description}
                </div>

                {/* CTA Button */}
                <div className="mt-12 text-center">
                    {buttonState === 'open' ? (
                        <Link
                            href={`/event/${project.id}/register`}
                            className="inline-block px-10 py-4 rounded-full text-xl font-bold text-white transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                            style={{ backgroundColor: themeColor }}
                        >
                            참가 신청하기
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="inline-block px-10 py-4 rounded-full text-xl font-bold text-gray-400 bg-gray-200 cursor-not-allowed"
                        >
                            {buttonState === 'not_started' && '접수 기간이 아닙니다 (오픈 예정)'}
                            {buttonState === 'ended' && '접수가 마감되었습니다 (기간 종료)'}
                            {buttonState === 'full' && '접수가 마감되었습니다 (인원 초과)'}
                            {buttonState === 'closed' && '접수가 마감되었습니다'}
                        </button>
                    )}

                    {(applicationStart || applicationEnd) && (
                        <p className="mt-4 text-sm text-gray-500">
                            접수 기간: {applicationStart ? formatDateTime(applicationStart) : 'OPEN'} ~ {applicationEnd ? formatDateTime(applicationEnd) : '종료 시'}
                        </p>
                    )}

                    {maxParticipants && maxParticipants > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                            모집 현황: {currentCount} / {maxParticipants} 명
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-6 space-y-2">
                    <p className="font-medium text-gray-700">{footerText || `© ${project.name}. All rights reserved.`}</p>
                    {contactInfo && <p>{contactInfo}</p>}
                </div>
            </footer>
        </div>
    );
}
