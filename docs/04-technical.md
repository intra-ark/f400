# Teknik Dokümantasyon

Bu bölüm, geliştiriciler ve sistem mimarları içindir.

## 🏗 Teknoloji Yığını (Tech Stack)
*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
*   **Backend:** Next.js API Routes
*   **Veritabanı:** SQLite (Prisma ORM ile)
*   **Authentication:** NextAuth.js
*   **AI:** Google Gemini 2.5 Flash (Thinking Mode)
*   **PDF:** jsPDF, html2canvas

## 🗄 Veritabanı Şeması (Prisma)

### Temel Modeller
*   `Line`: Üretim hatları.
*   `Product`: Ürünler (Line ile ilişkili).
*   `YearData`: Ürünlerin yıllık performans verileri (OT, DT, UT, NVA).
*   `User`: Sistem kullanıcıları.
*   `UserLine`: Kullanıcı-Hat yetkilendirme ilişkisi.

## 🔌 API Endpoint'leri

### Veri Erişimi
*   `GET /api/lines`: Tüm hatları listeler.
*   `GET /api/products`: Ürünleri listeler (filtreleme destekler).

### Yönetim
*   `POST /api/lines`: Yeni hat oluşturur.
*   `PUT /api/products/[id]`: Ürün verilerini günceller.
*   `DELETE /api/lines/[id]`: Hat siler.

### AI & Analiz
*   `POST /api/chat`: Gemini AI ile sohbet ve analiz endpoint'i.

### Yedekleme
*   `GET /api/backup/export`: Veritabanını JSON olarak dışa aktarır.
*   `POST /api/backup/import`: JSON yedeği geri yükler.
