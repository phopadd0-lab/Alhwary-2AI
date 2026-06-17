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
    [17, 'الـحـمـايـه', 'protect', '↳'],
    [18, 'الـتـرفـيـه', 'fun', '↳'],
    [19, 'الـردود', 'reply', '↳'],
    [20, 'الـتـوب', 'top', '↳'],
    [21, 'الـمـيـمـز', 'memes', '↳'],
    [22, 'الـاسـلامـيـات', 'islam', '↳'],
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
        newsletterJid: '𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑩𝑶𝑻',
        newsletterName: 'EL-HAWARY SYSTEM',
        serverMessageId: -1
    },
    externalAdReply: {
        title:"• EL-HAWARY CORE •",
        body: "SYSTEM: ONLINE",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {

    if (/^\.$/i.test(m.text) || command === '.') {
        await conn.sendMessage(m.chat, {
            text: `// SYSTEM_STATUS: ACTIVE ✔`,
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

    const uptimeFormatted =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (!selected && !args[0]) {

        const sections = [{
            title: " [ SELECT COMMAND MODULE ] ",
            rows: CATEGORIES.map(c => ({
                title: `[ ${c[1]} ]`,
                description: `Load module: ${c[2]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        // ستايل مبرمجين (مختصر، حاد ونظيف)
        const menuText = `┌─── [ EL-HAWARY SYSTEM v2.0 ] ───┐
│
│ 🛠️ INF: Multi-Task WhatsApp Bot
│ 👑 DEV: El-Hawary
│
├─── [ SYSTEM INFO ] ───
│ 
│ 💻 USER   : @${m.sender.split("@")[0]}
│ ⏱️ UPTIME : ${uptimeFormatted}
│ 📅 DATE   : ${date}
│ 🤖 KERNEL : ${bot.config.info.nameBot}
│
└─── [ SELECT MODULE BELOW ] ───`;

        await conn.sendButtonNormal(m.chat, {
            media: { url: IMAGE_URL },
            mediaType: 'image',
            caption: menuText,
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
        }, global.reply_status);

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

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);

    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, {
            text: '// status: MODULE_EMPTY',
            contextInfo: context(m.sender)
        }, { quoted: m });
        return;
    }

    const cmdsList = categoryCmds.map(c =>
        `│ ↳ /${c.usage?.join(`\n│ ↳ /`)}`
    ).join('\n');

    await conn.sendMessage(m.chat, {
        text: `
┌─── [ MODULE: ${cat[1].toUpperCase()} ] ───┐
│
${cmdsList}
│
└─── [ EL-HAWARY CORE ] ───┘
        `.trim(),
        contextInfo: context(m.sender)
    }, { quoted: m });
}

handler.customPrefix = /^\./; 
handler.command = new RegExp('^(المهام|اوامر|الاوامر|menu|القائمة|🔥|\\.)$', 'i');

export default handler;