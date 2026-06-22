export type User = {
    id: number;
    email: string;
    roles: string[];
    avatar?: string | null;
};