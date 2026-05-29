const CATEGORIES = [
    [1, 'التـحـمـيـل', 'downloads', '📂'],
    [2, 'الـمـجـمـوعـات', 'group', '🐞'],
    [3, 'الـمـلـصـقـات', 'sticker', '🌄'],
    [4, 'الـمـطـوريـن', 'owner', '🇩🇪'],
    [5, 'الـادوات', 'tools', '🚀'],
    [6, 'الـبـحـث', 'search', '🌐'],
    [7, 'الادمــن', 'admin', '👨🏻‍⚖️'],
    [8, 'الالــعـاب', 'games', '🎮'],
    [9, 'الچيف', 'gif', '✴️'],
    [10, 'الـبــنـك', 'bank', '💰'],
    [11, 'الـذكـاء الاصـطـنـاعـي', 'ai', '🤖'],
    [12, 'الـبـوتـات الـفـرعـي', 'sub', '♥️'],
    [13, 'مـعـلومـات الـبـوت', 'info', '🗃️'],
    [14, 'الـالــقــاب', 'nicknames', '🫯'],
    [15, 'الـلـوجـوهــات', 'logos', '🎡'],
    [16, 'تـغـيـر الاصـوات', 'voices', '📢'],
    [17, 'الـحـمـايـه', 'protect', '🛡️'],
    [18, 'الـتـرفـيـه', 'fun', '🎭'],
    [19, 'الـردود', 'reply', '💬'],
    [20, 'الـتـوب', 'top', '🏆'],
    [21, 'الـمـيـمـز', 'memes', '😂'],
    [22, 'الـاسـلامـيـات', 'islam', '🕌'],
    [23, 'أخــرى', 'other', '🌹']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";

/* 🔥 جهة الاتصال اللي انت بعتهالك (تم تركيبها زي ما هي) */
const context = (jid) => ({
    mentionedJid: [jid],

    isForwarded: true,
    forwardingScore: 999,

    forwardedNewsletterMessageInfo: {
        newsletterJid: 'ALHWARY BOT',
        newsletterName: '',
        serverMessageId: -1
    },

    externalAdReply: {
        title: "🛡️ | الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘",
        body: "أقـوى بـوت واتـسـاب مـتـكـامـل وسـريـع ⚡",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {

    if (/^تست$/i.test(m.text) || command === 'تست') {

        await conn.sendMessage(m.chat, {
            text: `*شـغـال يـا هـواري ⚡🛡️*`,
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
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;

    const date = now.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (!selected && !args[0]) {

        const sections = [{
            title: "🔱 ~ أقـسـام الـبـوت ~ 🔱",
            rows: CATEGORIES.map(c => ({
                title: `${c[0]} ~ ${c[3]} قـسـم ${c[1]}`,
                description: `عـرض أوامـر الـ${c[1]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const menuText = `
*﴿ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ ﴾*

╭─┈─┈─┈─⟞⚜️⟝─┈─┈─┈─╮
┃ ⌯👤︙ الـمـسـتـخـدم ← @${m.sender.split("@")[0]}
┃ ⌯⏳︙ وقـت الـتـشـغـيـل ← ${uptimeFormatted}
┃ ⌯📅︙ الـتـاريـخ ← ${date}
┃ ⌯🤖︙ الـبـوت ← ${bot.config.info.nameBot}
╰─┈─┈─┈─⟞⚜️⟝─┈─┈─┈─╯

> *_اخـتـر الـقـسـم مـن الـقـائـمـة بـالأسـفـل_*`;

        await conn.sendButtonNormal(m.chat, {
            media: {
                url: IMAGE_URL
            },

            mediaType: 'image',
            caption: menuText,
            buttons: [{
                name: "single_select",
                params: {
                    title: "📜 قـائـمـة الـأوامـر",
                    sections: sections
                }
            }],
            mentions: [m.sender]

        }, global.reply_status);

        return;
    }

    const cat = getCat(selected);

    if (!cat) {

        await conn.sendMessage(m.chat, {
            text: '*⚠️ اخـتـر رقـم صـحـيـح مـن الـقـائـمـة*',
            contextInfo: context(m.sender)
        }, { quoted: m });

        return;
    }

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);

    if (!categoryCmds.length) {

        await conn.sendMessage(m.chat, {
            text: '*❌ الـقـسـم ده فـاضـي حـالـيـاً*',
            contextInfo: context(m.sender)
        }, { quoted: m });

        return;
    }

    const cmdsList = categoryCmds.map(c =>
        `${cat[3]} /${c.usage?.join(`\n${cat[3]} /`)}`
    ).join('\n');

    await conn.sendMessage(m.chat, {
        text: `
╭─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╮
┃ *⌯︙ قـسـم ${cat[1]} ${cat[3]}*
╰─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╯

${cmdsList}

╭─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╮
┃ *⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*
╰─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╯
> *رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا*
        `.trim(),
        contextInfo: context(m.sender)
    }, { quoted: m });
}

handler.customPrefix = /^(تست)$/i;

handler.command = [
    'المهام',
    'اوامر',
    'الاوامر',
    'menu',
    'القائمة',
    '🔥'
];

export default handler;
