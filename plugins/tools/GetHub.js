import fs from 'fs';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch'; // استدعاء المكتبة للبحث عبر الإنترنت

const handler = async (m, { conn, text, isOwner, isAdmin, command }) => {
    // جلب رقم البوت الحقيقي والمضمون لتفادي مشكلة الأدمن
    const botNumber = conn.decodeJid ? conn.decodeJid(conn.user.id) : (conn.user.jid || conn.user.id.split(':')[0] + '@s.whatsapp.net');

    // ==========================================
    // 🔍 1️⃣ [قسم البحث عن السورسات جيت هاب - GitHub Search]
    // ==========================================
    if (command === 'جيت' || command === 'github' || command === 'سورس') {
        if (!text) return m.reply("⚠️ *يا وافي، اكتب اسم السورس أو البوت اللي تبي تبحث عنه!*\n> مثال: .جيت whatsapp-bot");
        
        await m.reply("🔍 *جاري البحث في مستودعات GitHub... انتظر ثواني.*");
        
        try {
            const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`);
            const json = await res.json();
            
            if (!json.items || json.items.length === 0) {
                return m.reply("❌ *لم أجد أي سورسات أو مستودعات بهذا الاسم، تأكد من الكلمة!*");
            }
            
            // ترتيب أفضل 5 نتائج لعدم ملء الشات بالرسائل الطويلة
            let repos = json.items.slice(0, 5); 
            let replyText = `📂 *أفضل المستودعات والسورسات التي تم العثور عليها لـ [ ${text} ] :*\n\n`;
            
            repos.forEach((repo, index) => {
                replyText += `*${index + 1}. 📛 الاسم:* ${repo.name}\n`;
                replyText += `*👤 المطور:* ${repo.owner.login}\n`;
                replyText += `*⭐ النجوم:* ${repo.stargazers_count} | *🍴 الفورك:* ${repo.forks_count}\n`;
                replyText += `*🔗 رابط السورس:* ${repo.html_url}\n`;
                replyText += `*📝 الوصف:* ${repo.description || 'لا يوجد وصف متاح'}\n`;
                replyText += `--- --- --- --- ---\n`;
            });
            
            return m.reply(replyText);
        } catch (e) {
            return m.reply(`❌ *حدث خطأ أثناء الاتصال بجيت هاب:* ${e.message}`);
        }
    }

    // ==========================================
    // ⚙️ 2️⃣ [قسم الأكواد والملفات]: جلب، حفظ
    // ==========================================
    if (command === 'جلب' || command === 'getfile') {
        if (!isOwner) return m.reply("❌ *هذا الأمر خاص بالمطور الخارق فقط!*");
        if (!text) return m.reply("⚠️ *اكتب مسار الملف المحفوظ في السيرفر!*");
        if (!fs.existsSync(text)) return m.reply("❌ *الملف غير موجود في هذا المسار!*");
        
        let fileContent = fs.readFileSync(text, 'utf-8');
        return m.reply(`💻 *كود الملف:* \`${text}\`\n\n\`\`\`javascript\n${fileContent}\n\`\`\``);
    }
    
    if (command === 'حفظ' || command === 'savefile') {
        if (!isOwner) return m.reply("❌ *هذا الأمر خاص بالمطور الخارق فقط!*");
        if (!m.quoted || !m.quoted.text || !text) return m.reply("⚠️ *اعمل ريبلاي على الكود واكتب مسار الحفظ!*");
        
        const dir = path.dirname(text);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(text, m.quoted.text, 'utf-8');
        return m.reply(`✅ *تم حفظ وتحديث الملف بنجاح الحين في:* \`${text}\``);
    }

    // ==========================================
    // 🔨 3️⃣ [قسم التصفية والحظر وطرد الدول]
    // ==========================================
    if (command === 'تصفية' || command === 'clean') {
        if (!isOwner && !isAdmin) return m.reply("❌ *للأدمن والمشرفين فقط!*");
        if (!text) return m.reply("⚠️ *اكتب رمز الدولة (مثال: 44 لبريطانيا)!*");
        
        const groupMetadata = await conn.groupMetadata(m.chat);
        let targets = groupMetadata.participants.filter(p => p.id.split('@')[0].startsWith(text) && p.id !== botNumber && !p.admin).map(p => p.id);
        
        if (targets.length === 0) return m.reply(`✅ *الجروب نظيف تماماً من أرقام الدولة [ +${text} ] حالياً!*`);
        
        await conn.groupParticipantsUpdate(m.chat, targets, 'remove');
        return m.reply(`🔨 *أبشري! تم تصفية وطرد [ ${targets.length} ] رقم بنجاح الحين وتنظيف الديرة.*`);
    }

    // ==========================================
    // 🖥️ 4️⃣ [قسم فحص السيستم والاتصال]: السيرفر، بينج
    // ==========================================
    if (command === 'السيرفر' || command === 'server') {
        if (!isOwner) return;
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        
        const report = `🖥️ *سيستم السيرفر الحين:*\n\n🧠 *الذاكرة (RAM):* ${usedMem} GB / ${totalMem} GB\n🚀 *المعالج:* ${os.platform()} (${os.arch()})\n⏱️ *وقت التشغيل:* ${(os.uptime() / 3600).toFixed(1)} ساعة`;
        return m.reply(report);
    }
    
    if (command === 'بينج' || command === 'ping') {
        const start = performance.now();
        await m.reply('⚡...');
        return m.reply(`🚀 *سرعة الاستجابة الحين:* ${(performance.now() - start).toFixed(0)} مللي ثانية`);
    }
};

handler.help = ['owner_system'];
handler.tags = ['owner'];
// تجميع كل الأوامر المذكورة فوق عشان البوت يفهمها الحين
handler.command = ['جيت', 'github', 'سورس', 'جلب', 'getfile', 'حفظ', 'savefile', 'تصفية', 'clean', 'السيرفر', 'server', 'بينج', 'ping']; 

export default handler;