export type UserSession ={
    userId: string;
    isLoggedIn: boolean;
    avatarUrl?: string;
    nickname?: string;
    providerId: string;
}