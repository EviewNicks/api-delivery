# Cafeku Public API Documentation

## Ringkasan

Dokumentasi lengkap untuk **Cafeku Public API** - endpoint publik untuk mengakses data menu dan produk kafe tanpa autentikasi. API ini dirancang untuk integrasi aplikasi mobile, website terpisah, atau sistem lain yang membutuhkan data menu kafe.

**Base URL**: `https://dodgerblue-monkey-417412.hostingersite.com/api` (development)
**Version**: 1.2.1
**Content-Type**: `application/json`

## Autentikasi

**Tidak diperlukan autentikasi** - semua endpoint publik dapat diakses langsung tanpa header authorization.

## Header Wajib

**PENTING**: Semua request API **HARUS** menyertakan header berikut:

```
Accept: application/json
```

Tanpa header ini, Laravel akan mengembalikan HTML response alih-alih JSON.

## API Endpoints

### 1. Get Menu (All Products)

**GET** `/api/menu`

Mengambil daftar semua produk menu yang tersedia di kafe.

#### Request Headers

| Header   | Value              | Required | Description                                  |
| -------- | ------------------ | -------- | -------------------------------------------- |
| `Accept` | `application/json` | Yes      | Untuk mendapatkan response dalam format JSON |

#### Example Request

```http
GET /api/menu HTTP/1.1
Host: https://dodgerblue-monkey-417412.hostingersite.com
Accept: application/json
```

#### Example Response (Success)

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "image": "espresso.jpg",
            "title": "Espresso",
            "description": "Strong Italian coffee",
            "price": 25000,
            "stock": 100,
            "created_at": "2025-01-15T10:30:00.000000Z",
            "updated_at": "2025-01-15T10:30:00.000000Z"
        },
        {
            "id": 2,
            "image": "cappuccino.jpg",
            "title": "Cappuccino",
            "description": "Espresso with steamed milk foam",
            "price": 30000,
            "stock": 80,
            "created_at": "2025-01-15T10:35:00.000000Z",
            "updated_at": "2025-01-15T10:35:00.000000Z"
        }
    ]
}
```

#### Response Fields

| Field                | Type              | Description                    |
| -------------------- | ----------------- | ------------------------------ |
| `success`            | boolean           | Status keberhasilan request    |
| `data`               | array             | Array berisi semua produk menu |
| `data[].id`          | integer           | ID unik produk                 |
| `data[].image`       | string            | Nama file gambar produk        |
| `data[].title`       | string            | Nama produk                    |
| `data[].description` | string            | Deskripsi produk               |
| `data[].price`       | integer           | Harga produk dalam Rupiah      |
| `data[].stock`       | integer           | Jumlah stok tersedia           |
| `data[].created_at`  | string (ISO 8601) | Timestamp pembuatan            |
| `data[].updated_at`  | string (ISO 8601) | Timestamp update terakhir      |

#### Response Status Codes

-   `200 OK` - Request berhasil
-   `500 Internal Server Error` - Server error

---

### 2. Get Product Detail

**GET** `/api/products/{id}`

Mengambil detail lengkap satu produk berdasarkan ID.

#### Path Parameters

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| `id`      | integer | Yes      | ID unik produk |

#### Request Headers

| Header   | Value              | Required | Description                                  |
| -------- | ------------------ | -------- | -------------------------------------------- |
| `Accept` | `application/json` | Yes      | Untuk mendapatkan response dalam format JSON |

#### Example Request

```http
GET /api/products/1 HTTP/1.1
Host: https://dodgerblue-monkey-417412.hostingersite.com
Accept: application/json
```

#### Example Response (Success)

```json
{
    "success": true,
    "data": {
        "id": 1,
        "image": "espresso.jpg",
        "title": "Espresso",
        "description": "Strong Italian coffee made with high-quality beans",
        "price": 25000,
        "stock": 100,
        "created_at": "2025-01-15T10:30:00.000000Z",
        "updated_at": "2025-01-15T10:30:00.000000Z"
    }
}
```

#### Response Fields

| Field              | Type              | Description                 |
| ------------------ | ----------------- | --------------------------- |
| `success`          | boolean           | Status keberhasilan request |
| `data`             | object            | Object berisi detail produk |
| `data.id`          | integer           | ID unik produk              |
| `data.image`       | string            | Nama file gambar produk     |
| `data.title`       | string            | Nama produk                 |
| `data.description` | string            | Deskripsi lengkap produk    |
| `data.price`       | integer           | Harga produk dalam Rupiah   |
| `data.stock`       | integer           | Jumlah stok tersedia        |
| `data.created_at`  | string (ISO 8601) | Timestamp pembuatan         |
| `data.updated_at`  | string (ISO 8601) | Timestamp update terakhir   |

#### Response Status Codes

-   `200 OK` - Product ditemukan
-   `404 Not Found` - Product tidak ditemukan
-   `500 Internal Server Error` - Server error

#### Example Response (Not Found)

```json
{
    "message": "No query results for model [App\\Models\\Product] 999"
}
```

---

### 3. Create Product

**POST** `/api/products`

Membuat produk menu baru.

#### Request Body (form-data)

| Field         | Type    | Required | Description                        |
| ------------- | ------- | -------- | ---------------------------------- |
| `title`       | string  | Yes      | Nama produk (min 5 karakter)       |
| `description` | string  | Yes      | Deskripsi produk (min 10 karakter) |
| `price`       | integer | Yes      | Harga produk dalam Rupiah          |
| `stock`       | integer | Yes      | Jumlah stok                        |
| `image`       | file    | Yes      | File gambar (jpg/png, max 2MB)     |

#### Example Request

```http
POST /api/products HTTP/1.1
Host: https://dodgerblue-monkey-417412.hostingersite.com
Accept: application/json
Content-Type: multipart/form-data

