export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface AuthProvider {
    provider: string;
    providerId: string;
}

export enum ActiveTypes {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export enum DeletedTypes {
    DELETED = "DELETED",
    NOT_DELETED = "NOT_DELETED"
}