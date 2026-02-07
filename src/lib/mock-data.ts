import { Project } from '@/types';

export const INITIAL_PROJECTS: Project[] = [
    {
        id: 'p1',
        name: '2024 상반기 워크샵',
        managerId: 'm1',
        date: '2024-04-15',
        location: '제주도',
        status: 'planning',
        seo: {
            title: '2024 상반기 워크샵에 초대합니다',
            description: '아름다운 제주도에서 함께하는 워크샵!\\n\\n많은 참여 부탁드립니다.',
        },
        landingPage: {
            isEnabled: true,
            title: '2024 상반기 워크샵에 초대합니다',
            description: '아름다운 제주도에서 함께하는 워크샵!\\n\\n많은 참여 부탁드립니다.',
            themeColor: '#3b82f6', // blue-500
        },
        registrationPage: {
            isEnabled: true,
            title: '참가 신청',
            description: '워크샵 참가 신청을 위해 아래 정보를 입력해주세요.',
            fields: [
                { id: 'f1', type: 'text', label: '이름', required: true },
                { id: 'f2', type: 'tel', label: '연락처', required: true },
                { id: 'f3', type: 'select', label: '티셔츠 사이즈', required: true, options: ['S', 'M', 'L', 'XL'] },
            ],
        },
        schedule: {
            applicationStart: '2024-03-01T09:00:00',
            applicationEnd: '2024-04-10T18:00:00',
            eventStart: '2024-04-15T10:00:00',
            eventEnd: '2024-04-16T17:00:00',
        },
        policy: {
            maxParticipants: 50,
            allowDuplicate: false,
        },
        terms: {
            privacyPolicy: '개인정보 수집 및 이용에 동의합니다.',
            requirePrivacy: true,
            requireMarketing: false,
        },
        design: {
        },
        notification: {
            successMessage: '신청이 완료되었습니다. 감사합니다!',
        },
    },
    {
        id: 'p2',
        name: '신제품 런칭 행사',
        managerId: 'm4',
        date: '2024-05-20',
        location: '서울 코엑스',
        status: 'active',
        seo: {
            title: '신제품 런칭 행사',
            description: '혁신적인 신제품을 만나보세요.',
        },
        landingPage: {
            isEnabled: false,
            title: '신제품 런칭 행사',
            description: '',
            themeColor: '#10b981', // green-500
        },
        registrationPage: {
            isEnabled: false,
            title: '사전 등록',
            description: '',
            fields: [],
        },
        schedule: {},
        policy: {},
        terms: {
            privacyPolicy: '개인정보 수집 및 이용에 동의합니다.',
            requirePrivacy: true,
            requireMarketing: false,
        },
        design: {
        },
        notification: {
            successMessage: '신청이 완료되었습니다.',
        },
    },
];
