import cheerio from 'cheerio';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`📦 *يا ملكة، يرجى كتابة اسم التطبيق المراد تحميله بعد الأمر!*\n\n*💡 مثال:* \n• \`${usedPrefix + command} whatsapp\`\n• \`${usedPrefix + command} facebook lite\``);

    await m.reply(`🚀 *جاري فحص محرك APKPure وسحب التطبيق الأصلي لـ [ ${text} ]...*`);

    try {
        // 1️⃣ البحث عن التطبيق داخل موقع APKPure الرسمي
        const searchUrl = `https://apkpure.com/ar/search?q=${encodeURIComponent(text)}`;
        const searchRes = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        
        const $ = cheerio.load(searchRes.data);
        const firstResult = $('.search-res .first-item a').attr('href') || $('.da a').attr('href');

        if (!firstResult) {
            return m.reply("❌ *تعذر العثور على التطبيق في محرك البحث. تأكدي من كتابة الاسم بالإنجليزية بشكل صحيح.*");
        }

        // 2️⃣ الدخول لصفحة التحميل المباشر للتطبيق
        const appUrl = firstResult.startsWith('http') ? firstResult : `https://apkpure.com${firstResult}`;
        const downloadPageUrl = `${appUrl}/download?from=details`;
        
        const downloadRes = await axios.get(downloadPageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        
        const $$ = cheerio.load(downloadRes.data);
        const downloadLink = $$('a.download-start-btn').attr('href') || $$('#download_link').attr('href');

        if (!downloadLink) {
            return m.reply("❌ *فشل استخراج رابط التحميل المباشر من السيرفر الحين.*");
        }

        // 3️⃣ استخراج بيانات واضحة للتطبيق لعرضها في الشات
        const appName = $$('.title-like h1').text() || text;

        let apkReport = `*━━━━━━╎ ❨ 📦 𝐀𝐏𝐊𝐏𝐔𝐑𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 ❩╎━━━━━━*\n`;
        apkReport += `*❖┋ سحب التطبيق مباشرة من محرك البحث العالمي ➢*\n`;
        apkReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
        apkReport += `📱 *اسم التطبيق:* ${appName.trim()}\n`;
        apkReport += `⚙️ _جاري تحميل الملف من السيرفر الأصلي ورفعه للواتساب الحين، انتظر قليلاً..._\n\n`;
        apkReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

        await m.reply(apkReport);

        // 4️⃣ إرسال ملف الـ APK الفعلي القادم من سيرفر APKPure مباشرة
        await conn.sendMessage(m.chat, {
            document: { url: downloadLink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${text}.apk`
        }, { quoted: m });

    } catch (err) {
        console.error("APKPure Scraping Error:", err.message);
        return m.reply("❌ *عذراً يا ملكة، واجه السيرفر مشكلة أثناء سحب الملف. جربي تطبيقاً آخر خفيفاً ومتاحاً للجميع.*");
    }
};

handler.help = ['تطبيق', 'apk'];
handler.tags = ['tools'];
handler.command = ['تحميل_تطبيق', 'تطبيق', 'apk', 'اي_بي_كي'];

export default handler;
