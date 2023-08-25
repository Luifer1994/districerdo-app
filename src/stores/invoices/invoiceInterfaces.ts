export interface InvoiceListResponse {
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    current_page:   number;
    data:           Invoice[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Invoice {
    id:                  number;
    code:                string;
    client_id:           number;
    state:               string;
    invoice_lines_count: number;
    total:               number;
    total_supplies:      number;
    total_Products:      number;
    subtotal:            number;
    total_tax:           number;
    client:              Client;
    invoice_lines:       InvoiceLine[];
    created_at:          Date;
}

export interface Client {
    id:   number;
    name: string;
    full_name: string;
}

export interface InvoiceLine {
    id:                          number;
    invoice_id:                  number;
    Product_id:                  number;
    quantity:                    number;
    price:                       number;
    percentage_tax:              number;
    invoice_line_supplies_count: number;
    subtotal:                    number;
    total_tax:                   number;
    total:                       number;
    Product:                     Client;
    invoice_line_supplies:       InvoiceLineSupply[];
}

export interface InvoiceLineSupply {
    id:              number;
    description:     string;
    price:           number;
    percentage_tax:  number;
    quantity:        number;
    invoice_line_id: number;
    subtotal:        number;
    total_tax:       number;
    total:           number;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
