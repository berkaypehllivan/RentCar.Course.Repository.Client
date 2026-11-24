import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { InfoPageContent } from '../info-page/info-page.model';

export const PRIVACY_POLICY: InfoPageContent = {
  title: 'KVKK ve Gizlilik Politikası',
  icon: 'bi-shield-check',
  updatedAt: '24 Kasım 2026',
  sections: [
    {
      title: 'Veri Sorumlusu',
      paragraphs: [
        '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla Şirketimiz tarafından aşağıda açıklanan çerçevede işlenmektedir.',
      ],
    },
    {
      title: 'İşlenen Kişisel Veriler',
      items: [
        'Kimlik bilgileri: ad, soyad, doğum tarihi',
        'İletişim bilgileri: e-posta adresi, telefon numarası',
        'Sürücü belgesi bilgileri',
        'Rezervasyon ve kiralama bilgileri: tarihler, şubeler, seçilen araç ve ekstralar',
        'İşlem güvenliği bilgileri: oturum ve giriş kayıtları',
      ],
    },
    {
      title: 'Kişisel Verilerin İşlenme Amaçları',
      items: [
        'Üyelik oluşturulması ve hesabın yönetilmesi',
        'Rezervasyon ve kiralama sözleşmesinin kurulması ve yürütülmesi',
        'Ödeme ve faturalandırma süreçlerinin yürütülmesi',
        'Müşteri destek taleplerinin yanıtlanması',
        'Bilgi güvenliği süreçlerinin yürütülmesi',
        'Yasal yükümlülüklerin yerine getirilmesi',
      ],
    },
    {
      title: 'Hukuki Sebepler',
      paragraphs: [
        'Verileriniz; sözleşmenin kurulması ve ifası, hukuki yükümlülüğün yerine getirilmesi, meşru menfaat ve gerekli hallerde açık rızanız hukuki sebeplerine dayanılarak işlenir.',
      ],
    },
    {
      title: 'Verilerin Aktarılması',
      paragraphs: [
        'Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olmak üzere; ödeme hizmeti sağlayıcılarına, e-posta ve bildirim hizmeti sağlayıcılarına, yetkili kamu kurum ve kuruluşlarına ve hizmet aldığımız bilgi teknolojileri iş ortaklarına aktarılabilir.',
      ],
    },
    {
      title: 'Saklama Süresi',
      paragraphs: [
        'Verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen saklama süreleri kadar muhafaza edilir. Sürenin sonunda silinir, yok edilir veya anonim hale getirilir.',
      ],
    },
    {
      title: 'KVKK Kapsamındaki Haklarınız',
      paragraphs: [
        "KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:",
      ],
      items: [
        'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
        'İşlenmişse buna ilişkin bilgi talep etme',
        'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
        'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
        'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
        'Kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
        'Bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
        'Otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme',
        'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme',
      ],
    },
    {
      title: 'Başvuru Yöntemi',
      paragraphs: [
        'Haklarınıza ilişkin taleplerinizi İletişim sayfamızda yer alan kanallar üzerinden bize iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.',
      ],
    },
  ],
};
@Component({
  imports: [],
  templateUrl: './privacy-policy.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrivacyPolicy {}
