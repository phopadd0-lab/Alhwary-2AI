let handler = async (m, { conn }) => {
  try {
    const chat = m.chat
    const sender = m.sender

    const text = `
> ✦ Al-Hawari 𝐁𝐎𝐓 ✦

『 ⚡ مرحباً بك في عالم الهواري ⚡ 』
`.trim()

    const fakeContact = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: chat,
        fromMe: false,
        id: 'ShadowBot'
      },
      message: {
        contactMessage: {
          displayName: 'ALHWARY 🫡',
          vcard: `BEGIN:VCARD
VERSION:3.0
N: ALHWARY;;;
FN: ALHWARY 
TEL;type=CELL;type=VOICE;waid=201556853817:+201556853817
END:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    }

    // إرسال النص
    await conn.sendMessage(
      chat,
      {
        text,
        mentions: [sender]
      },
      {
        quoted: fakeContact
      }
    )

    // إرسال الفيديو
    await conn.sendMessage(
      chat,
      {
        video: {
          url: 'https://i.top4top.io/m_38169gja30.mp4'
        },
        mimetype: 'video/mp4',
        caption: '🎬 ALHWARY 𝐕𝐈𝐃𝐄𝐎',
        gifPlayback: false,
        ptv: true
      },
      {
        quoted: fakeContact
      }
    )

  } catch (e) {
    console.error(e)

    await m.reply(
      '❌ حدث خطأ أثناء تنفيذ الأمر\n\n' +
      (e.message || e)
    )
  }
}

// التعديل هنا: تم تغيير "تست" لتكون بالهاء وليس التاء المربوطة
handler.command = ['تست']
handler.help = ['تست']
handler.tags = ['tools']

export default handler
