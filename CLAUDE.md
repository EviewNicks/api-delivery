# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

API Distribution Dashboard untuk Mata Kuliah Sistem Komputasi - aplikasi web yang mengintegrasikan API dari 10 kelompok mahasiswa dalam satu interface terpadu dengan sidebar navigation, API status monitoring, dan data visualization.

## Tech Stack

- **Framework**: Next.js 15.5.4 dengan App Router dan Turbopack
- **UI**: React 19.1.0 dengan TypeScript
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Turbopack untuk development dan production build

## Development Commands

### Start Development Server
```bash
npm run dev
```
Menjalankan dev server dengan Turbopack di http://localhost:3000

### Build Production
```bash
npm run build
```
Build aplikasi menggunakan Turbopack untuk optimasi production

### Start Production Server
```bash
npm start
```
Menjalankan production server setelah build

### Linting
```bash
npm run lint
```
Menjalankan ESLint untuk code quality check

## Project Architecture

### Structure
- **app/**: Next.js App Router directory
  - `layout.tsx`: Root layout dengan Geist font configuration
  - `page.tsx`: Homepage/landing page
  - `globals.css`: Global Tailwind styles
- **docs/**: Project documentation dan specification
- **public/**: Static assets (images, icons)

### Path Alias
- `@/*` maps to project root untuk simplified imports

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler (Next.js optimized)

## Key Implementation Notes

### API Integration Architecture (Planned)
Dashboard akan mengintegrasikan 10 API endpoints dari kelompok berbeda dengan requirements:
- API gateway untuk handle cross-origin requests
- Standard JSON response format
- Maximum 10 detik timeout per request
- Bearer token atau API key authentication
- Error handling dengan standard HTTP status codes

### Performance Criteria
- Response time < 3 detik per API call
- Loading state untuk requests > 1 detik
- Error fallback untuk API unavailable
- Responsive design untuk desktop dan mobile

### Planned Features
1. Sidebar navigation dengan 10 menu items untuk setiap kelompok
2. Main content area untuk display API data
3. API status monitor (online/offline indicators)
4. Data visualization dengan charts atau tables

## Development Workflow

Gunakan Turbopack untuk fast refresh dan optimal development experience. File dalam `app/` directory akan auto-reload saat di-edit.

## Font Configuration

Project menggunakan Geist Sans dan Geist Mono dari next/font/google dengan CSS variables:
- `--font-geist-sans`
- `--font-geist-mono`