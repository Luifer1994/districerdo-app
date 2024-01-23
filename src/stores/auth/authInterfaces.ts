//create a new interface the object login payload email and password.
export interface loginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    token: string;
    user:  User;
}

export interface User {
    id:              number;
    name:            string;
    lastName:        string;
    gender:          string;
    phone:           null;
    cellPhone:       null;
    address:         null;
    documentTypeID:  number;
    document:        string;
    email:           string;
    isActive:        boolean;
    emailVerifiedAt: null;
    createdAt:       Date;
    updatedAt:       Date;
    changedAt:       Date;
    full_name:       string;
}

export interface UserLogedInterface {
    id:          number;
    name:        string;
    email:       string;
    roles:       string;
    permissions: string;
}