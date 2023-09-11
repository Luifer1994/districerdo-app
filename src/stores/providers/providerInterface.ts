export interface Newprovider {
    name:             string;
    last_name:        string;
    email:            string;
    document_number:  string;
    type:             string;
    address:          string;
    document_type_id: number;
    city_id:          number;
    phone:            string|null;
    id?:               number;
}


export interface provider {
    id:               number;
    name:             string;
    last_name:        string;
    email:            string;
    phone:            null;
    document_number:  string;
    address:          string;
    document_type_id: number;
    city_id:          number;
    full_name:        string;
    document_type:    DocumentType;
    city:             City;
}

export interface City {
    id:            number;
    name:          string;
    department_id: number;
    department:    Department;
}

export interface Department {
    id:   number;
    name: string;
}

export interface DocumentType {
    id:   number;
    name: string;
    code: string;
}

export interface CreateproviderResponse {
    status:  string;
    message: string;
    data:    provider;
}
