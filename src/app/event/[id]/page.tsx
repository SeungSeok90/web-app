import { INITIAL_PROJECTS } from '@/lib/mock-data';
import EventPageClient from './EventPageClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    // Find project in initial static data
    // Note: Dynamic projects created by users (in localStorage) won't be found here by the server.
    // They will receive default metadata unless we implement a real backend.
    const project = INITIAL_PROJECTS.find(p => p.id === id);

    if (!project || !project.landingPage.isEnabled) {
        return {
            title: '이벤트 페이지',
            description: '이벤트를 찾을 수 없습니다.',
        };
    }

    const { title, description } = project.seo;

    return {
        title: title,
        description: description,
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventPageClient id={id} />;
}
