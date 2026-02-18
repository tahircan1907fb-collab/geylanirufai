import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSQLite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
     console.log('Veritabanı başlangıç verileri yükleniyor...');

     // 1. Yönetici Hesabı
     const hashedPassword = await bcrypt.hash('admin123', 10);
     await prisma.admin.upsert({
          where: { username: 'admin' },
          update: {},
          create: { username: 'admin', password: hashedPassword },
     });
     console.log('✓ Yönetici hesabı: admin / admin123');

     // 2. Faaliyetler
     const activities = [
          {
               title: 'Sohbet Programları',
               description: 'Gönüllere şifa, akıllara nur olan haftalık tasavvuf ve ilim sohbetlerimiz.',
               icon: 'Users',
               sortOrder: 1,
          },
          {
               title: 'Zikir Meclisleri',
               description: 'Kalplerin cilası, ruhların gıdası olan geleneksel zikir halkalarımız.',
               icon: 'Moon',
               sortOrder: 2,
          },
          {
               title: 'İlim Dersleri',
               description: 'Fıkıh, Akaid ve Siyer alanında yetkin hocalarımızla düzenli dersler.',
               icon: 'BookOpen',
               sortOrder: 3,
          },
          {
               title: 'Sosyal Yardım',
               description: 'İhtiyaç sahibi ailelere erzak, giyim ve maddi yardım faaliyetleri.',
               icon: 'HeartHandshake',
               sortOrder: 4,
          },
          {
               title: 'Özel Günler',
               description: 'Kandil geceleri ve bayramlaşma programlarıyla manevi iklimi paylaşıyoruz.',
               icon: 'Star',
               sortOrder: 5,
          },
          {
               title: 'Musiki Meşki',
               description: 'Tasavvuf musikisi ve ilahi meşkleri ile ruhu dinlendiren nağmeler.',
               icon: 'Music',
               sortOrder: 6,
          },
     ];
     for (const a of activities) {
          await prisma.activity.create({ data: a }).catch(() => { });
     }
     console.log(`✓ ${activities.length} faaliyet eklendi.`);

     // 3. Etkinlikler
     const events = [
          {
               title: 'Haftalık Gönül Sohbeti',
               date: '12 Ekim 2023',
               time: '20:30',
               location: 'Dernek Merkezi, Fatih',
               category: 'Sohbet',
          },
          {
               title: 'Geleneksel Perşembe Zikri',
               date: '14 Ekim 2023',
               time: '21:15',
               location: 'Dernek Merkezi, Ana Salon',
               category: 'Zikir',
          },
          {
               title: 'Sabah Namazı Buluşması',
               date: '15 Ekim 2023',
               time: '06:00',
               location: 'Sultanahmet Camii',
               category: 'Özel',
          },
     ];
     for (const e of events) {
          await prisma.event.create({ data: e }).catch(() => { });
     }
     console.log(`✓ ${events.length} etkinlik eklendi.`);

     // 4. Galeri Görselleri
     const images = [
          {
               src: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=600&fit=crop',
               alt: 'Zikir Halkası',
               category: 'Zikir',
          },
          {
               src: 'https://images.unsplash.com/photo-1585036156171-384164a8c721?w=800&h=600&fit=crop',
               alt: 'Sohbet Meclisi',
               category: 'Sohbet',
          },
          {
               src: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&h=600&fit=crop',
               alt: 'İftar Programı',
               category: 'Özel',
          },
     ];
     for (const img of images) {
          await prisma.galleryImage.create({ data: img }).catch(() => { });
     }
     console.log(`✓ ${images.length} galeri görseli eklendi.`);

     // 5. Site Ayarları
     await prisma.siteSettings.upsert({
          where: { id: 1 },
          update: {},
          create: {
               id: 1,
               aboutTitle: 'Köklerimiz Mazide, Gözümüz Atide',
               aboutText1: "Derneğimiz, asırlardır Anadolu'yu ve gönül coğrafyamızı mayalayan tasavvuf neşesini, modern çağın insanına ulaştırmak gayesiyle kurulmuştur. Kadim Geylani ve Rufai yollarının birleştirici, sevgi dolu ve hizmet eksenli anlayışını şiar ediniyoruz.",
               aboutText2: 'Misyonumuz; ilim, irfan ve hikmet ekseninde, yaratılanı Yaratandan ötürü seven, topluma faydalı, maneviyatı güçlü bireylerin yetişmesine katkı sağlamaktır.',
               aboutQuote: 'Gaye rızadır, vasıta hizmettir.',
               iban: 'TR12 0006 1000 0000 1234 5678 90',
               ibanHolder: 'Geylani Rufai Tasavvuf ve Kültür Derneği',
               phone: '+90 212 555 12 34',
               phone2: '+90 532 123 45 67',
               email: 'iletisim@geylanirufai.org.tr',
               address: 'Molla Gürani Mah. İlim Sok. No: 12\nFatih / İstanbul',
               workingHoursWeekday: '09:00 - 18:00',
               workingHoursSaturday: '10:00 - 15:00',
               workingHoursSunday: 'Kapalı',
               instagram: '#',
               facebook: '#',
               youtube: '#',
               whatsapp: '',
          },
     });
     console.log('✓ Site ayarları yüklendi.');
     console.log('──────────────────────────────────');
     console.log('✅ Tüm başlangıç verileri başarıyla yüklendi!');
}

main()
     .catch((e) => {
          console.error('Hata:', e);
          process.exit(1);
     })
     .finally(() => prisma.$disconnect());
