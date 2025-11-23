# Admin Kılavuzu

Bu belge, **admin** kullanıcıların SPS Analiz Sistemi üzerindeki yönetim yetkilerini ve kullanılabilir özellikleri açıklar.

## Yönetim Paneli
- **Hat Yönetimi**: `/admin` sayfasında hat ekleme, düzenleme, silme.
- **Kullanıcı Yönetimi**: `/admin/users` sayfasında kullanıcı oluşturma, şifre sıfırlama ve hat atama.
- **Ayarlar**: Sistem genel ayarlarını (`/admin/settings`) yönetme.

## Yetkiler
- **ADMIN** rolü tüm API endpoint'lerine tam erişim sağlar.
- **Kullanıcı** rolü sadece atanan hatları görebilir ve veri girişi yapabilir.

## Önerilen İş Akışı
1. **Kullanıcı Ekle** → `Kullanıcı Yönetimi` → Yeni kullanıcı oluştur.
2. **Hat Atama** → `Kullanıcı Yönetimi` → Kullanıcıya hatları atayın.
3. **Veri Girişi** → Kullanıcılar kendi hatları üzerinden veri eklesin.

## Güvenlik
- Şifreler **bcrypt** ile hashlenir.
- Tüm admin işlemleri **JWT** ile kimlik doğrulama gerektirir.
- API üzerinden yapılan tüm değişiklikler loglanır.

## Sık Sorulan Sorular
- **Şifreyi nasıl sıfırlarım?** Kullanıcı yönetim sayfasındaki "Şifre Sıfırla" butonunu kullanın.
- **Yeni hat eklemek?** `/admin` sayfasındaki "Yeni Hat" butonunu tıklayın.

---
*Bu kılavuz, adminlerin sistemdeki görevlerini hızlıca yerine getirmesine yardımcı olmak için hazırlanmıştır.*
