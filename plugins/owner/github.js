import axios from 'axios';
import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🐙 *يا ملكة، يرجى كتابة اسم أو كلمة مفتاحية للبحث عن المستودعات في جيت هاب!* \n\n*💡 مثال:* \n• \`${usedPrefix + command} hawary-bot\``);

    await m.reply(`🔍 *جاري البحث في جيت هاب عن المستودعات التي تحمل اسم [ ${text} ]...*`);

    try {
        // البحث عن المستودعات باستخدام GitHub Search API الرسمي (يجلب أفضل 5 نتائج متطابقة)
        const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=5`;
        const res = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!res.data || !res.data.items || res.data.items.length === 0) {
            return m.reply("❌ *لم يتم العثور على أي مستودعات بهذا الاسم. تأكدي من كلمة البحث.*");
        }

        const repos = res.data.items;

        let report = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐒𝐄𝐀𝐑𝐂𝐇 ❩╎━━━━━━*\n`;
        report += `*❖┋ نتائج البحث عن:* [ ${text} ] ➢*\n`;
        report += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
        report += `✨ *المستودعات المكتشفة حية الآن:*\n\n`;

        repos.forEach((item, index) => {
            report += `*${index + 1}️⃣ - ${item.full_name}*\n`;
            report += `⭐ النجوم: ${item.stargazers_count} | 💻 اللغة: ${item.language || 'غير محددة'}\n`;
            report += `📝 الوصف: ${item.description || 'لا يوجد وصف متاح.'}\n\n`;
        });

        report += `⚙️ _اضغطي على الأزرار التفاعلية أدناه لتصفح وفحص ملفات أي مستودع فوراً!_`;

        // 🔘 بناء الأزرار التفاعلية للمستودعات التي ظهرت في البحث لتسهيل الاختيار
        const buttons = repos.map((item) => ({
            buttonId: `${usedPrefix}جيت ${item.full_name}`,
            buttonText: { displayText: `📂 تصفح: ${item.name}` },
            type: 1
        }));

        const buttonMessage = {
            text: report,
            footer: `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*\n> _نظام البحث الذكي عن السورسات_ ⚡`,
            buttons: buttons,
            headerType: 1
        };

        const msgGenerated = generateWAMessageFromContent(m.chat, { buttonsMessage: buttonMessage }, { quoted: m });
        return await conn.relayMessage(m.chat, msgGenerated.message, { messageId: msgGenerated.key.id });

    } catch (err) {
        console.error(err);
        return m.reply("❌ *حدث خطأ أثناء الاتصال بخوادم جيت هاب. جربي مرة أخرى لاحقاً.*");
    }
};

handler.help = ['بحث_جيت', 'searchrepo'];
handler.tags = ['tools'];
handler.command = ['1بحث_جيت', 'جيت', 'searchrepo', 'srepo'];

export default handler;
