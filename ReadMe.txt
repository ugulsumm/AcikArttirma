JavaScript ile Açık Arttırma Projesi
Projeyi çalıştırmak için Firebase'de bir web projesi oluşturun:
Firebase'e giriş yaptıktan sonra console ekranında proje ekleyin, projenizi adlandırın.
Projenizi oluşturduktan sonra Web(</>) kısmını seçin.
Takma bir isim belirlediktan sonra uygulamanızı kaydedin.
SDK ve CLI adımlarını geçebilirsiniz.
Projede, ayarlarda uygulamalar kısmında Firebase SDK snippet'ı CDN olarak işaretleyip masaüstündeki projede firebase config ayarlarını buradaki config ayarları ile değiştirin.
Storage'in Rules kısmında "allow read, write: if request.auth != null;" satırını  "allow read, write;"  olarak değştirin.
Cloud Firestore kısmında veritabanı oluşturun.(Üretim modu diyebilirsiniz.) Kuralları düzenle kısmındaki "allow read, write: if false;" satırını "allow read, write: if request.time < timestamp.date(2021, 12, 1);" olarak değiştirin.(Buradaki tarih güncel olmalıdır.)






