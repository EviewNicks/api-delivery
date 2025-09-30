import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            API Distribution Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
            Sistem Komputasi - Integrasi 10 API Kelompok Mahasiswa
          </p>
          <p className="text-base text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto">
            Dashboard terpadu untuk monitoring dan akses API dari 10 kelompok mahasiswa
            dalam satu interface yang mudah digunakan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/k1"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Lihat Produk Rental Baju
            </Link>
            <Link
              href="/k1"
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Kelompok 1 - API Demo
            </Link>
          </div>

          {/* API Status Indicator */}
          <div className="mt-16 flex justify-center items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>API Status: Online</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Image
              src="/next.svg"
              alt="Next.js"
              width={80}
              height={16}
              className="dark:invert"
            />
            <span>Powered by Next.js 15</span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition"
            >
              Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
