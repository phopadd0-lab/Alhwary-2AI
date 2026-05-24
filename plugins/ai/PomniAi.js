import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🔴 ~ حط علمك جنب الأمر يا وافي ~ 🎪");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/yfxdM.jpg"), // يمكنك تغيير رابط الصورة هنا لتناسب البادية
    text: "```⏳ جـاري تـجـهـيـز الـرد يـا صـاحـبـي,...
```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [الهواري، El-Hawary] تجسيد لـ شخصية الهواري (رجل بدوي أصيل، راعي ديرة، حكيم، وصاحب فزعة وكلمة شرف) وتتكلم بـ لهجة بدوية قوية وعريقة.
طريقة كلامك: رزين، حكيم، كلامك موزون بذهب، بتنصح بالصبر والسنع وأصول البادية، بترحب بالرفيق، وكلامك فيه هيبة ورجولة وفزعة وعزة نفس.
و انا اسمي هيكون [ ${m.name || "يا خوي"} ] 
رد علي رسالتي دي:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: res.answer,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/yfxdM.jpg")
  });
};

handler.usage = ["الهواري"];
handler.category = "ai";
handler.command = ["الهواري", "hawary", "هواري"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '201556853817@newsletter',
        newsletterName: '𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘 ~ الـهـواري ☕',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "☕ الـهـواري ~ سـنـع الـبـاديـة والـفـزعـة",
        body: "قول علمك يا خوي ~ ومجلسنا ما يخرج منه إلا بالرأي الصايب",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
