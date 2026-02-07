export interface Member {
    id: string;
    name: string;
    role: string; // 예: '기획', '개발', '디자인' 등
    avatar?: string;
}

export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'radio' | 'checkbox';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // Select, Radio, Checkbox일 경우 옵션
    hasOtherOption?: boolean; // 기타 항목(주관식) 활성화 여부
}

export interface SeoConfig {
    title: string;
    description: string;
    ogImage?: string;
    faviconUrl?: string;
}

export interface LandingPageConfig {
    isEnabled: boolean;
    title: string;
    description: string;
    heroImage?: string;
    themeColor: string;
}

export interface RegistrationPageConfig {
    isEnabled: boolean;
    title: string;
    description: string;
    fields: FormField[];
}


export interface ScheduleConfig {
    applicationStart?: string; // ISO datetime
    applicationEnd?: string;   // ISO datetime
    eventStart?: string;       // ISO datetime or string
    eventEnd?: string;         // ISO datetime or string
}

export interface PolicyConfig {
    maxParticipants?: number; // 0 or null = unlimited
    allowDuplicate?: boolean;
}

export interface TermsConfig {
    privacyPolicy: string;
    marketingConsent?: string;
    requirePrivacy: boolean;
    requireMarketing: boolean;
}

export interface DesignConfig {
    logoUrl?: string;
    footerText?: string;
    contactInfo?: string;
}

export interface NotificationConfig {
    successMessage: string;
}

export interface Project {
    id: string;
    name: string;
    managerId: string; // 담당자(Member)의 ID
    date: string; // YYYY-MM-DD
    location: string;
    status: 'planning' | 'active' | 'completed';
    landingPage: LandingPageConfig;
    registrationPage: RegistrationPageConfig;
    seo: SeoConfig;
    // New Configs
    schedule: ScheduleConfig;
    policy: PolicyConfig;
    terms: TermsConfig;
    design: DesignConfig;
    notification: NotificationConfig;
}

export interface Registration {
    id: string;
    projectId: string;
    submittedAt: string; // ISO String
    answers: Record<string, any>; // { "field_id": "응답 값" }
}
