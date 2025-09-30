Project: API Distribution Dashboard untuk Mata Kuliah Sistem Komputasi

Objective: Membuat aplikasi web dashboard yang mengintegrasikan API dari 10 kelompok
mahasiswa untuk menampilkan data dalam satu interface terpadu.

Technical Requirements:

- Frontend: React.js atau Next.js dengan TypeScript
- Backend: Node.js/Express atau PHP untuk API gateway--
- Styling: Tailwind CSS atau Material-UI untuk konsistensi

Features & Structure:

1. Sidebar Navigation: 10 menu items untuk masing-masing kelompok
2. Main Content Area: Menampilkan data dari API yang dipilih
3. API Status Monitor: Indikator status (online/offline) setiap API
4. Data Visualization: Charts atau tables untuk menampilkan response data

Implementation Steps:

1. Setup project structure dengan routing untuk 10 pages
2. Buat API gateway untuk handle cross-origin requests
3. Implementasi error handling dan loading states
4. Design responsive UI dengan sidebar dan content area
5. Integrasi dengan API endpoints dari setiap kelompok
6. Testing dan deployment

API Integration Specs:

- Format response: JSON standard
- HTTP methods: GET, POST sesuai kebutuhan
- Authentication: Bearer token atau API key (jika diperlukan)
- Error handling: Standard HTTP status codes
- Timeout: Maximum 10 detik per request

Performance Criteria:

- Response time < 3 detik untuk setiap API call
- UI loading state untuk requests > 1 detik
- Error fallback jika API tidak tersedia
- Responsive design untuk desktop dan mobile

Deliverables:

- Working web application dengan 10 integrated APIs
- Source code dengan documentation
- Deployment URL yang bisa diakses
- API documentation untuk setiap endpoint yang digunakan
