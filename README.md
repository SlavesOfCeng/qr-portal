# QR Portal

**QR Portal**, Mehmet Akif Ersoy Üniversitesi kapsamında akademisyenler ve öğrenciler arasındaki iletişimi dijitalleştiren, QR kod tabanlı dinamik bir yönetim sistemidir. Öğrencilerin kapıda bekleme sorununu çözerken, akademisyenlerin iletişim trafiğini güvenli ve kontrollü bir şekilde yönetmesini sağlar.

## Özellikler

### Akademisyen Paneli
- **Profil Yönetimi**: Biyografi, iletişim bilgileri, unvan düzenleme ve ofis konumu belirleme.
- **Dinamik QR Kod**: Öğrencilerin taratarak profile erişebileceği, her akademisyene özel oluşturulan QR kod.
- **Ders Programı**: Haftalık ders programı, ofis saatleri ve anlık "Müsait/Derste" durumu yönetimi.
- **İstatistikler**: Profil ziyaretçi sayıları, popüler talep saatleri ve etkileşim analizleri.
- **Talep Yönetimi**: Öğrencilerden gelen mesaj ve randevu taleplerini görüntüleme, onaylama veya reddetme.

### Öğrenci Arayüzü
- **Temassız Erişim**: Herhangi bir uygulama indirmeden, sadece kampüsteki QR kodları okutarak akademisyen profiline anında erişim.
- **Ders Programı Takibi**: Akademisyenin güncel ders programını ve o anki durumunu (Ofiste, Derste, Toplantıda) görüntüleme.
- **Akıllı Mesajlaşma**: Akademisyenin mail kutusunu doldurmadan, sistem üzerinden organize not ve mesaj bırakma.
- **Randevu Sistemi**: Akademisyenin belirlediği uygun saat aralıklarına (Slot) göre randevu talep etme.

### Güvenlik ve Moderasyon
- **Moderatör Paneli**: Akademisyenlere ulaşan tüm mesaj ve randevu taleplerinin ön denetimden geçirilmesi.
- **İçerik Filtreleme**: Mesaj içeriklerinde uygunsuz kelime ve spam tespiti (NLP tabanlı filtreleme).
- **Talep Denetimi**: Riskli görülen taleplerin akademisyene iletilmeden engellenmesi.

### Risk Analizi ve Dijital Parmak İzi
Sistem, kötüye kullanımı ve spam trafiğini önlemek için bir takım gelişmiş güvenlik önlemleri içerir:
- **Dijital Parmak İzi (Fingerprint)**: IP adresi, tarayıcı sürümü, ekran çözünürlüğü gibi verilerle oluşturulan anonim tekil kimlik.
- **Aktivite Logları**: Kullanıcıların talep sıklığı, sayfa yenileme hızları ve geçmiş davranışlarının analizi.
- **Kalıcı Veri Kaydı**: Şüpheli işlemlerin KVKK uyumlu şekilde şifrelenerek saklanması.

## Teknolojiler

Bu proje modern web teknolojileri kullanılarak Full-Stack olarak geliştirilmiştir. Projede aktif olarak kullanılan kütüphane ve araçlar şunlardır:

| Alan | Teknoloji | Versiyon / Notlar |
|------|-----------|--------|
| **Frontend** | Next.js, Tailwind CSS, TypeScript | v16.1.0 (App Router) |
| **Backend** | Node.js / Express | v4.21 |
| **Veritabanı** | MongoDB | Atlas & Prisma ORM v5.22 |
| **Real-time** | Socket.io | v4.8 (Sunucu ve İstemci) |
| **Güvenlik** | Helmet, BCryptJS | HTTP Başlıkları ve Şifreleme |
| **Parmak İzi** | FingerprintJS | v5.0 (Cihaz Tanıma) |
| **Altyapı** | Docker, Docker Compose | Multi-stage Builds |

## Docker ile Kurulum

Proje, hem geliştirme hem de üretim ortamlarında kolayca çalıştırılabilmesi için tamamen Dockerize edilmiştir.

### Gereksinimler
- Docker ve Docker Compose

### Hızlı Başlangıç (Production)
Projeyi Docker üzerinden ayağa kaldırmak için ana dizinde şu komutu kullanın:

```bash
docker-compose -f deployment/docker-compose.yml up --build -d
```

Bu komut şunları gerçekleştirir:
1. Backend (Express.js) ve Frontend (Next.js Standalone) imajlarını oluşturur.
2. Veritabanı şemasını (Prisma) otomatik olarak günceller.
3. Backend servisini **5005**, Frontend servisini **3000** portunda yayına alır.

### Yapılandırma
`deployment/.env.production` dosyası üzerinden portları ve veritabanı bağlantısını özelleştirebilirsiniz.
```env
DATABASE_URL="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>"
PORT=5000

JWT_SECRET="3f9c7b6e2a8d4f1c9e5b7a2d6c0f8e1b4a9d3c6e7f2b1a8c5d9e0f3a6b7c2d1" //örnek gizli anahtar

NEXT_PUBLIC_API_URL="http://localhost:5005/api"
FRONTEND_PORT=3000
BACKEND_PORT=5005
```
## Yol Haritası

Projenin sürdürülebilirliğini sağlamak ve özellik setini genişletmek için planlanan ve yapılan geliştirmeler:

- [x] Proje temel mimarisinin kurulması.
- [x] MongoDB entegrasyonu ve Prisma şemalarının oluşturulması.
- [x] Akademisyenler için profil düzenleme, dashboard ve ders programı altyapısı.
- [x] QR okutma, profil görüntüleme ve temel talep (Mesaj/Randevu) oluşturma.
- [x] Gelen taleplerin listelenmesi ve onay/red akış arayüzü.
- [x] Socket.io entegrasyonu.
- [x] İçerik analizi ve riskli içerik tespiti.
- [x] Docker altyapısının entegre edilmesi ve Multi-stage build yapılandırması.
- [ ] Gönderilen mesaj ve talep isteklerine akademisyenlerin sistem üzerinden cevap verebilmesi.
- [x] Tüm riskli hareketlerin ve reddedilen taleplerin grafiksel raporlanması.
- [x] IP bazlı istek sınırlama ve aktivite analizi.
- [x] Yönetim paneli üzerinden akademisyen/kullanıcı yönetimi.
- [x] Docker ile geliştirme ortamının kurulması.

## Katkıda Bulunma

Bu proje açık kaynaklı bir eğitim projesidir. Geliştirme sürecine katkıda bulunmak isterseniz bu repoyu forklayın ya da hata bildirimleri için `Issue` açabilirsiniz.
