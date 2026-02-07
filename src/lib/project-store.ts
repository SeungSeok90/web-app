import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Member, Registration } from '@/types'; // types/index.ts
import { INITIAL_PROJECTS } from './mock-data';

interface ProjectStore {
    projects: Project[];
    members: Member[];
    registrations: Registration[];
    addProject: (project: Omit<Project, 'id'>) => void;
    updateProject: (id: string, project: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    addRegistration: (registration: Omit<Registration, 'id' | 'submittedAt'>) => void;
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set) => ({
            members: [
                { id: 'm1', name: '김철수', role: 'PM' },
                { id: 'm2', name: '이영희', role: 'Designer' },
                { id: 'm3', name: '박민수', role: 'Developer' },
                { id: 'm4', name: '정수진', role: 'Marketer' },
                { id: 'm5', name: '최동훈', role: 'Developer' },
            ],
            registrations: [],
            projects: INITIAL_PROJECTS,
            addProject: (newProject) =>
                set((state) => ({
                    projects: [
                        ...state.projects,
                        {
                            ...newProject,
                            id: Math.random().toString(36).substring(2, 9),
                            seo: {
                                title: newProject.name,
                                description: '',
                            },
                            landingPage: {
                                isEnabled: false,
                                title: newProject.name,
                                description: '',
                                themeColor: '#3b82f6',
                            },
                            registrationPage: {
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
                            terms: {
                                privacyPolicy: '개인정보 수집 및 이용에 동의합니다.',
                                requirePrivacy: true,
                                requireMarketing: false,
                            },
                            design: {},
                            notification: {
                                successMessage: '신청이 완료되었습니다.',
                            },
                        },
                    ],
                })),
            updateProject: (id, updatedProject) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...updatedProject } : p
                    ),
                })),
            deleteProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                })),
            addRegistration: (newRegistration) =>
                set((state) => ({
                    registrations: [
                        ...state.registrations,
                        {
                            ...newRegistration,
                            id: Math.random().toString(36).substring(2, 9),
                            submittedAt: new Date().toISOString(),
                        },
                    ],
                })),
        }),
        {
            name: 'project-storage-v2',
        }
    )
);
