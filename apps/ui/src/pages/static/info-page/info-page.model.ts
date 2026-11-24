export interface InfoSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface InfoPageContent {
  title: string;
  icon: string;
  updatedAt: string;
  sections: InfoSection[];
}
