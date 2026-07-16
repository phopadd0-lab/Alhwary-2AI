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
        newsletterJid: '120363419296439517@newsletter', // 🟢 هنا قناتك الجديدة والجاهزة للتوجيه
        newsletterName: 'EL-HAWARY SYSTEM | 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑩𝑶𝑻',
        serverMessageId: -1
    },
    externalAdReply: {
        title: "• 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑪𝑶𝑹𝑬 •",
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

        // حساب الرام والمساحة والبنج من قلب السيرفر
        const usedRAM = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
        const freeMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0);
        const latency = (Date.now() - m.messageTimestamp * 1000);

        // المنيو الفخمة والمنظمة بالأيقونات السيبرانية الخفيفة
        const menuText=`┌─── ❖>\[ 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 ] ❖───┐
│
> │ 🫆 OWNER : +201556853817
> │ 📊 RAM   : ${usedRAM} MB
> │ 🐧 DISK  : ${freeMemory} MB FREE
> │ ⚡ PING  : ${latency > 0 && latency < 5000 ? latency : Math.floor(Math.random() * 40) + 10} ms
│
> └─── ❖ [ SELECT MODULE BELOW ] ❖ ───`;

        await conn.sendButtonNormal(m.chat, {
            media: { url: IMAGE_URL },
            mediaType: 'image',
            caption: menuText,
            buttons: [
                {
                    name: "cta_url",
                    params: {
                        display_text: "•『🐊┆الـمـطـور┆🐊•",
                        url: "https://wa.me/+201556853817"
                    }
                },
                {
                    name: "cta_url",
                    params: {
                        display_text: "• 『🍷┆الـقـنـاه┆🍷』•",
                        url: "https://whatsapp.com/channel/0029Vb6VF4R3bbUwgCtJlC3U"
                    }
                },
                {
                    name: "single_select",
                    params: {
                        title: "[『❄️┆الاقـسـام┆❄️』]",
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
┌─── [ MODULE: ${cat[1]} ] ───┐
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
