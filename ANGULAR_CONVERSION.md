# ZekiTayfa'yı Angular'a Taşıma ve Dönüştürme Rehberi

Evet, bu projeyi Angular'a dönüştürmek (veya "saklamak") kesinlikle mümkündür ve proje büyüdükçe (yeni oyunlar eklendikçe) **çok mantıklı bir adımdır.**

Mevcut modüler yapımız (ES Modules), Angular'ın yapısına (TypeScript Modules) oldukça benzer olduğu için geçiş sandığınızdan daha kolay olacaktır.

## Neden Angular?
- **TypeScript:** Hataları kod yazarken yakalarsınız.
- **State Yönetimi (RxJS):** Puan, seviye gibi verilerin güncellenmesi ve tüm ekrana yansıması otomatize edilir (`gameState.js` ve `ui.js` arasındaki bağlantı karmaşası biter).
- **Component Yapısı:** Her oyun (`<memory-game>`, `<quiz-game>`) bağımsız birer etiket haline gelir.
- **SPA (Single Page Application):** Sayfa yenilenmeden çok hızlı geçişler sağlar.

## Mimari Dönüşüm Tablosu

| Mevcut Yapı (Vanilla JS) | Angular Karşılığı | Açıklama |
|--------------------------|-------------------|----------|
| `gameState.js` | `GameStateService` | Puan ve User verisi burada tutulur, `BehaviorSubject` ile yayınlanır. |
| `soundManager.js` | `SoundService` | Ses çalma işlemleri için merkezi servis. |
| `modules/games/*.js` | `Components` | Her oyun ayrı bir komponent olur (örn: `MemoryGameComponent`). |
| `ui.js` | `App.component` & `Binding` | DOM manipülasyonu yerine Angular'ın `{{ value }}` yapısı kullanılır. |
| `script.js` (Yönlendirme) | `Angular Router` | Sayfa geçişleri (`/home`, `/game/memory`) Router ile yönetilir. |

## Adım Adım Geçiş Planı

### 1. Yeni Proje Oluşturma
```bash
ng new zekitayfa-angular --routing --style=scss
```

### 2. Servisleri Oluşturma
Tüm oyunların erişeceği ortak veriler için:
```bash
ng generate service services/gameState
ng generate service services/sound
```
*Mevcut `gameState.js` içindeki mantığı `GameStateService` içine taşıyacağız.*

### 3. Oyun Komponentlerini Oluşturma
```bash
ng generate component games/memory
ng generate component games/quiz
ng generate component games/xox
# ... diğer oyunlar
```
*Mevcut `memory.js` içindeki `setupMemoryGame` fonksiyonunun içini `MemoryComponent`'in `ngOnInit` metoduna taşıyacağız.*

### 4. Router Ayarları
`app-routing.module.ts` dosyasında hangi URL'in hangi oyunu açacağını belirteceğiz.

### 5. HTML ve CSS Taşıma
Mevcut `index.html` içindeki yapı parçalanarak ilgili komponentlerin `.html` dosyalarına dağıtılacak. `style.css` ise global veya komponent bazlı `.scss` dosyalarına taşınacak.

## Başlamak İster misiniz?

Eğer bu yapıyı kurmak isterseniz, sizin için **temel Angular iskeletini** oluşturabilir ve **bir oyunu (örn: XOX)** örnek olarak oraya taşıyabilirim.
