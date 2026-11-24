import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { InfoPageContent } from '../info-page/info-page.model';

export const RENTAL_TERMS: InfoPageContent = {
  title: 'Kiralama Koşulları',
  icon: 'bi-file-earmark-text',
  updatedAt: '24 Kasım 2026',
  sections: [
    {
      title: 'Sürücü Şartları',
      paragraphs: [
        'Araç kiralayabilmek için aşağıdaki şartların sağlanması gerekir.',
      ],
      items: [
        'Kiracının en az 21 yaşında olması (üst segment araçlarda 25 yaş)',
        'Geçerli bir sürücü belgesinin en az 2 yıldır alınmış olması',
        'Kimlik veya pasaportun teslim anında ibraz edilmesi',
        'Ek sürücü eklenecekse onun da aynı şartları taşıması',
      ],
    },
    {
      title: 'Rezervasyon ve Ödeme',
      paragraphs: [
        'Rezervasyon, ödemenin başarıyla tamamlanmasıyla kesinleşir. Ödeme, kredi kartı ile rezervasyon sırasında alınır.',
        'Fiyatlara KDV dahildir. Seçilen koruma paketleri ve ekstralar toplam tutara yansıtılır.',
      ],
    },
    {
      title: 'Depozito',
      paragraphs: [
        'Araç tesliminde, aracın segmentine göre belirlenen tutarda bir depozito kredi kartı provizyonu olarak bloke edilir.',
        'Depozito, aracın hasarsız ve eksiksiz iade edilmesinin ardından serbest bırakılır. Bankanıza bağlı olarak iade birkaç iş günü sürebilir.',
      ],
    },
    {
      title: 'Teslim Alma ve İade',
      items: [
        'Araç, rezervasyonda seçilen şubede ve saatte teslim edilir.',
        'İade, rezervasyonda belirtilen şubede ve saatte yapılır.',
        'Geç iadelerde, ilk 1 saat tolerans tanınır. Sonrasında ek gün ücreti uygulanabilir.',
        'Araç, teslim alındığı yakıt seviyesinde iade edilmelidir.',
      ],
    },
    {
      title: 'Kilometre Sınırı',
      paragraphs: [
        'Günlük kilometre sınırı araç detayında belirtilir. Sınırın aşılması durumunda aşan her kilometre için şube fiyat listesindeki ücret uygulanır.',
      ],
    },
    {
      title: 'İptal ve Değişiklik',
      items: [
        'Teslim tarihinden 48 saat öncesine kadar yapılan iptallerde ücretin tamamı iade edilir.',
        'Teslim tarihine 48 saatten az kala yapılan iptallerde ilk günün bedeli kesilir.',
        'Gelmeme (no-show) durumunda ödeme iade edilmez.',
        'Rezervasyon iptali profil sayfanızdaki kiralama detayından yapılabilir.',
      ],
    },
    {
      title: 'Hasar, Kaza ve Cezalar',
      paragraphs: [
        'Kaza veya hasar durumunda en kısa sürede şubeye ve ilgili makamlara bilgi verilmelidir. Seçilen koruma paketine göre kiracının sorumluluğu değişir.',
        'Kiralama süresi boyunca oluşan trafik cezaları ve köprü/otoyol geçiş ücretleri kiracıya aittir.',
      ],
    },
    {
      title: 'Yasaklı Kullanımlar',
      items: [
        'Aracın yarış, çekme veya taşımacılık amacıyla kullanılması',
        'Alkol veya uyuşturucu etkisi altında araç kullanılması',
        'Aracın yazılı izin olmadan yurt dışına çıkarılması',
        'Aracın üçüncü kişilere kiralanması veya devredilmesi',
      ],
    },
  ],
};

@Component({
  imports: [],
  templateUrl: './rental-terms.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RentalTerms {}
