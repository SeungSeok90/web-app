import { supabase } from '@/lib/supabase';
import EventPageClient from './EventPageClient';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const { data: project } = await supabase
        .from('projects')
        .select('seo, landing_page')
        .eq('id', id)
        .single();

    if (!project || !project.landing_page?.isEnabled) {
        return {
            title: '이벤트 페이지',
            description: '이벤트를 찾을 수 없습니다.',
        };
    }

    const { title, description } = project.seo || {};

    return {
        title: title || '이벤트',
        description: description || '',
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventPageClient id={id} />;
}
