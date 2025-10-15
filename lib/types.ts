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

export interface Category {
  id: string;
  name: string;
  color: string;
  products?: number;
  createdAt: string;
}

export interface CategoryListResponse {
  categories: Category[];
}

export interface ProductFormData {
  code: string;
  name: string;
  description?: string;
  modalAwal: string;
  currentPrice: string;
  quantity: string;
  categoryId: string;
  sizes: string;
  image?: File;
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

export interface GadgetProductCreate {
  product_id: string;
  product_title: string;
  product_price: string;
  product_img1: string;
}

export interface GadgetProductUpdate {
  product_id: string;
  product_title: string;
  product_price: string;
  product_img1: string;
}

export interface GadgetProductDelete {
  product_id: string;
}

export interface GadgetOperationResponse {
  status: string;
  message: string;
  data?: GadgetProductSimplified;
}

export interface GadgetError {
  status: string;
  error: string;
  message: string;
}

// Kelompok 4: Krusit API Types

export interface KrusitMenuItem {
  id: number;
  name: string;
  description: string | null;
  category: 'makanan' | 'minuman';
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface KrusitMenuListResponse {
  status: string;
  data: KrusitMenuItem[];
}

export interface KrusitMenuItemEnriched extends KrusitMenuItem {
  price_number: number;
  price_formatted: string;
  image_url: string;
  is_valid_image: boolean;
}

// Kelompok 2: Tripnesia API Types

export interface TripnesiaBooking {
  id: number;
  name: string;
  type: string;
  destination: string;
  date: string;
}

export interface TripnesiaBookingListResponse {
  data: TripnesiaBooking[];
}

export interface TripnesiaBookingCreateResponse {
  message: string;
  data: TripnesiaBooking;
}

export interface TripnesiaBookingUpdateResponse {
  message: string;
  data: TripnesiaBooking;
}

export interface TripnesiaBookingDeleteResponse {
  message: string;
  data: TripnesiaBooking[];
}

export interface TripnesiaBookingEnriched extends TripnesiaBooking {
  date_formatted: string;
  is_upcoming: boolean;
  type_label: string;
}

// Kelompok 6: House Cafe API Types

export interface HouseCafeReservation {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  tanggal: string;
  jam: string;
  jumlah_orang: number;
  catatan: string | null;
  created_at: string;
}

export interface HouseCafeReservationEnriched extends HouseCafeReservation {
  datetime_formatted: string;
  date_formatted: string;
  time_formatted: string;
  is_upcoming: boolean;
  status: 'upcoming' | 'past';
}

// Kelompok 10: Cafeku API Types

export interface CafekuProduct {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CafekuApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CafekuMenuListResponse extends CafekuApiResponse<CafekuProduct[]> {}

export interface CafekuProductDetailResponse extends CafekuApiResponse<CafekuProduct> {}

export interface CafekuProductEnriched extends CafekuProduct {
  price_formatted: string;
  image_url: string;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_available: boolean;
}