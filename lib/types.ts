export interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: {
    name: string;
    color: string;
  };
  color: {
    name: string;
    hexCode: string;
  };
  currentPrice: number;
  modalAwal: number;
  imageUrl: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  sizes: Array<{
    size: string;
    ageCategory: 'ADULT' | 'CHILD';
    quantity: number;
  }>;
  isActive: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
  };
}