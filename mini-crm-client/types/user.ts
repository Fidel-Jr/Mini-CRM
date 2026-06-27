export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    profileImage?: string | null;
};