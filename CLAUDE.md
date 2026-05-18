# Finansal Takip Uygulaması

## 📋 Proje Genel Bakış

Kullanıcının gelir ve giderlerini takip edebileceği, verilerini görsel olarak (pasta grafiği başta olmak üzere) analiz edebileceği modern bir finansal takip uygulaması.

**Hedef:** Temiz, modern, kullanıcı dostu bir arayüz ile detaylı finansal yönetim deneyimi sağlamak.

---

## 🎯 Temel Özellikler

### 1. Gelir/Gider Girişi
- Yeni işlem ekleme (gelir veya gider)
- Tutar, kategori, tarih, açıklama, ödeme yöntemi alanları
- Tekrarlayan işlem desteği (aylık fatura, maaş vb.)
- Hızlı giriş kısayolları

### 2. Kategori Yönetimi
- **Varsayılan Gelir Kategorileri:** Maaş, Freelance, Yatırım Geliri, Kira Geliri, Diğer
- **Varsayılan Gider Kategorileri:** Yiyecek, Ulaşım, Kira, Fatura, Eğlence, Sağlık, Eğitim, Alışveriş, Diğer
- Özel kategori oluşturma
- Her kategoriye ikon ve renk atama

### 3. Görselleştirme (Dashboard)
- **Pasta Grafiği:** Gelir/gider kategori dağılımı (ana özellik)
- **Çubuk Grafik:** Aylık karşılaştırma
- **Çizgi Grafik:** Zaman içinde trend analizi
- **Özet Kartlar:** Toplam gelir, toplam gider, net bakiye
- Tarih aralığı filtreleme (Bu hafta, bu ay, bu yıl, özel aralık)

### 4. İşlem Listesi
- Tüm işlemlerin kronolojik listesi
- Kategori, tarih, tutar bazında filtreleme
- Arama fonksiyonu
- İşlem düzenleme ve silme
- Toplu işlem (çoklu seçim)

### 5. Bütçe Yönetimi
- Kategori bazlı aylık bütçe belirleme
- Bütçe aşımı uyarıları
- Bütçe ilerleme çubukları

### 6. Raporlar
- Aylık/yıllık özet raporlar
- Kategori bazlı detaylı analiz
- CSV/PDF olarak dışa aktarma

---

## 🛠 Teknoloji Yığını

> **Not:** UI için MCP daha sonra eklenecek. Onun gelmesini bekleyip ona göre kütüphane seçilecek.

### Önerilen Stack (MCP gelene kadar geçici)
- **Frontend Framework:** React (Vite ile) veya Next.js
- **Dil:** TypeScript (tip güvenliği için)
- **Stil:** Tailwind CSS
- **Grafik Kütüphanesi:** Recharts veya Chart.js
- **İkonlar:** Lucide React
- **State Management:** Zustand veya React Context
- **Veri Depolama (Başlangıç):** LocalStorage
- **Veri Depolama (İleri):** SQLite + Prisma veya Supabase
- **Form Yönetimi:** React Hook Form + Zod
- **Tarih İşlemleri:** date-fns

---

## 📁 Proje Yapısı

```
finansal-takip/
├── src/
│   ├── components/
│   │   ├── ui/                 # Temel UI bileşenleri (button, input, card)
│   │   ├── charts/             # Grafik bileşenleri (PieChart, BarChart)
│   │   ├── transactions/       # İşlem ekleme/listeleme bileşenleri
│   │   ├── categories/         # Kategori bileşenleri
│   │   ├── budget/             # Bütçe bileşenleri
│   │   └── layout/             # Header, Sidebar, Footer
│   ├── pages/                  # Sayfa bileşenleri
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Categories.tsx
│   │   ├── Budget.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # State management
│   ├── types/                  # TypeScript tip tanımları
│   ├── utils/                  # Yardımcı fonksiyonlar
│   ├── lib/                    # Kütüphane konfigürasyonları
│   └── App.tsx
├── public/
├── package.json
└── CLAUDE.md
```

---

## 📊 Veri Modeli

### Transaction (İşlem)
```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: Date;
  description?: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}
```

### Category (Kategori)
```typescript
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
}
```

### Budget (Bütçe)
```typescript
interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
}
```

---

## 🎨 UI/UX Prensipleri

### Tasarım Felsefesi
- **Minimalist:** Gereksiz öğelerden kaçın, beyaz alanı etkin kullan
- **Tutarlı:** Tüm sayfalarda aynı tasarım dilini koru
- **Erişilebilir:** WCAG AA standartlarına uy, kontrast oranlarına dikkat et
- **Responsive:** Mobil-öncelikli tasarım, tüm ekran boyutlarında çalışmalı

