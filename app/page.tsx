import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            API Status: All Systems Online
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            API Distribution Dashboard
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 mb-4 max-w-2xl mx-auto">
            Platform terpadu untuk monitoring dan integrasi API dari 10 kelompok mahasiswa
          </p>

          <p className="text-base text-neutral-500 mb-10">
            Mata Kuliah Sistem Komputasi - Dashboard Modern dengan Next.js 15 & TypeScript
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/k1">
              <Button size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                Lihat Rental Baju
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/k1">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Kelompok 1 - Demo API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 text-center mb-12">
            Fitur Utama Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Real-time Monitoring
              </h3>
              <p className="text-neutral-600 text-sm">
                Pantau status dan performa API dari 10 kelompok secara real-time dengan indikator visual yang jelas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                API Gateway
              </h3>
              <p className="text-neutral-600 text-sm">
                Proxy pattern untuk mengatasi CORS dan centralized error handling untuk semua API endpoints.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Data Visualization
              </h3>
              <p className="text-neutral-600 text-sm">
                Tampilan data yang intuitif dengan charts, tables, dan status indicators untuk setiap kelompok.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kelompok Overview */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 text-center mb-4">
            10 Kelompok Mahasiswa
          </h2>
          <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
            Setiap kelompok memiliki API endpoint sendiri yang terintegrasi dalam satu dashboard terpadu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Kelompok 1 - Implemented */}
            <Link
              href="/k1"
              className="bg-white rounded-lg p-6 border-l-4 border-primary-500 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-neutral-800">Kelompok 1</h3>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              </div>
              <p className="text-sm text-neutral-600">Rental Baju</p>
            </Link>

            {/* Kelompok 2-10 - Pending */}
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="bg-white rounded-lg p-6 border border-neutral-200 opacity-60"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-700">Kelompok {num}</h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                    Soon
                  </span>
                </div>
                <p className="text-sm text-neutral-500">Coming Soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between text-sm text-neutral-600">
          <div>
            <p className="font-medium text-neutral-800">API Distribution Dashboard</p>
            <p className="mt-1">Mata Kuliah Sistem Komputasi</p>
          </div>
          <div className="flex gap-6">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-800 transition-colors"
            >
              Next.js 15 Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-800 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
