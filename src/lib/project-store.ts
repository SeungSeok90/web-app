import { create } from 'zustand';
import { Project, Member, Registration } from '@/types';
import { supabase } from './supabase';

interface ProjectStore {
    projects: Project[];
    members: Member[];
    registrations: Registration[];
    isLoading: boolean;
    error: string | null;

    fetchProjects: () => Promise<void>;
    addProject: (project: Pick<Project, 'name' | 'date' | 'location' | 'managerId' | 'status'>) => Promise<void>;
    updateProject: (id: string, project: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addRegistration: (registration: Omit<Registration, 'id' | 'submittedAt'>) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    members: [
        { id: 'm1', name: '김철수', role: 'PM' },
        { id: 'm2', name: '이영희', role: 'Designer' },
        { id: 'm3', name: '박민수', role: 'Developer' },
        { id: 'm4', name: '정수진', role: 'Marketer' },
        { id: 'm5', name: '최동훈', role: 'Developer' },
    ],
    registrations: [],
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch Projects
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (projectError) throw projectError;

            // Fetch Registrations
            const { data: regData, error: regError } = await supabase
                .from('registrations')
                .select('*');

            if (regError) throw regError;

            // Map DB fields (snake_case) to Types (camelCase)
            const formattedProjects: Project[] = (projectData || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                managerId: p.manager_id,
                date: p.date,
                location: p.location,
                status: p.status,
                seo: p.seo || {},
                landingPage: p.landing_page || {},
                registrationPage: p.registration_page || {},
                schedule: p.schedule || {},
                policy: p.policy || {},
                terms: p.terms || {},
                design: p.design || {},
                notification: p.notification || {},
            }));

            const formattedRegistrations: Registration[] = (regData || []).map((r: any) => ({
                id: r.id,
                projectId: r.project_id,
                answers: r.answers,
                submittedAt: r.submitted_at,
            }));

            set({ projects: formattedProjects, registrations: formattedRegistrations, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching data:', error);
            set({ isLoading: false, error: error.message });
        }
    },

    addProject: async (newProject) => {
        const projectToInsert = {
            name: newProject.name,
            manager_id: newProject.managerId,
            date: newProject.date,
            location: newProject.location,
            status: newProject.status,
            // Defaults
            seo: { title: newProject.name, description: '' },
            landing_page: {
                isEnabled: false,
                title: newProject.name,
                description: '',
                themeColor: '#3b82f6'
            },
            registration_page: {
                isEnabled: false,
                title: '참가 신청',
                description: '',
                fields: [
                    { id: Math.random().toString(36).substring(2, 9), type: 'text', label: '이름', required: true },
                    { id: Math.random().toString(36).substring(2, 9), type: 'tel', label: '연락처', required: true },
                    { id: Math.random().toString(36).substring(2, 9), type: 'email', label: '이메일', required: true },
                ],
            },
            schedule: {},
            policy: {},
            terms: { privacyPolicy: '개인정보 수집 및 이용에 동의합니다.', requirePrivacy: true, requireMarketing: false },
            design: {},
            notification: { successMessage: '신청이 완료되었습니다.' },
        };

        const { data, error } = await supabase
            .from('projects')
            .insert(projectToInsert)
            .select()
            .single();

        if (error) {
            console.error('Error adding project:', error);
            return;
        }

        if (data) {
            const formatted: Project = {
                id: data.id,
                name: data.name,
                managerId: data.manager_id,
                date: data.date,
                location: data.location,
                status: data.status,
                seo: data.seo,
                landingPage: data.landing_page,
                registrationPage: data.registration_page,
                schedule: data.schedule,
                policy: data.policy,
                terms: data.terms,
                design: data.design,
                notification: data.notification
            };
            set((state) => ({ projects: [formatted, ...state.projects] }));
        }
    },

    updateProject: async (id, updatedProject) => {
        // Map updates to snake_case
        const updates: any = { ...updatedProject };
        if (updates.managerId) {
            updates.manager_id = updates.managerId;
            delete updates.managerId;
        }
        if (updates.landingPage) {
            updates.landing_page = updates.landingPage;
            delete updates.landingPage;
        }
        if (updates.registrationPage) {
            updates.registration_page = updates.registrationPage;
            delete updates.registrationPage;
        }
        // ... allow other direct mappings if generic

        const { error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating project:', error);
            return;
        }

        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, ...updatedProject } : p
            ),
        }));
    },

    deleteProject: async (id) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            return;
        }

        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        }));
    },

    addRegistration: async (newRegistration) => {
        const { data, error } = await supabase
            .from('registrations')
            .insert({
                project_id: newRegistration.projectId,
                answers: newRegistration.answers,
                // submitted_at is default now()
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding registration:', error);
            return;
        }

        if (data) {
            const formatted: Registration = {
                id: data.id,
                projectId: data.project_id,
                submittedAt: data.submitted_at,
                answers: data.answers,
            };
            set((state) => ({
                registrations: [...state.registrations, formatted],
            }));
        }
    },
}));
