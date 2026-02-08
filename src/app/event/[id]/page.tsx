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

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (!project) {
        // Handle case where project doesn't exist
        return <div>Project not found</div>; // Or use notFound() from next/navigation
    }

    // Need to fetch related data (registrations) if needed, but for now just project is critical for rendering.
    // Also, Supabase returns snake_case, but our client component expects camelCase (Project interface).
    // We need to map it or update Client Component to handle raw data.
    // simpler: Let's use the store's mapper logic or just pass raw data if possible?
    // Actually, EventPageClient expects "project" from store.

    // Better approach to minimize changes:
    // Pass the raw project data to Client, and Client initializes/uses it.
    // Or simpler: Just fix the client side race condition by checking "hasLoaded" state?
    // But Server Side Fetch is better for the user.

    // Let's modify EventPageClient to take `initialProject`.
    // And we need to map snake_case to camelCase here.

    // Quick mapper (similar to project-store):
    const mapProject = (p: any) => ({
        id: p.id,
        name: p.name,
        date: p.date,
        location: p.location,
        managerId: p.manager_id,
        status: p.status,
        landingPage: p.landing_page,
        registrationPage: p.registration_page,
        design: p.design,
        schedule: p.schedule,
        policy: p.policy,
        terms: p.terms,
        notification: p.notification,
        seo: p.seo,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    });

    const mappedProject = mapProject(project);

    return <EventPageClient id={id} initialProject={mappedProject} />;
}
