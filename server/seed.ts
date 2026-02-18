import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!,
     { auth: { persistSession: false, autoRefreshToken: false } }
);

async function main() {
     console.log('Veritabanı başlangıç verileri yükleniyor...');

     // 1. Admin
     const hashedPassword = await bcrypt.hash('admin123', 10);
     const { error: adminErr } = await supabase
          .from('Admin')
          .upsert({ id: 1, username: 'admin', password: hashedPassword }, { onConflict: 'username' });
     if (adminErr) console.error('Admin error:', adminErr);
     else console.log('✓ Yönetici hesabı: admin / admin123');

     // 2. Activities
     const activities = [
          { title: 'Sohbet Programları', description: 'Gönüllere şifa, akıllara nur olan haftalık tasavvuf ve ilim sohbetlerimiz.', icon: 'Users', sortOrder: 1 },
          { title: 'Zikir Meclisleri', description: 'Kalplerin cilası, ruhların gıdası olan geleneksel zikir halkalarımız.', icon: 'Moon', sortOrder: 2 },
          { title: 'İlim Dersleri', description: 'Fıkıh, Akaid ve Siyer alanında yetkin hocalarımızla düzenli dersler.', icon: 'BookOpen', sortOrder: 3 },
          { title: 'Sosyal Yardım', description: 'İhtiyaç sahibi ailelere erzak, giyim ve maddi yardım faaliyetleri.', icon: 'HeartHandshake', sortOrder: 4 },
          { title: 'Özel Günler', description: 'Kandil geceleri ve bayramlaşma programlarıyla manevi iklimi paylaşıyoruz.', icon: 'Star', sortOrder: 5 },
          { title: 'Musiki Meşki', description: 'Tasavvuf musikisi ve ilahi meşkleri ile ruhu dinlendiren nağmeler.', icon: 'Music', sortOrder: 6 },
     ];
     const { error: actErr } = await supabase.from('Activity').upsert(activities.map((a, i) => ({ id: i + 1, ...a })));
     if (actErr) console.error('Activity error:', actErr);
     else console.log(`✓ ${activities.length} faaliyet eklendi.`);

     // 3. Events
     const events = [
          { title: 'Haftalık Gönül Sohbeti', date: '12 Ekim 2023', time: '20:30', location: 'Dernek Merkezi, Fatih', category: 'Sohbet' },
          { title: 'Geleneksel Perşembe Zikri', date: '14 Ekim 2023', time: '21:15', location: 'Dernek Merkezi, Ana Salon', category: 'Zikir' },
          { title: 'Sabah Namazı Buluşması', date: '15 Ekim 2023', time: '06:00', location: 'Sultanahmet Camii', category: 'Özel' },
     ];
     const { error: evtErr } = await supabase.from('Event').upsert(events.map((e, i) => ({ id: i + 1, ...e })));
     if (evtErr) console.error('Event error:', evtErr);
     else console.log(`✓ ${events.length} etkinlik eklendi.`);

     // 4. Gallery Images
     const images = [
          { src: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=600&fit=crop', alt: 'Zikir Halkası', category: 'Zikir' },
          { src: 'https://images.unsplash.com/photo-1585036156171-384164a8c721?w=800&h=600&fit=crop', alt: 'Sohbet Meclisi', category: 'Sohbet' },
          { src: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&h=600&fit=crop', alt: 'İftar Programı', category: 'Özel' },
     ];
     const { error: imgErr } = await supabase.from('GalleryImage').upsert(images.map((img, i) => ({ id: i + 1, ...img })));
     if (imgErr) console.error('Gallery error:', imgErr);
     else console.log(`✓ ${images.length} galeri görseli eklendi.`);

     // 5. Site Settings
     const { error: setErr } = await supabase.from('SiteSettings').upsert({
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
     });
     if (setErr) console.error('Settings error:', setErr);
     else console.log('✓ Site ayarları yüklendi.');

     console.log('──────────────────────────────────');
     console.log('✅ Tüm başlangıç verileri başarıyla yüklendi!');
}

main().catch((e) => {
     console.error('Hata:', e);
     process.exit(1);
});
