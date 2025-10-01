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

// Kelompok 3: GadgetHouse API Types

export interface GadgetProductSimplified {
  product_id: string;
  product_title: string;
  product_price: string;
  product_img1: string;
}

export interface GadgetRecommendationsResponse {
  status: string;
  data: GadgetProductSimplified[];
}

export interface GadgetProductEnriched extends GadgetProductSimplified {
  price_number: number;
  price_formatted: string;
  image_url: string;
  category_guess?: string;
}