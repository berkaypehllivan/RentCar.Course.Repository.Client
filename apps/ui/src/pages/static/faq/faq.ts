import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FaqCategory } from './faq.model';
import { RouterLink } from '@angular/router';

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: 'Rezervasyon',
    icon: 'bi-calendar-check',
    items: [
      {
        question: 'Üye olmadan rezervasyon yapabilir miyim?',
        answer:
          'Araçları ve fiyatları üye olmadan inceleyebilirsiniz. Ödeme adımına geçerken giriş yapmanız veya üye olmanız gerekir.',
      },
      {
        question: 'Rezervasyonumu nasıl iptal ederim?',
        answer:
          'Profil sayfanızdaki "Kiralamalarım" bölümünden ilgili kiralamanın detayına girerek iptal edebilirsiniz.',
      },
      {
        question: 'Geçmiş rezervasyonlarımı nerede görürüm?',
        answer:
          'Profil sayfanızdaki "Kiralamalarım" bölümünde tüm kiralamalarınızı ve detaylarını görebilirsiniz.',
      },
    ],
  },
  {
    title: 'Sürücü ve Belgeler',
    icon: 'bi-person-vcard',
    items: [
      {
        question: 'Araç kiralamak için yaş sınırı var mı?',
        answer:
          "Minimum yaş 21'dir. Üst segment araçlarda 25 yaş şartı aranır. Ayrıca sürücü belgenizin en az 2 yıllık olması gerekir.",
      },
      {
        question: 'Teslim alırken hangi belgeler gerekir?',
        answer:
          'Geçerli sürücü belgeniz, kimliğiniz veya pasaportunuz ve depozito için kullanılacak kredi kartınız gerekir.',
      },
      {
        question: 'Ek sürücü ekleyebilir miyim?',
        answer:
          'Evet. Ek sürücünün de kiralama için gereken yaş ve ehliyet şartlarını taşıması gerekir.',
      },
    ],
  },
  {
    title: 'Ödeme ve Depozito',
    icon: 'bi-credit-card',
    items: [
      {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer: 'Rezervasyon sırasında kredi kartı ile ödeme alınır.',
      },
      {
        question: 'Depozito nedir, ne zaman iade edilir?',
        answer:
          'Depozito, teslim sırasında kartınızda bloke edilen güvence tutarıdır. Araç hasarsız ve eksiksiz iade edildikten sonra serbest bırakılır. Bankanıza göre birkaç iş günü sürebilir.',
      },
      {
        question: 'Fiyatlara KDV dahil mi?',
        answer:
          'Evet, gösterilen fiyatlara KDV dahildir. Seçtiğiniz koruma paketleri ve ekstralar toplam tutara eklenir.',
      },
    ],
  },
  {
    title: 'Kullanım ve İade',
    icon: 'bi-speedometer2',
    items: [
      {
        question: 'Aracı geç iade edersem ne olur?',
        answer:
          'İlk 1 saat tolerans tanınır. Sonrasında ek gün ücreti uygulanabilir.',
      },
      {
        question: 'Kilometre sınırı var mı?',
        answer:
          'Günlük kilometre sınırı araç detayında belirtilir. Aşan kilometreler için şube fiyat listesindeki ücret uygulanır.',
      },
      {
        question: 'Kaza veya arıza durumunda ne yapmalıyım?',
        answer:
          'Güvenliğinizi sağladıktan sonra en kısa sürede şubemize ve gerekiyorsa ilgili makamlara haber verin. Sorumluluğunuz seçtiğiniz koruma paketine göre değişir.',
      },
    ],
  },
];
@Component({
  imports: [RouterLink],
  templateUrl: './faq.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Faq {
  readonly categories = FAQ_CATEGORIES;
  readonly openQuestion = signal<string | null>(null);

  toggle(question: string) {
    this.openQuestion.update((current) =>
      current === question ? null : question,
    );
  }
}
