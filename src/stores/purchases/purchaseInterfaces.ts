export interface PurchaseListResponse {
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    current_page:   number;
    data:           Purchase[];
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

export interface Purchase {
    id:                  number;
    code:                string;
    provider_id:           number;
    status:               string;
    total_products: number;
    total:               number;
    provider:              Provider;
    purchase_lines:       PurchaseLine[];
    created_at:          Date;
}

export interface Provider {
    id:   number;
    name: string;
    full_name: string;
}

export interface PurchaseLine {
    id?:                          number;
    purchase_id?:                  number;
    product_id:                  number;
    quantity:                    number;
    price:                       number;
}


export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

export interface NewPurchase {
    provider_id:    number;
    status:         string;
    purchase_lines: PurchaseLine[];
}



export interface GetPurchaseResponse {
    status:  string;
    message: string;
    data:    DataGetPurchase;
}

export interface DataGetPurchase {
    id:             number;
    code:           string;
    provider_id:    number;
    status:         string;
    created_at:     Date;
    total_products: number;
    total:          number;
    provider:       ProviderGetPurchase;
    purchase_lines: PurchaseLineGetPurchase[];
}

export interface ProviderGetPurchase {
    id:        number;
    name:      string;
    last_name: string;
    full_name: string;
}

export interface PurchaseLineGetPurchase {
    id:          number;
    price:       number;
    quantity:    number;
    purchase_id: number;
    product_id:  number;
    product:     ProductGetPurchase;
}

export interface ProductGetPurchase {
    id:          number;
    sku:         string;
    name:        string;
    description: null;
}

