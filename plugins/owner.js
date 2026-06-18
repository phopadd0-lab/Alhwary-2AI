let handler = async (m, { conn, bot }) => {
  let watermark = '𝑨𝑳𝑯𝑾𝑨𝑹𝒀';
  
  let quoted = {
    key: { fromMe: false, participant: '201556853817@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { conversation: '𝑨𝑳𝑯𝑾𝑨𝑹𝒀 }
  };
  const num = bot.config.owners[0].jid.split("@")[0];
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;waid=${num}:+${num}
END:VCARD`;

  let img = 'https://ibb.co/tMC8XqTf';
  
  await conn.sendMessage(m.chat, {
    contacts: { displayName: watermark, contacts: [{ vcard }] },
    contextInfo: {
      forwardingScore: 2026,
      externalAdReply: {
        title: '𝑨𝑳𝑯𝑾𝑨𝑹𝒀',
        body: watermark,
        sourceUrl: '201556853817',
        thumbnailUrl: img,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted })
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;