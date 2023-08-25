export interface CityResponse {
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    current_page:   number;
    data:           City[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface City {
    id:            number;
    name:          string;
    department_id: number;
    department:    Department;
}

export interface Department {
    id:   number;
    name: String;
}


export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
