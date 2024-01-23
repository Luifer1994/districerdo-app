import { Item, Product } from "../Products/ProductInterface";
import { User } from "../auth/authInterfaces";
import { City, Client, DocumentType } from "../clients/clientInterface";

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
  total_paid: number;
  total_for_pay: number;
  invoice_lines_count: number;
  client: Client;
  invoice_lines: InvoiceLine[];
  partial_payments_of_invoice: PartialPayment[];
  user : User;
}

export interface InvoiceLine {
  id: number | null;
  price: number | null;
  quantity: number | null;
  batch: Batch;
  product_id: number | null;
  product: Product;
  total_line: number | null;
}

export interface Batch {
  id: number | null;
  code: string | null;
}

/* export interface Client {
  id: number;
  name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  document_number: string;
  document_type: DocumentType;
  address: string;
  city: City
} */


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

export interface PartialPayment {
  invoice_id: number | null;
  amount: number | null;
  description: string | null;
  evidence: [];
  created_at: Date | null;
  date: string | null;
  user: User | null;
  user_id: number | null;
  id: number | null;
}
