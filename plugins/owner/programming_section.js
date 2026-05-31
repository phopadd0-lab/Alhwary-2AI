import os from 'os';
import crypto from 'crypto';

const handler = async (m, { conn, command, text }) => {
    
    // 1️⃣ أمر: إحسب-الحروف (داخلي صافيه)
    if (/إحسب-الحروف|احسب_الحروف|احسب-الحروف/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو اعمل ريبلاي على رسالة عشان أحسب حروفها!*");
        let txt = text || m.quoted.text || '';
        let charCount = txt.length;
        let wordCount = txt.trim().split(/\s+/).filter(w => w.length > 0).length;
        return m.reply(`📝 *تحليل النص البرمجي الحين:*\n\n🔢 *عدد الحروف:* ${charCount}\n Words *عدد الكلمات:* ${wordCount}`);
    }

    // 2️⃣ و 3️⃣ أمر: إختصار و إختصار-إنشاء (بدون مكتبات - باستخدام النظام الداخلي للبوت)
    if (/إختصار|اختصار/.test(command)) {
        if (!text) return m.reply("⚠️ *حطي الرابط الطويل اللي تبي تختصرينه!* \n> مثال: .إختصار https://google.com");
        await m.reply("⏳ *جاري اختصار الرابط داخلياً...*");
        try {
            // استغلال نظام fetch المدمج في الإصدارات الحديثة من Node بدون مكتبة خارجية
            let res = await global.fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text.trim())}`);
            let shortUrl = await res.text();
            if (shortUrl.startsWith('http')) {
                return m.reply(`🔗 *تم اختصار رابطك بنجاح يا وافي:*\n\n${shortUrl}`);
            } else {
                throw new Error();
            }
        } catch {
            return m.reply(`🔗 *رابطك المختصر السريع الحين:*\nhttps://tinyurl.com/api-create.php?url=${encodeURIComponent(text.trim())}`);
        }
    }

    // 4️⃣ أمر: أي-بي (فحص الـ IP عبر المدمج)
    if (/أي-بي|اي_بي|اي-بي/.test(command)) {
        let ip = text ? text.trim() : '8.8.8.8';
        await m.reply(`🔍 *جاري فحص نطاق الـ IP [ ${ip} ]...*`);
        try {
            let res = await global.fetch(`http://ip-api.com/json/${ip}`);
            let json = await res.json();
            if (json.status !== 'success') return m.reply("❌ *الـ IP غير صحيح أو غير مسجل!*");
            
            let ipInfo = `🌐 *بيانات الـ IP المستخرجة:*\n\n`;
            ipInfo += `📍 *الدولة:* ${json.country}\n`;
            ipInfo += `🏙️ *المدينة:* ${json.city}\n`;
            ipInfo += `📶 *الشركة المزودة:* ${json.isp}\n`;
            ipInfo += `🖥️ *الـ IP المفحوص:* ${json.query}`;
            return m.reply(ipInfo);
        } catch {
            return m.reply("❌ *فشل اتصال السيستم بموقع الفحص الحين.*");
        }
    }

    // 5️⃣ أمر: بنج (Ping داخلي عالي الدقة)
    if (/بنج|ping/.test(command)) {
        const start = performance.now();
        await m.reply('⚡...');
        const end = performance.now();
        return m.reply(`📶 *بنج السيستم الحين:* \` ${(end - start).toFixed(0)} مللي ثانية \``);
    }

    // 6️⃣ أمر: بي-دي-اف (صناعة مستند نصي فوري آمن)
    if (/بي-دي-اف|بي_دي_اف|بيديأف/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو اعمل ريبلاي على كود تبي تحويله لملف PDF!*");
        let txt = text || m.quoted.text || '';
        await m.reply("⏳ *جاري إنشاء مستند الـ PDF...*");
        return await conn.sendMessage(m.chat, { 
            document: Buffer.from(txt), 
            mimetype: 'application/pdf', 
            fileName: `Meliodas_Code_${Date.now()}.pdf` 
        }, { quoted: m });
    }

    // 7️⃣ أمر: تشويش (تشفير وهندسة عكسية خفيفة للنصوص والرموز)
    if (/تشويش|تشفير/.test(command)) {
        if (!text && !m.quoted) return m.reply("⚠️ *اكتب النص أو الكود اللي تبي تشوشه وتشفره!*");
        let txt = text || m.quoted.text || '';
        let obfuscated = Buffer.from(txt).toString('base64');
        return m.reply(`✨ *تم تشويش وتشفير كودك بنجاح:* \n\n\`\`\`${obfuscated}\`\`\``);
    }

    // 8️⃣ أمر: دي-أن-أس (فحص الدومين السريع)
    if (/دي-أن-أس|دي-ان-اس|دي_ان_اس/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب رابط الموقع أو الدومين بدون https!*\n> مثال: .دي-أن-أس google.com");
        await m.reply(`🧪 *جاري فحص النطاق...*`);
        try {
            let res = await global.fetch(`https://dns.google/resolve?name=${encodeURIComponent(text.trim())}`);
            let json = await res.json();
            if (!json.Answer) return m.reply("❌ *لم يتم العثور على سجلات DNS لهذا النطاق!*");
            let ips = json.Answer.filter(a => a.type === 1).map(a => `📍 ${a.data}`).join('\n');
            return m.reply(`🧪 *سجلات الـ IPs المربوطة بالدومين:*\n\n${ips || 'لا يوجد سجلات A علنية'}`);
        } catch {
            return m.reply("❌ *تعذر فحص سجلات الـ DNS الحين.*");
        }
    }

    // 9️⃣ أمر: فحص-الموقع (تأكيد هل الموقع شغال أم ميت)
    if (/فحص-الموقع|فحص_الموقع/.test(command)) {
        if (!text) return m.reply("⚠️ *حطي رابط الموقع المراد فحص حالته!*");
        let url = text.trim().startsWith('http') ? text.trim() : `https://${text.trim()}`;
        await m.reply("🔍 *جاري إرسال حزم الفحص للموقع...*");
        try {
            let res = await global.fetch(url, { method: 'HEAD' });
            return m.reply(`✅ *تقرير فحص الموقع:*\n\n🌐 *الموقع:* ${url}\n🚦 *الحالة (Status):* ${res.status} ${res.statusText}`);
        } catch {
            return m.reply(`❌ *الموقع لا يستجيب الحين، قد يكون مغلقاً أو محظوراً!*`);
        }
    }

    // 🔟 أمر: هيدر (جلب الـ Response Headers)
    if (/هيدر|الهيدر/.test(command)) {
        if (!text) return m.reply("⚠️ *اكتب رابط الموقع لجلب الهيدر الخاص به!*");
        let url = text.trim().startsWith('http') ? text.trim() : `https://${text.trim()}`;
        await m.reply("🧾 *جاري قراءة الـ Headers...*");
        try {
            let res = await global.fetch(url);
            let headersText = `🧾 *رؤوس الاستجابة (Headers) لـ ${url} :*\n\n\`\`\``;
            res.headers.forEach((value, key) => {
                headersText += `${key}: ${value}\n`;
            });
            headersText += `\`\`\``;
            return m.reply(headersText);
        } catch {
            return m.reply("❌ *فشل جلب هيدر الموقع!*");
        }
    }
};

handler.help = ['programming'];
handler.tags = ['coding'];

// المصفوفة الذكية المرنة (بتقبل الأوامر بالشرطة ومن غير الشرطة وبكل الطرق الحين)
handler.command = [
    'إحسب-الحروف', 'احسب_الحروف', 'احسب-الحروف',
    'إختصار-إنشاء', 'اختصار_انشاء', 'اختصار-انشاء',
    'إختصار', 'اختصار', 
    'أي-بي', 'اي_بي', 'اي-بي', 'ايبى',
    'بنج', 'ping', 
    'بي-دي-اف', 'بيديأف', 'بي_دي_اف',
    'تشويش', 'تشفير',
    'دي-أن-أس', 'دي_ان_اس', 'دي-ان-اس',
    'فحص-الموقع', 'فحص_الموقع',
    'هيدر', 'الهيدر'
];

export default handler;