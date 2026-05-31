import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`📦 *يا ملكة، يرجى كتابة اسم التطبيق المراد تحميله بعد الأمر!*\n\n*💡 مثال:* \n• \`${usedPrefix + command} whatsapp\`\n• \`${usedPrefix + command} subwaysurfers\``);

    await m.reply(`🚀 *جاري فحص سيرفرات الأندرويد الآمنة وسحب ملف الـ APK لتطبيق [ ${text} ]...*`);

    try {
        // استخدام سيرفر بديل مستقر وقوي لجلب تطبيقات الأندرويد
        const searchUrl = `https://api.dreaded.site/api/apkdownloader?apk=${encodeURIComponent(text)}`;
        const res = await axios.get(searchUrl);

        if (!res.data || !res.data.result || !res.data.result.download) {
            return m.reply("❌ *تعذر العثور على هذا التطبيق. تأكدي من كتابة الاسم بالإنجليزية بشكل صحيح (مثال: facebook).*");
        }

        const apk = res.data.result;

        let apkReport = `*━━━━━━╎ ❨ 📦 𝐀𝐏𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 ❩╎━━━━━━*\n`;
        apkReport += `*❖┋ تفاصيل التطبيق المكتشف بنجاح ➢*\n`;
        apkReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
        apkReport += `📱 *اسم التطبيق:* ${apk.name || text}\n`;
        apkReport += `📦 *اسم الحزمة:* \`${apk.package || 'com.apk.download'}\`\n`;
        apkReport += `⚖️ *الحجم:* ${apk.size || 'جاري الحساب...'}\n\n`;
        apkReport += `⚙️ _جاري رفع وإرسال الملف الأصلي إلى الواتساب الحين، انتظر ثواني..._\n\n`;
        apkReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

        // إرسال معلومات التطبيق مع أيقونة أندرويد فخمة كتمهيد
        await conn.sendFile(m.chat, apk.icon || 'https://cdn-icons-png.flaticon.com/512/226/226770.png', 'icon.png', apkReport, m);

        // إرسال ملف الـ APK الفعلي كتطبيق جاهز للتثبيت المباشر
        await conn.sendMessage(m.chat, {
            document: { url: apk.download },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${apk.name || text}.apk`
        }, { quoted: m });

    } catch (err) {
        console.error("APK Download Error:", err.message);
        return m.reply("❌ *عذراً يا ملكة، السيرفر يواجه ضغطاً في هذه اللحظة أو حجم التطبيق يتخطى قدرة الرفع. جربي تطبيقاً آخر أخف (مثل: facebook lite).*");
    }
};

handler.help = ['تحميل_تطبيق', 'apk'];
handler.tags = ['tools'];
handler.command = ['تحميل_تطبيق', 'تطبيق', 'apk', 'اي_بي_كي'];

export default handler;
