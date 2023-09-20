export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  category_id: number;
  category: Category;
  stock?: number;
  minimum_stock?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreateProductResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  name: string;
  description?: string;
  sku: string;
  updated_at: Date;
  created_at: Date;
  id: number;
  is_active: boolean;
}

export interface Item {
  id: number | null;
  name: string | null;
  description: string | null;
  price: number | null;
  quantity:number | null
  batch: string | null;
}