title=Cappuccino Test
description=Test product created via API
price=35000
stock=100
image=<binary file>
```

#### Example Response (Success)

```json
{
    "success": true,
    "message": "Data Berhasil Disimpan!",
    "data": {
        "id": 14,
        "image": "aBc123XyZ.jpg",
        "title": "Cappuccino Test",
        "description": "Test product created via API",
        "price": 35000,
        "stock": 100,
        "created_at": "2025-10-05T08:30:00.000000Z",
        "updated_at": "2025-10-05T08:30:00.000000Z"
    }
}
```

#### Example Response (Validation Error)

```json
{
    "message": "The image field is required.",
    "errors": {
        "image": ["The image field is required."],
        "title": ["The title field must be at least 5 characters."]
    }
}
```

#### Response Status Codes

-   `201 Created` - Product berhasil dibuat
-   `422 Unprocessable Entity` - Validation error

---

### 4. Update Product

**PUT** `/api/products/{id}`

Update data produk yang sudah ada.

#### Path Parameters

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| `id`      | integer | Yes      | ID unik produk |

#### Request Body (urlencoded)

| Field         | Type    | Required | Description                        |
| ------------- | ------- | -------- | ---------------------------------- |
| `title`       | string  | Yes      | Nama produk (min 5 karakter)       |
| `description` | string  | Yes      | Deskripsi produk (min 10 karakter) |
| `price`       | integer | Yes      | Harga produk dalam Rupiah          |
| `stock`       | integer | Yes      | Jumlah stok                        |

#### Example Request

```http
PUT /api/products/1 HTTP/1.1
Host: https://dodgerblue-monkey-417412.hostingersite.com
Accept: application/json
Content-Type: application/x-www-form-urlencoded

