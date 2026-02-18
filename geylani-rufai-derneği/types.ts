import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface Activity {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Sohbet' | 'Zikir' | 'Özel';
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}