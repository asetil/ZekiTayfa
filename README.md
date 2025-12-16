# ZekiTayfa - Zeka Geliştirme Oyunu

Bu proje HTML, CSS ve Modern JavaScript (ES Modules) kullanılarak geliştirilmiştir.

## Nasıl Çalıştırılır?

Bu proje modern JavaScript modül sistemi (`import`/`export`) kullandığı için **doğrudan `index.html` dosyasına çift tıklayarak çalışmaz.** Tarayıcı güvenlik kuralları (CORS) gereği bir yerel sunucuya ihtiyaç duyar.

### Yöntem 1: Komut Satırı ile (Önerilen)
Projenin ana dizininde şu komutu çalıştırın:
```bash
npm start
```
Bu komut oyunu `http://localhost:8080/zekaup/index.html` adresinde otomatik olarak başlatacaktır.

### Yöntem 2: VS Code Live Server
VS Code kullanıyorsanız:
1. `zekaup/index.html` dosyasını açın.
2. Sağ tık yapıp **"Open with Live Server"** seçeneğine tıklayın.

### Teknoloji Yığını
- **Core**: HTML5, Vanilla JavaScript (ES6+ Modules)
- **Style**: CSS3
- **Server**: http-server (Sadece dosyaları sunmak için gereklidir, arka uç mantığı yoktur)
