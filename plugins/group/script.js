let handler = async (m, {
    conn,
    bot
}) => {
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '201556853817@newsletter',
        newsletterName: '‌🇦‌🇱‌🇭‌🇼‌🇦‌🇷‌🇾',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "‌🇦‌🇱‌🇭‌🇼‌🇦‌🇷‌🇾",
        body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
const { images } = bot.config.info;
const img = images.random()
await conn.sendMessage(m.chat, { 
  text: `
GitHub: _* ابعد عن الكلام ده يا عرصٍ*_

Video: _* يا خۆلُ بتجيب لنفسك التهزيق*_

> * ابعد ياض يا عرصٍ من هنا 🌟*
`,
  contextInfo: context(m.sender, img)
}, { quoted: reply_status });
}
handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc"];

export default handler;