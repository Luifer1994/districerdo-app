import { Item, Product } from "../Products/ProductInterface";

export interface InvoiceListResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Invoice[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Invoice {
  id: number;
  code: string;
  client_id: number;
  state: string;
  created_at: Date;
  total: number;
  invoice_lines_count: number;
  client: Client;
  invoice_lines: InvoiceLine[];
}

export interface InvoiceLine {
  id: number | null;
  price: number | null;
  quantity: number | null;
  batch: Batch;
  product_id: number | null;
  product: Product;
}

export interface Batch {
  id: number | null;
  code: string | null;
}

export interface Client {
  id: number;
  name: string;
  last_name: string;
  full_name: string;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface NewInvoice {
  client_id: number | null;
  state: string | null;
  invoice_lines: Item[];
}
