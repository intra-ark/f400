# Veritabanı Şeması

## Genel Bakış

SPS Analiz Sistemi PostgreSQL veritabanı kullanır ve Prisma ORM ile yönetilir.

## Veri Modelleri

### User (Kullanıcı)
```prisma
model User {
  id        Int        @id @default(autoincrement())
  username  String     @unique
  password  String
  role      String     @default("USER")
  createdAt DateTime   @default(now())
  userLines UserLine[]
}
```

**Alanlar:**
- `id`: Benzersiz kullanıcı ID'si
- `username`: Kullanıcı adı (benzersiz)
- `password`: Hashlenmiş şifre (bcrypt)
- `role`: Kullanıcı rolü ("ADMIN" veya "USER")
- `createdAt`: Kayıt tarihi
- `userLines`: Kullanıcının hat atamaları

### Line (Hat)
```prisma
model Line {
  id          Int        @id @default(autoincrement())
  name        String
  slug        String     @unique
  headerImage String?
  products    Product[]
  userLines   UserLine[]
}
```

**Alanlar:**
- `id`: Benzersiz hat ID'si
- `name`: Hat adı (örn: "F400")
- `slug`: URL-friendly isim (örn: "f400")
- `headerImage`: Hat başlık resmi URL'si
- `products`: Hatta üretilen ürünler
- `userLines`: Hata atanan kullanıcılar

### Product (Ürün)
```prisma
model Product {
  id          Int        @id @default(autoincrement())
  name        String
  productCode String
  lineId      Int
  line        Line       @relation(fields: [lineId], references: [id], onDelete: Cascade)
  yearData    YearData[]
}
```

**Alanlar:**
- `id`: Benzersiz ürün ID'si
- `name`: Ürün adı
- `productCode`: Ürün kodu
- `lineId`: Bağlı olduğu hat ID'si
- `line`: Hat ilişkisi
- `yearData`: Ürünün yıllık verileri

**Cascade Delete:** Hat silinirse, tüm ürünleri de silinir.

### YearData (Yıl Verisi)
```prisma
model YearData {
  id        Int     @id @default(autoincrement())
  productId Int
  year      Int
  kd        Float
  ke        Float
  ut        Float
  nva       Float
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, year])
}
```

**Alanlar:**
- `id`: Benzersiz veri ID'si
- `productId`: Bağlı olduğu ürün ID'si
- `year`: Yıl (örn: 2024)
- `kd`: Kapsam Dahili
- `ke`: Kapsam Harici
- `ut`: Ürün Toplam
- `nva`: Non-Value Added
- `product`: Ürün ilişkisi

**Unique Constraint:** Her ürün için her yıl sadece bir kayıt olabilir.

**Cascade Delete:** Ürün silinirse, tüm yıl verileri de silinir.

### UserLine (Kullanıcı-Hat Ataması)
```prisma
model UserLine {
  id        Int      @id @default(autoincrement())
  userId    Int
  lineId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  line      Line     @relation(fields: [lineId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, lineId])
}
```

**Alanlar:**
- `id`: Benzersiz atama ID'si
- `userId`: Kullanıcı ID'si
- `lineId`: Hat ID'si
- `user`: Kullanıcı ilişkisi
- `line`: Hat ilişkisi
- `createdAt`: Atama tarihi

**Unique Constraint:** Bir kullanıcıya aynı hat birden fazla kez atanamaz.

**Cascade Delete:** 
- Kullanıcı silinirse → Tüm atamaları silinir
- Hat silinirse → Tüm atamaları silinir

### GlobalSettings (Global Ayarlar)
```prisma
model GlobalSettings {
  id    Int    @id @default(autoincrement())
  key   String @unique
  value String
}
```

**Alanlar:**
- `id`: Benzersiz ayar ID'si
- `key`: Ayar anahtarı (benzersiz)
- `value`: Ayar değeri

## İlişki Diyagramı

```
User (1) ←→ (N) UserLine (N) ←→ (1) Line
                                      ↓
                                      (1)
                                      ↓
                                   Product (N)
                                      ↓
                                      (1)
                                      ↓
                                   YearData (N)
```

## Veri Akışı

### 1. Kullanıcı Oluşturma
```
User kaydı oluştur
  ↓
Şifreyi hashle (bcrypt)
  ↓
Veritabanına kaydet
  ↓
(Opsiyonel) Hat ataması yap
```

### 2. Hat Oluşturma
```
Line kaydı oluştur
  ↓
Slug oluştur (URL-friendly)
  ↓
Veritabanına kaydet
  ↓
(Opsiyonel) Kullanıcılara ata
```

### 3. Veri Girişi
```
Product seç/oluştur
  ↓
YearData oluştur/güncelle
  ↓
KD, KE, UT, NVA değerlerini gir
  ↓
SPS otomatik hesapla
  ↓
Veritabanına kaydet
```

## İndeksler

### Otomatik İndeksler
- `User.username` (UNIQUE)
- `Line.slug` (UNIQUE)
- `YearData.[productId, year]` (UNIQUE)
- `UserLine.[userId, lineId]` (UNIQUE)
- `GlobalSettings.key` (UNIQUE)

### Foreign Key İndeksler
- `Product.lineId`
- `YearData.productId`
- `UserLine.userId`
- `UserLine.lineId`

## Migration'lar

### Mevcut Migration'lar
1. **Initial Schema** - İlk veritabanı yapısı
2. **Add User Line Assignments** - UserLine tablosu eklendi

### Yeni Migration Oluşturma
```bash
npx prisma migrate dev --name migration_adi
```

### Migration Uygulama
```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

## Veri Bütünlüğü

### Cascade Delete Kuralları
- **Line silinirse:**
  - Tüm Product kayıtları silinir
  - Tüm UserLine kayıtları silinir
  
- **Product silinirse:**
  - Tüm YearData kayıtları silinir
  
- **User silinirse:**
  - Tüm UserLine kayıtları silinir

### Unique Constraint'ler
- Bir kullanıcı adı sadece bir kez kullanılabilir
- Bir slug sadece bir kez kullanılabilir
- Bir ürün için her yıl sadece bir veri kaydı olabilir
- Bir kullanıcıya aynı hat birden fazla atanamaz

## Performans İpuçları

### Query Optimizasyonu
```typescript
// ❌ Kötü: N+1 problemi
const lines = await prisma.line.findMany();
for (const line of lines) {
  const products = await prisma.product.findMany({ where: { lineId: line.id } });
}

// ✅ İyi: Include kullan
const lines = await prisma.line.findMany({
  include: { products: true }
});
```

### Pagination
```typescript
// Büyük veri setleri için pagination
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { id: 'asc' }
});
```

## Backup ve Restore

### Backup
```bash
pg_dump database_name > backup.sql
```

### Restore
```bash
psql database_name < backup.sql
```

## İlgili Dokümantasyon
- [Rol Bazlı Yetkilendirme](./09-yetkiler.md)
- [API Genel Bakış](./10-api-genel.md)
