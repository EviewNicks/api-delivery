# API Documentation Kelompok 1

# Rental-Baju Public API Documentation

## 📖 Overview

Dokumentasi lengkap untuk Rental Public Product API - endpoint publik untuk mengakses data produk rental tanpa autentikasi. API ini dirancang khusus untuk integrasi homepage dan konsumsi data publik.

**Base URL**: https://rental-baju.netlify.app/
**Version**: 1.0.0
**Content-Type**: application/json

## 🔐 Authentication

Tidak diperlukan autentikasi - semua endpoint publik dapat diakses langsung tanpa header authorization.

---

## 📋 API Endpoints

### 1. Get All Products

Mengambil daftar semua produk yang tersedia untuk rental dengan pagination dan filtering.

**Endpoint**: `GET /api/public/products`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Nomor halaman untuk pagination |
| limit | integer | No | 10 | Jumlah item per halaman (max: 100) |
| search | string | No | - | Pencarian berdasarkan nama atau deskripsi produk |
| categoryId | string | No | - | Filter berdasarkan ID kategori |
| status | string | No | AVAILABLE | Filter berdasarkan status (AVAILABLE/RENTED/MAINTENANCE) |

#### Example Request

```http
GET /api/public/products?page=1&limit=5&search=dress&status=AVAILABLE
```

#### Example Response

```json
{
  "products": [
    {
      "id": "67d31de1-f7a6-4e78-af34-6b2786017bb7",
      "code": "87Y9",
      "name": "Baju Pesta Kini",
      "description": null,
      "category": {
        "name": "organic",
        "color": "#EC4899"
      },
      "color": {
        "name": "Pink",
        "hexCode": "#EC4899"
      },
      "currentPrice": 50000,
      "modalAwal": 900000,
      "imageUrl": "https://example.com/image.jpg",
      "status": "AVAILABLE",
      "sizes": [
        {
          "size": "M",
          "ageCategory": "ADULT",
          "quantity": 5
        }
      ],
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

#### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request berhasil |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Database connection timeout |

---

### 2. Get Product Detail

Mengambil detail lengkap satu produk berdasarkan ID.

**Endpoint**: `GET /api/public/products/{id}`

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | ID unik produk |

#### Example Request

```http
GET /api/public/products/67d31de1-f7a6-4e78-af34-6b2786017bb7
```

#### Example Response

```json
{
  "id": "67d31de1-f7a6-4e78-af34-6b2786017bb7",
  "code": "87Y9",
  "name": "Baju Pesta Kini",
  "description": null,
  "category": {
    "name": "organic",
    "color": "#EC4899"
  },
  "color": {
    "name": "Pink",
    "hexCode": "#EC4899"
  },
  "currentPrice": 50000,
  "modalAwal": 900000,
  "imageUrl": "https://example.com/image.jpg",
  "status": "AVAILABLE",
  "sizes": [
    {
      "size": "M",
      "ageCategory": "ADULT",
      "quantity": 5
    },
    {
      "size": "L",
      "ageCategory": "ADULT",
      "quantity": 3
    }
  ],
  "isActive": true
}
```

#### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Product ditemukan |
| 400 | Bad Request - Format ID tidak valid |
| 404 | Not Found - Product tidak ditemukan |
| 500 | Internal Server Error - Server error |

---

## ❌ Error Responses

Semua error menggunakan format standar:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_ID | 400 | Format ID tidak valid |
| NOT_FOUND | 404 | Resource tidak ditemukan |
| INTERNAL_ERROR | 500 | Server error umum |
| CONNECTION_ERROR | 503 | Database connection timeout |

---

## 🚀 Usage Examples

### Frontend Integration (JavaScript)

```javascript
// Get products untuk homepage
const getProducts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`/api/public/products?page=${page}&limit=${limit}&status=AVAILABLE`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product detail
const getProductDetail = async (productId) => {
  try {
    const response = await fetch(`/api/public/products/${productId}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

// Search products
const searchProducts = async (searchTerm) => {
  try {
    const response = await fetch(`/api/public/products?search=${encodeURIComponent(searchTerm)}&status=AVAILABLE`);
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
```

### cURL Examples

```bash
# Get all available products
curl "http://localhost:3001/api/public/products?status=AVAILABLE&limit=5"

# Search for specific products
curl "http://localhost:3001/api/public/products?search=dress&limit=10"

# Get product detail
curl "http://localhost:3001/api/public/products/67d31de1-f7a6-4e78-af34-6b2786017bb7"

# Get products with pagination
curl "http://localhost:3001/api/public/products?page=2&limit=5"
```

---

## 🧪 API Testing Tutorial

### Langkah-Langkah Testing dengan Postman

1. Download file `Public-api.json`
2. Masuk ke Postman
3. Di bagian atas klik button **Import**
4. Select atau drop file `public-api.json`
5. Akan muncul beberapa GET testing yang dapat digunakan
6. Arahkan kursor ke `{{base_url}}` untuk konfigurasi environment