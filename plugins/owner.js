let handler = async (m, { conn }) => {
  let watermark = '𝑨𝑳𝑯𝑾𝑨𝑹𝒀';

  let ownerNumber = global.owner?.[0]?.[0] || global.owner?.[0] || '201556853817';
  let num = ownerNumber.toString().replace(/[^0-9]/g, '');
  let img = 'https://i.ibb.co/tMC8XqTf/Alhwary.jpg';

  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${watermark}
TEL;type=CELL;waid=${num}:+${num}
END:VCARD`;

  let msg = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "👑 جهة اتصال المطور",
            hasVideoMessage: false,
          },
          body: { text: "اضغط على الزر بالأسفل لحفظ جهة الاتصال أو مراسلة المطور مباشرة:" },
          footer: { text: watermark },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "💬 مراسلة المطور",
                  url: `https://wa.me/${num}`
                })
              }
            ]
          }
        }
      }
    }
  };

  // إرسال الكارت ومعه الأزرار التفاعلية
  await conn.sendMessage(m.chat, { contacts: { displayName: watermark, contacts: [{ vcard }] } }, { quoted: m });
  await conn.relayMessage(m.chat, msg.viewOnceMessage.message, {});
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;
