import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("💙 ~ اكتب نص الفيديو أو الأغنية ~ ❤️");

    const res = await fetch(`https://emam-api.web.id/home/sections/Search/api/YouTube/search?q=${text}`);
    const { data } = await res.json();
    const { title, image, timestamp: time, url } = data[0];

    await conn.sendButton(m.chat, {
        imageUrl: image,
        bodyText: `${title} ╎ ${time}`,
        footerText: "🕸️ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 ~ 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 🕸️",
        buttons: [
            { name: "quick_reply", params: { display_text: "🎼 ╎ تحميل صوت", id: `.يوت_اغنيه ${url}` } },
            { name: "quick_reply", params: { display_text: "🎬 ╎ تحميل فيديو", id: `.يوتيوب ${url}` } }
        ],
        mentions: [m.sender],
        newsletter: { name: "𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥", jid: "201556853817@newsletter" },
        interactiveConfig: { buttons_limits: 10, list_title: "", button_title: "", canonical_url: url }
    }, m);
};

handler.usage = ["فيديو", "اغنيه", "شغل"];
handler.category = "𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥 downloads";
handler.command = ["اغنيه", "فيديو", "اغنية", "play", "video"];

export default handler;