import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { InfoPageContent } from '../info-page/info-page.model';

export const TERMS_OF_USE: InfoPageContent = {
  title: 'Kullanım Şartları',
  icon: 'bi-journal-check',
  updatedAt: '24 Kasım 2026',
  sections: [
    {
      title: 'Kapsam ve Kabul',
      paragraphs: [
        "Bu siteyi kullanarak işbu Kullanım Şartları'nı kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız siteyi kullanmamanızı rica ederiz.",
      ],
    },
    {
      title: 'Üyelik ve Hesap Güvenliği',
      items: [
        'Üyelik sırasında verdiğiniz bilgilerin doğru ve güncel olması gerekir.',
        'Hesabınızın ve şifrenizin güvenliğinden siz sorumlusunuz.',
        'Hesabınızda yetkisiz bir kullanım fark ederseniz bize gecikmeden bildirmelisiniz.',
        'Bir hesap yalnızca bir kişi tarafından kullanılabilir.',
      ],
    },
    {
      title: 'Rezervasyon Hizmeti',
      paragraphs: [
        'Sitede gösterilen araçlar, fiyatlar ve müsaitlik durumu bilgi amaçlıdır ve rezervasyon tamamlanana kadar değişebilir. Rezervasyon, ödemenin başarıyla alınmasıyla kesinleşir.',
        'Kiralama işlemleri ayrıca Kiralama Koşulları sayfasındaki hükümlere tabidir.',
      ],
    },
    {
      title: 'Kullanıcı Yükümlülükleri',
      items: [
        'Siteyi yalnızca hukuka uygun amaçlarla kullanmak',
        'Başkası adına sahte veya yanıltıcı bilgi ile işlem yapmamak',
        'Sitenin işleyişini bozacak, yetkisiz erişim sağlayacak veya aşırı yük oluşturacak girişimlerde bulunmamak',
        'Siteye yüklenen yorum ve içeriklerin hakaret, nefret söylemi veya hukuka aykırı unsur içermemesi',
      ],
    },
    {
      title: 'Fikri Mülkiyet',
      paragraphs: [
        'Sitedeki tüm metin, görsel, logo ve yazılım üzerindeki haklar Şirketimize aittir. Yazılı izin alınmadan kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.',
      ],
    },
    {
      title: 'Sorumluluğun Sınırlandırılması',
      paragraphs: [
        'Site, kesintisiz veya hatasız çalışacağı garantisi verilmeden sunulur. Bakım, teknik arıza veya mücbir sebepler nedeniyle yaşanabilecek geçici erişim sorunlarından dolayı Şirketimiz sorumlu tutulamaz.',
      ],
    },
    {
      title: 'Değişiklikler',
      paragraphs: [
        'Şirketimiz, bu şartları dilediği zaman güncelleme hakkını saklı tutar. Güncel metin bu sayfada yayımlandığı andan itibaren geçerli olur.',
      ],
    },
    {
      title: 'Uygulanacak Hukuk',
      paragraphs: [
        "Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Türkiye'deki yetkili mahkemeler ve icra daireleri yetkilidir.",
      ],
    },
  ],
};
@Component({
  imports: [],
  templateUrl: './terms-of-use.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TermsOfUse {}
