import performanceNow from 'performance-now';

const CATEGORIES = [
    [1, 'التـحـمـيـل', 'downloads', '↳'],
    [2, 'الـمـجـمـوعـات', 'group', '↳'],
    [3, 'الـمـلـصـقـات', 'sticker', '↳'],
    [4, 'الـمـطـوريـن', 'owner', '↳'],
    [5, 'الـادوات', 'tools', '↳'],
    [6, 'الـبـحـث', 'search', '↳'],
    [7, 'الادمــن', 'admin', '↳'],
    [8, 'الالــعـاب', 'games', '↳'],
    [9, 'الچيف', 'gif', '↳'],
    [10, 'الـبــنـك', 'bank', '↳'],
    [11, 'الـذكـاء الاصـطـنـاعـي', 'ai', '↳'],
    [12, 'الـبـوتـات الـفـرعـي', 'sub', '↳'],
    [13, 'مـعـلومـات الـبـوت', 'info', '↳'],
    [14, 'الـالــقــاب', 'nicknames', '↳'],
    [15, 'الـلـوجـوهــات', 'logos', '↳'],
    [16, 'تـغـيـر الاصـوات', 'voices', '↳'],
    [23, 'أخــرى', 'other', '↳']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

const IMAGE_URL = "https://g.top4top.io/p_3818ts94p0.jpg";

/* 🛠️ CONTEXT CONFIG */
const context = (jid) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363233343434@newsletter', 
        newsletterName: 'EL-HAWARY SYSTEM | 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑩𝑶𝑻',
        serverMessageId: -1
    },
    externalAdReply: {
        title: "• EL-HAWARY CORE •",
        body: "SYSTEM: ONLINE",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {
    const startPing = performanceNow();

    if (/^\.$/i.test(m.text) || command === '.') {
        const endPing = performanceNow() - startPing;
        await conn.sendMessage(m.chat, {
            text: `// SYSTEM_STATUS: ACTIVE ✔ (${endPing.toFixed(0)}ms)`,
            contextInfo: context(m.sender)
        }, { quoted: m });
        return;
    }

    const selected = parseInt(args[0]);
    const now = new Date();
    const uptimeSeconds = process.uptime();

    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const uptimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const cmds = await bot.getAllCommands();

    if (!selected && !args[0]) {

        const currentHour = now.getHours();
        let greeting = "SYSTEM_BOOT";
        if (currentHour >= 5 && currentHour < 12) greeting = "GOOD_MORNING";
        else if (currentHour >= 12 && currentHour < 18) greeting = "GOOD_AFTERNOON";
        else greeting = "GOOD_EVENING";

        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);
        const totalRAM = 512; 
        const ramPercentage = Math.min(Math.round((usedRAM / totalRAM) * 100), 100);
        const ramBar = '█'.repeat(Math.floor(ramPercentage / 10)) + '░'.repeat(10 - Math.floor(ramPercentage / 10));

        let userRank = "GUEST_USER";
        const isOwner = bot.config?.owner?.some(o => o[0] === m.sender.split('@')[0]) || m.fromMe;
        
        if (isOwner) {
            userRank = "ROOT_DEVELOPER";
        } else if (m.isGroup) {
            const groupMetadata = await conn.groupMetadata(m.chat).catch(() => ({}));
            const participants = groupMetadata.participants || [];
            const userAdmin = participants.find(p => p.id === m.sender);
            if (userAdmin?.admin) userRank = "NETWORK_ADMIN";
        }

        const latency = performanceNow() - startPing;

        const sections = [{
            title: " [ SELECT COMMAND MODULE ] ",
            rows: CATEGORIES.map(c => ({
                title: `[ ${c[1]} ]`,
                description: `Load module: ${c[2]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const senderNumber = m.sender.split("@")[0];

        const menuText = `┌─── [ EL-HAWARY SYSTEM v2.5 // ${greeting} ] ───┐
│
│ 🛠️ INF: Multi-Task WhatsApp Bot
│ 👑 DEV: El-Hawary
│
├─── [ SYSTEM INFO ] ───
│ 
│ 💻 OPERATOR : @${senderNumber} [ ${userRank} ]
│ ⏱️ UPTIME   : ${uptimeFormatted}
│ ⚡ LATENCY  : ${latency.toFixed(0)} ms
│ 📊 RAM USE  : [${ramBar}] ${ramPercentage}% (${usedRAM}MB)
│ 📦 SYSTEMS  : ${CATEGORIES.length} Cores / ${cmds.length} Cmds
│ 📅 DATE     : ${date}
│ 🤖 KERNEL   : ${bot.config?.info?.nameBot || 'Hawary-Kernel'}
│
└─── [ SELECT MODULE BELOW ] ───`;

        await conn.sendButtonNormal(m.chat, {
            media: { url: IMAGE_URL },
            mediaType: 'image',
            caption: menuText,
            contextInfo: {
                mentionedJid: [m.sender]
            },
            buttons: [
                {
                    name: "cta_url",
                    params: {
                        display_text: "• DEVELOPER CONTROLLER •",
                        url: "https://wa.me/+201556853817"
                    }
                },
                {
                    name: "cta_url",
                    params: {
                        display_text: "• OFFICIAL CHANNEL •",
                        url: "https://whatsapp.com/channel/0029Vb6VF4R3bbUwgCtJlC3U"
                    }
                },
                {
                    name: "single_select",
                    params: {
                        title: "[ OPEN MODULE MENU ]",
                        sections: sections
                    }
                }
            ],
            mentions: [m.sender]
        }, global.reply_status || m);

        return;
    }

    const cat = getCat(selected);

    if (!cat) {
        await conn.sendMessage(m.chat, {
            text: '// ERROR: INVALID_MODULE_INDEX',
            contextInfo: context(m.sender)
        }, { quoted: m });
        return;
    }

    const categoryCmds = cmds.filter(c => c.category?.toLowerCase() === cat[2].toLowerCase());

    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, {
            text: `// status: MODULE_EMPTY (${cat[1]})`,
            contextInfo: context(m.sender)
        }, { quoted: m });
        return;
    }

    const cmdsList = categoryCmds.map(c => {
        if (Array.isArray(c.usage)) {
            return c.usage.map(u => `│ ↳ /${u}`).join('\n');
        } else {
            return `│ ↳ /${c.usage || 'unknown'}`;
        }
    }).join('\n');

    await conn.sendMessage(m.chat, {
        text: `┌─── [ MODULE: ${cat[1].toUpperCase()} ] ───┐
│
${cmdsList}
│
└─── [ EL-HAWARY CORE ] ───┘`,
        contextInfo: context(m.sender)
    }, { quoted: m });
}

handler.customPrefix = /^\./; 
handler.command = new RegExp('^(المهام|اوامر|الاوامر|menu|القائمة|🔥|\\.)$', 'i');

export default handler;