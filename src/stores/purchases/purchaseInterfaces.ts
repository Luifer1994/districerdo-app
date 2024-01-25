import { User } from "../auth/authInterfaces";
import { provider } from "../providers/providerInterface";

export interface PurchaseListResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Purchase[];
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

export interface Purchase {
  id: number;
  code: string;
  provider_id: number;
  status: string;
  total_products: number;
  total: number;
  total_paid: number;
  total_for_pay: number;
  provider: provider;
  purchase_lines: PurchaseLine[];
  created_at: Date;
}



export interface PurchaseLine {
  id?: number;
  purchase_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  entrance: Entrance;
}

export interface Entrance {
  id: number;
  purchase_line_id: number;
  quantity: number;
  batch_id: number;
  product_id: number;
  batch: Batch;
}

export interface Batch {
  id: number;
  code: string;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface NewPurchase {
  provider_id: number;
  status: string;
  purchase_lines: PurchaseLine[];
}

export interface GetPurchaseResponse {
  status: string;
  message: string;
  data: DataGetPurchase;
}

export interface DataGetPurchase {
  id: number| null;
  code: string;
  provider_id: number;
  status: string;
  created_at: Date;
  total_products: number;
  total: number;
  total_paid: number;
  total_for_pay: number;
  provider: provider;
  purchase_lines: PurchaseLineGetPurchase[];
  partial_payments_of_purchase: PartialPayment[];
  user : User;
}



export interface PurchaseLineGetPurchase {
  id: number;
  price: number;
  quantity: number;
  purchase_id: number;
  product_id: number;
  product: ProductGetPurchase;
  entrance: Entrance;
  total_line: number;
}

export interface ProductGetPurchase {
  id: number;
  sku: string;
  name: string;
  description: null;
}

export interface PartialPayment {
  purchase_id: number | null;
  amount: number | null;
  description: string | null;
  evidence: [];
  created_at: Date | null;
  date: string | null;
  user: User | null;
  user_id: number | null;
  id: number | null;
}
