let handler = async (m, { conn, bot }) => {
  let watermark = '𝑨𝑳𝑯𝑾𝑨𝑹𝒀';

  // رسالة منسوبة للمطور الكبير
  let quoted = {
    key: { 
      fromMe: false, 
      participant: '01556853817@s.whatsapp.net', 
      remoteJid: 'status@broadcast' 
    },
    message: { conversation: watermark }
  };

  // رقم المطور من الإعدادات
  const num = bot.config.owners[0].jid.split("@")[0];

  // بطاقة vCard للمطور
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;waid=${num}:+${num}
END:VCARD`;

  // صورة العرض
  let img = 'https://i.ibb.co/tMC8XqTf/Alhwary.jpg';

  // إرسال الكونتاكت مع معلومات إضافية
  await conn.sendMessage(m.chat, {
    contacts: { 
      displayName: watermark, 
      contacts: [{ vcard }] 
    },
    contextInfo: {
      forwardingScore: 2026,
      externalAdReply: {
        title: '👑 المطور الكبير',
        body: `البوت الرسمي: ${watermark}`,
        sourceUrl: 'https://wa.me/' + num,
        thumbnailUrl: img,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted });
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;