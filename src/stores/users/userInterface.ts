import { Role } from './../rolesAndPermissions/rolesAndPermissionsInterfaces';
import { DocumentType } from "../documentTypes/documentTypeInterfaces";

export interface User {
    id:               number;
    name:             string;
    last_name:        string;
    email:            string;
    is_active:        boolean;
    document:         string;
    document_type_id: number;
    full_name:        string;
    document_type:    DocumentType;
    roles:            Role[];
    password:         string;
    password_confirm: string;
    role:             string;
}

export interface Pivot {
    model_id:   number;
    role_id:    number;
    model_type: string;
}