import { supabase } from '@/lib/supabase';
import SuccessClient from './SuccessClient';

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (!project) {
        return <div>Project not found</div>;
    }

    // Mapper function
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

    return <SuccessClient params={params} initialProject={mappedProject} />;
}
