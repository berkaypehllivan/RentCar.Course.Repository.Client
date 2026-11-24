export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}
