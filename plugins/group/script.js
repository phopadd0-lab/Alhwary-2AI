let handler = async (m, { conn, bot }) => {
  const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '201556853817@newsletter',
      newsletterName: '‌𝑨𝑳𝑯𝑾𝑨𝑹𝒀',
      serverMessageId: 0
    },
    externalAdReply: {
      title: "‌𝑨𝑳𝑯𝑾𝑨𝑹𝒀",
      body: "بوت واتس بيشتم أي حد يطلب السورس 😂",
      thumbnailUrl: img,
      sourceUrl: '',
      mediaType: 1,
      renderLargerThumbnail: true
    }
  });

  const { images } = bot.config.info;
  const img = images.random();

  await conn.sendMessage(m.chat, { 
    text: `
🖕 ياض انت جاي تسأل على السورس؟  
😂 روح العب بعيد يا عرص  
🔥 مفيش سورس هنا غير شتايم ليك  
> *يلا غور من هنا يا خول*
`,
    contextInfo: context(m.sender, img)
  }, { quoted: reply_status });
};

handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc"];

export default handler;