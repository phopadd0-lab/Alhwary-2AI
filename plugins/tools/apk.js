import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`📦 *يا ملكة، يرجى كتابة اسم التطبيق المراد تحميله بعد الأمر!*\n\n*💡 مثال:* \n• \`${usedPrefix + command} whatsapp\`\n• \`${usedPrefix + command} facebook lite\``);

    await m.reply(`🚀 *جاري البحث في سيرفرات الأندرويد واختراق رابط الـ APK لتطبيق [ ${text} ]...*`);

    try {
        // الاستعلام من API متطور ومفتوح لجلب روابط تطبيقات الأندرويد المباشرة
        const searchUrl = `https://api.shizuka.md/apk?query=${encodeURIComponent(text)}`;
        const res = await axios.get(searchUrl);

        if (!res.data || !res.data.result) {
            return m.reply("❌ *تعذر العثور على التطبيق المطلـوب، تأكدي من كتابة الاسم بالإنجليزية بشكل صحيح.*");
        }

        const apk = res.data.result;

        // التحقق من حجم الملف لحماية البوت من التهنيج (أقصى حد 100 ميجا مثلاً)
        const fileSizeInMB = parseFloat(apk.size);
        if (fileSizeInMB > 100) {
            return m.reply(`⚠️ *عذراً يا ملكة، حجم التطبيق كبير جداً (${apk.size}). البوت يدعم تحميل الملفات حتى 100 ميجا فقط لحماية السيرفر.*`);
        }

        let apkReport = `*━━━━━━╎ ❨ 📦 𝐀𝐏𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 ❩╎━━━━━━*\n`;
        apkReport += `*❖┋ تفاصيل التطبيق المكتشف ➢*\n`;
        apkReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
        apkReport += `📱 *اسم التطبيق:* ${apk.name}\n`;
        apkReport += `📦 *اسم الحزمة:* \`${apk.package}\`\n`;
        apkReport += `⚖️ *الحجم:* ${apk.size}\n`;
        apkReport += `🗓️ *آخر تحديث:* ${apk.last_updated || 'مؤخراً'}\n\n`;
        apkReport += `⚙️ _جاري رفع وإرسال ملف الـ APK الحين، انتظر ثواني..._\n\n`;
        apkReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

        // إرسال صورة التطبيق ومعلوماته أولاً
        await conn.sendFile(m.chat, apk.icon || 'https://cdn-icons-png.flaticon.com/512/226/226770.png', 'icon.png', apkReport, m);

        // إرسال ملف الـ APK الفعلي ليتم تثبيته فوراً
        await conn.sendMessage(m.chat, {
            document: { url: apk.download_url },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${apk.name}.apk`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        return m.reply("❌ *حدث خطأ أثناء سحب ملف الـ APK. تأكدي من أن التطبيق مجاني ومتوفر على متجر جوجل.*");
    }
};

handler.help = ['تحميل_تطبيق', 'apk'];
handler.tags = ['tools'];
handler.command = ['تحميل_تطبيق', 'تطبيق', 'apk', 'اي_بي_كي'];

export default handler;
