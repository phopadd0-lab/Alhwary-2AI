import os from 'os';
import crypto from 'crypto';

const handler = async (m, { conn, command, text }) => {

    // 1️⃣ أمر: إحسب-الحروف
    if (/إحسب-الحروف|احسب_الحروف|احسب-الحروف/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو اعمل ريبلاي على رسالة عشان أحسب حروفها!*");
        let txt = text || m.quoted.text || '';
        let charCount = txt.length;
        let wordCount = txt.trim().split(/\s+/).filter(w => w.length > 0).length;
        return m.reply(`📝 *تحليل النص بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:*\n\n🔢 *عدد الحروف:* ${charCount}\n🔠 *عدد الكلمات:* ${wordCount}`);
    }

    // 2️⃣ أمر: إختصار
    if (/إختصار|اختصار/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب الرابط الطويل اللي تبي تختصره!* \n> مثال: .إختصار https://google.com");
        await m.reply("⏳ *جاري اختصار الرابط داخلياً...*");
        try {
            let res = await global.fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text.trim())}`);
            let shortUrl = await res.text();
            if (shortUrl.startsWith('http')) {
                return m.reply(`🔗 *تم اختصار رابطك بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:*\n\n${shortUrl}`);
            } else {
                throw new Error();
            }
        } catch {
            return m.reply(`🔗 *رابطك المختصر السريع:*\nhttps://tinyurl.com/api-create.php?url=${encodeURIComponent(text.trim())}`);
        }
    }

    // 3️⃣ أمر: أي-بي
    if (/أي-بي|اي_بي|اي-بي/.test(command)) {
        let ip = text ? text.trim() : '8.8.8.8';
        await m.reply(`🔍 *جاري فحص الـ IP [ ${ip} ]...*`);
        try {
            let res = await global.fetch(`http://ip-api.com/json/${ip}`);
            let json = await res.json();
            if (json.status !== 'success') return m.reply("❌ *الـ IP غير صحيح!*");

            let ipInfo = `🌐 *بيانات الـ IP بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:*\n\n`;
            ipInfo += `📍 *الدولة:* ${json.country}\n`;
            ipInfo += `🏙️ *المدينة:* ${json.city}\n`;
            ipInfo += `📶 *الشركة المزودة:* ${json.isp}\n`;
            ipInfo += `🖥️ *الـ IP:* ${json.query}`;
            return m.reply(ipInfo);
        } catch {
            return m.reply("❌ *فشل الاتصال بموقع الفحص.*");
        }
    }

    // 4️⃣ أمر: بنج
    if (/بنج|ping/.test(command)) {
        const start = performance.now();
        await m.reply('⚡...');
        const end = performance.now();
        return m.reply(`📶 *بنج السيستم بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:* \`${(end - start).toFixed(0)} مللي ثانية\``);
    }

    // 5️⃣ أمر: بي-دي-اف
    if (/بي-دي-اف|بي_دي_اف|بيديأف/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو اعمل ريبلاي لتحويله لملف PDF!*");
        let txt = text || m.quoted.text || '';
        await m.reply("⏳ *جاري إنشاء ملف PDF...*");
        return await conn.sendMessage(m.chat, { 
            document: Buffer.from(txt), 
            mimetype: 'application/pdf', 
            fileName: `ALHWARY_${Date.now()}.pdf` 
        }, { quoted: m });
    }

    // 6️⃣ أمر: تشويش
    if (/تشويش|تشفير/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو الكود اللي تبي تشوشه!*");
        let txt = text || m.quoted.text || '';
        let obfuscated = Buffer.from(txt).toString('base64');
        return m.reply(`✨ *تم تشويش النص بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:* \n\n\`\`\`${obfuscated}\`\`\``);
    }

    // 7️⃣ أمر: دي-أن-أس
    if (/دي-أن-أس|دي-ان-اس|دي_ان_اس/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب رابط الموقع أو الدومين!*");
        await m.reply(`🧪 *جاري فحص النطاق...*`);
        try {
            let res = await global.fetch(`https://dns.google/resolve?name=${encodeURIComponent(text.trim())}`);
            let json = await res.json();
            if (!json.Answer) return m.reply("❌ *لا يوجد سجلات DNS!*");
            let ips = json.Answer.filter(a => a.type === 1).map(a => `📍 ${a.data}`).join('\n');
            return m.reply(`🧪 *سجلات الـ IPs بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:*\n\n${ips || 'لا يوجد سجلات A علنية'}`);
        } catch {
            return m.reply("❌ *تعذر فحص سجلات DNS.*");
        }
    }

    // 8️⃣ أمر: فحص-الموقع
    if (/فحص-الموقع|فحص_الموقع/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب رابط الموقع!*");
        let url = text.trim().startsWith('http') ? text.trim() : `https://${text.trim()}`;
        await m.reply("🔍 *جاري فحص الموقع...*");
        try {
            let res = await global.fetch(url, { method: 'HEAD' });
            return m.reply(`✅ *تقرير الفحص بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥:*\n\n🌐 *الموقع:* ${url}\n🚦 *الحالة:* ${res.status} ${res.statusText}`);
        } catch {
            return m.reply(`❌ *الموقع لا يستجيب.*`);
        }
    }

    // 9️⃣ أمر: هيدر
    if (/هيدر|الهيدر/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب رابط الموقع لجلب الهيدر!*");
        let url = text.trim().startsWith('http') ? text.trim() : `https://${text.trim()}`;
        await m.reply("🧾 *جاري قراءة الـ Headers...*");
        try {
            let res = await global.fetch(url);
            let headersText = `🧾 *Headers بواسطة 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥 لـ ${url}:*\n\n\`\`\``;
            res.headers.forEach((value, key) => {
                headersText += `${key}: ${value}\n`;
            });
            headersText += `\`\`\``;
            return m.reply(headersText);
        } catch {
            return m.reply("❌ *فشل جلب الهيدر!*");
        }
    }
};

handler.help = ['programming'];
handler.tags = ['coding'];
handler.category = "𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥";

handler.command = [
    'إحسب-الحروف','احسب_الحروف','احسب-الحروف',
    'إختصار','اختصار','إختصار-إنشاء','اختصار_انشاء','اختصار-انشاء',
    'أي-بي','اي_بي','اي-بي','ايبى',
    'بنج','ping',
    'بي-دي-اف','بيديأف','بي_دي_اف',
    'تشويش','تشفير',
    'دي-أن-أس','دي_ان_اس','دي-ان-اس',
    'فحص-الموقع','فحص_الموقع',
    'هيدر','الهيدر'
];

export default handler;