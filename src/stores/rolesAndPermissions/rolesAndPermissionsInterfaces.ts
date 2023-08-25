export interface Role {
    id: number;
    name: string;
    description: string;
    permissions_count?: number;
}

export interface Group {
    group: string;
}

export interface Permission {
    id: number;
    name: string;
    description: string;
    group: string;
    checked: Number | boolean;
}

export interface NewRole {
    id?: number;
    guard_name: string;
    name: string;
    description: string;
}