title=Cappuccino Updated&description=Updated product description&price=38000&stock=85
```

#### Example Response (Success)

```json
{
    "success": true,
    "message": "Data Berhasil Diubah!",
    "data": {
        "id": 1,
        "image": "original_image.jpg",
        "title": "Cappuccino Updated",
        "description": "Updated product description",
        "price": 38000,
        "stock": 85,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-05T08:35:00.000000Z"
    }
}
```

#### Response Status Codes

-   `200 OK` - Product berhasil diupdate
-   `404 Not Found` - Product tidak ditemukan
-   `422 Unprocessable Entity` - Validation error

---

### 5. Delete Product

**DELETE** `/api/products/{id}`

Menghapus produk dari database.

#### Path Parameters

| Parameter | Type    | Required | Description    |
| --------- | ------- | -------- | -------------- |
| `id`      | integer | Yes      | ID unik produk |

#### Example Request

```http
DELETE /api/products/1 HTTP/1.1
Host: https://dodgerblue-monkey-417412.hostingersite.com
Accept: application/json
```

#### Example Response (Success)

```json
{
    "success": true,
    "message": "Data Berhasil Dihapus!"
}
```

#### Example Response (Not Found)

```json
{
    "message": "No query results for model [App\\Models\\Product] 1"
}
```

#### Response Status Codes

-   `200 OK` - Product berhasil dihapus
-   `404 Not Found` - Product tidak ditemukan

---

## Testing dengan Postman

### Import Collection

1. Download file `cafeku-public-api.json` dari folder `docs/api-docs/`
2. Buka Postman
3. Klik **Import** → **Upload Files**
4. Pilih file `cafeku-public-api.json`
5. Collection akan muncul di sidebar Postman

**PENTING**: Collection sudah otomatis include header `Accept: application/json` untuk semua request. Jangan hapus header ini!

### Set Environment Variables

Collection sudah dilengkapi dengan environment variables:

-   `base_url`: URL server API dengan prefix `/api`
-   `product_id`: ID produk untuk testing (default: `1`)

Anda dapat mengubah nilai ini di:
**Postman → Collections → Cafeku Public API → Variables**

### Troubleshooting

**Jika mendapat HTML response (login page) alih-alih JSON:**

1. Pastikan header `Accept: application/json` ada di request
2. Pastikan URL menggunakan prefix `/api` (contoh: `/api/products`)
3. Re-import collection jika menggunakan versi lama

## Catatan Penting

### Backward Compatibility

API ini **backward compatible** dengan web application existing. Endpoint yang sama akan:

-   Return **JSON** jika request memiliki header `Accept: application/json`
-   Return **HTML view** jika diakses dari browser biasa

Contoh:

```bash
# Request dari browser (tanpa Accept header) → Return HTML
http://localhost:8000/menu

# Request dari API client (dengan Accept header) → Return JSON
curl -H "Accept: application/json" https://dodgerblue-monkey-417412.hostingersite.com/api/menu
```

### Image URL

Field `image` berisi nama file saja (contoh: `espresso.jpg`). Untuk mendapatkan full URL:

```
https://dodgerblue-monkey-417412.hostingersite.com/storage/products/{image_filename}
```

Pastikan symbolic link storage sudah dibuat:

```powershell
php artisan storage:link
```

### Database Seeding

Jika database kosong, jalankan seeder untuk membuat sample data:

```powershell
php artisan db:seed
```

---

## Changelog

### Version 1.2.1 (2025-10-05)

-   **FIX CRITICAL**: Tambahkan header `Accept: application/json` ke semua request examples
-   Tambahkan example response (success & error) untuk POST/PUT/DELETE endpoints
-   Update status codes: 201 untuk POST, 422 untuk validation errors
-   Tambahkan troubleshooting section untuk common issues
-   Perbaiki test assertions di Postman collection
-   Update dokumentasi dengan warning tentang pentingnya Accept header

### Version 1.2.0 (2025-10-05)

-   **BREAKING CHANGE**: Migrasi semua API endpoints ke `/api` prefix
-   Memisahkan API routes ke `routes/api.php` untuk menghindari CSRF protection
-   Update base URL dari `/` ke `/api`
-   Fix error 419 "Page Expired" saat testing API via Postman
-   Endpoint baru: GET `/api/menu`, GET/POST/PUT/DELETE `/api/products/*`
-   ProductController support dual response (JSON untuk API, HTML untuk web)

### Version 1.1.0 (2025-10-04)

-   Menambahkan endpoint POST /products untuk create product
-   Menambahkan endpoint PUT /products/{id} untuk update product
-   Menambahkan endpoint DELETE /products/{id} untuk delete product
-   Update Postman collection dengan 3 test cases baru

### Version 1.0.0 (2025-10-01)

-   Initial release
-   Endpoint GET /menu untuk daftar produk
-   Endpoint GET /products/{id} untuk detail produk
-   Postman collection dengan automated tests
-   Dokumentasi lengkap dengan contoh penggunaan

---

**Last Updated**: 2025-10-05
**API Version**: 1.2.1
**Project**: Cafeku - Sistem Manajemen Kafe
