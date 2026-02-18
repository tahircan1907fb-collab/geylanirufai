import { BookOpen, HeartHandshake, Users, Music, Moon, Star } from "lucide-react";
import { Activity, Event, GalleryImage, NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Ana Sayfa", href: "#home" },
  { label: "Hakkımızda", href: "#about" },
  { label: "Faaliyetler", href: "#activities" },
  { label: "Etkinlikler", href: "#events" },
  { label: "Galeri", href: "#gallery" },
  { label: "Bağış", href: "#donate" },
  { label: "İletişim", href: "#contact" },
];

export const ACTIVITIES: Activity[] = [
  {
    title: "Sohbet Programları",
    description: "Gönüllere şifa, akıllara nur olan haftalık tasavvuf ve ilim sohbetlerimiz.",
    icon: Users,
  },
  {
    title: "Zikir Meclisleri",
    description: "Kalplerin cilası, ruhların gıdası olan geleneksel zikir halkalarımız.",
    icon: Moon,
  },
  {
    title: "İlim Dersleri",
    description: "Fıkıh, Akaid ve Siyer alanında yetkin hocalarımızla düzenli dersler.",
    icon: BookOpen,
  },
  {
    title: "Sosyal Yardım",
    description: "İhtiyaç sahibi ailelere erzak, giyim ve maddi yardım faaliyetleri.",
    icon: HeartHandshake,
  },
  {
    title: "Özel Günler",
    description: "Kandil geceleri ve bayramlaşma programlarıyla manevi iklimi paylaşıyoruz.",
    icon: Star,
  },
  {
    title: "Musiki Meşki",
    description: "Tasavvuf musikisi ve ilahi meşkleri ile ruhu dinlendiren nağmeler.",
    icon: Music,
  },
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: 1,
    title: "Haftalık Gönül Sohbeti",
    date: "12 Ekim 2023",
    time: "20:30",
    location: "Dernek Merkezi, Fatih",
    category: "Sohbet"
  },
  {
    id: 2,
    title: "Geleneksel Perşembe Zikri",
    date: "14 Ekim 2023",
    time: "21:15",
    location: "Dernek Merkezi, Ana Salon",
    category: "Zikir"
  },
  {
    id: 3,
    title: "Sabah Namazı Buluşması",
    date: "15 Ekim 2023",
    time: "06:00",
    location: "Sultanahmet Camii",
    category: "Özel"
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, src: "https://picsum.photos/800/600?random=1", alt: "Zikir Halkası", category: "Zikir" },
  { id: 2, src: "https://picsum.photos/800/600?random=2", alt: "Sohbet Meclisi", category: "Sohbet" },
  { id: 3, src: "https://picsum.photos/800/600?random=3", alt: "İftar Programı", category: "Özel" },
  { id: 4, src: "https://picsum.photos/800/600?random=4", alt: "Kütüphane", category: "İlim" },
  { id: 5, src: "https://picsum.photos/800/600?random=5", alt: "Yardım Dağıtımı", category: "Yardım" },
  { id: 6, src: "https://picsum.photos/800/600?random=6", alt: "Dernek Girişi", category: "Mekan" },
];