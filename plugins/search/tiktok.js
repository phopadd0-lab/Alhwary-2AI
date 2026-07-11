async function test(m, { conn, bot, text }) {
  if (!text) return m.reply("#🫯: اكتب نص جنب الأمر")
  try {
  const res = await fetch(`https://www.emam-api.web.id/home/sections/Search/api/tiktok/videos?q=${text}`)
const { data } = await res.json()

if (data && data.length > 0) {
    const { title, no_watermark: video, music } = data[0]

    await conn.sendButtonNormal(m.chat, {
        media: { url: video },
        mediaType: 'video',
        caption: `${title || "no title"}`,
        buttons: [
            { 
                name: "cta_copy", 
                params: { 
                    display_text: "👌🏼╎ 🇵🇸", 
                    copy_code: "O̷W̷N̷E̷R̷ | ڵــﮪــﯡٰڕې" 
                } 
            },
        ],
        mentions: [m.sender],
        newsletter: {
            name: 'O̷W̷N̷E̷R̷ | ڵــﮪــﯡٰڕې',
            jid: '201556853817@newsletter'
        },
    }, global.reply_status)
} else {
    await conn.sendMessage(m.chat, { text: `لا يوجد "${text}"` })
}
    
  } catch (error) {
    console.error(error.messsage);
    m.react("❌")
  }
}

test.category = "search";
test.usage = ["ايديت "];
test.command = ["ايديت "];
export default test;