### Renk Paleti (Önerilen - MCP geldikten sonra güncellenecek)
- **Birincil:** Koyu mavi/mor tonları
- **Gelir:** Yeşil tonları (#10B981)
- **Gider:** Kırmızı tonları (#EF4444)
- **Arka plan:** Açık gri / koyu mod desteği
- **Vurgular:** Pastel tonlar

### Tipografi
- **Başlıklar:** Inter veya Geist (sans-serif)
- **Rakamlar:** Tabular nums kullan (hizalama için)
- **Hierarchy:** Net boyut farklılıkları (text-xs, sm, base, lg, xl, 2xl)

### Etkileşim
- Yumuşak geçişler (transition-all duration-200)
- Hover durumları net olmalı
- Loading state'leri göster (skeleton screens)
- Boş durumlar (empty states) için anlamlı mesajlar
- Hata mesajları kullanıcı dostu olsun (Türkçe)

### Dark Mode
- Tam dark mode desteği
- Sistem tercihini otomatik algıla
- Manuel geçiş seçeneği

---

## 💻 Geliştirme Kuralları

### Kod Standartları
- **Dil:** Tüm yorum satırları ve değişken isimleri İngilizce; UI metinleri Türkçe
- **Bileşenler:** Tek sorumluluk prensibi (Single Responsibility)
- **Dosya Adlandırma:** PascalCase bileşenler için (Dashboard.tsx), camelCase utility fonksiyonlar için
- **Importlar:** Mutlak import yolları kullan (@/components/...)
- **TypeScript:** `any` kullanma, her şey tip tanımlı olsun

### Bileşen Yapısı
```typescript
// 1. Importlar
import { useState } from 'react';

// 2. Tip tanımları
interface Props {
  // ...
}

// 3. Bileşen
export function MyComponent({ ...props }: Props) {
  // hooks
  // handlers
  // render
}
```

### Git Commit Kuralları
- `feat:` Yeni özellik
- `fix:` Hata düzeltmesi
- `style:` Stil değişikliği
- `refactor:` Kod düzenleme
- `docs:` Dokümantasyon

### Performans
- React.memo gereksiz re-render'ları önlemek için
- useMemo ve useCallback ağır hesaplamalar için
- Liste render'larında key prop'u doğru kullan
- Büyük listeler için virtualization (react-window)

---

## 🌍 Yerelleştirme

- **Para Birimi:** TRY (₺) varsayılan, ayarlardan değiştirilebilir
- **Tarih Formatı:** GG.AA.YYYY (Türkçe formatı)
- **Sayı Formatı:** 1.234,56 (Türkçe formatı)
- **Dil:** Türkçe (varsayılan), gelecekte İngilizce eklenebilir

---

## ✅ Geliştirme Yol Haritası

### Faz 1: Temel Yapı
- [ ] Proje kurulumu (Vite + React + TS + Tailwind)
- [ ] Temel klasör yapısı
- [ ] Routing yapılandırması
- [ ] Layout bileşenleri (Header, Sidebar)
- [ ] LocalStorage tabanlı state yönetimi

### Faz 2: İşlem Yönetimi
- [ ] İşlem ekleme formu
- [ ] İşlem listesi sayfası
- [ ] Düzenleme ve silme
- [ ] Kategori yönetimi

### Faz 3: Görselleştirme (Ana Özellik)
- [ ] Dashboard sayfası
- [ ] Pasta grafiği bileşeni
- [ ] Özet kartlar
- [ ] Tarih filtreleme

### Faz 4: Gelişmiş Özellikler
- [ ] Bütçe yönetimi
- [ ] Raporlar ve dışa aktarma
- [ ] Tekrarlayan işlemler
- [ ] Bildirimler

### Faz 5: UI İyileştirmeleri
- [ ] MCP ile UI revize
- [ ] Dark mode
- [ ] Animasyonlar
- [ ] Mobil optimizasyon

---

## 🔌 MCP Notu

Kullanıcı UI için MCP (Model Context Protocol) entegrasyonunu daha sonra sağlayacak. MCP geldikten sonra:
1. Tasarım sistemini MCP'ye göre güncelle
2. Bileşen kütüphanesini buna göre seç
3. Renk paleti ve tipografiyi MCP standartlarına uygunlaştır
4. Bu CLAUDE.md dosyasını MCP detaylarıyla güncelle

---

## 📝 Notlar

- Tüm veriler başlangıçta LocalStorage'da tutulacak (sunucu gerektirmez)
- Daha sonra backend entegrasyonu için kod yapısı buna hazır olmalı
- Kullanıcı verileri hassastır; ileride şifreleme eklenecek
- Performans önemli: büyük veri setlerinde bile akıcı çalışmalı
