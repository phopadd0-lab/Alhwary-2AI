export default async function before(m, { conn }) {
    const g = global.db?.groups[m.chat];

    if (g?.antiLink && !m.isOwner && !m.isAdmin) {
        // Regex عام لأي رابط يبدأ بـ http أو https أو www
        const anyLinkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

        if (anyLinkRegex.test(m.text)) {
            // حذف الرسالة
            await conn.sendMessage(m.chat, {
                delete: m.key
            });

            // تحذير المرسل
            await conn.sendMessage(m.chat, { 
                text: `🚫 *تم حذف الرابط*\n\n@${m.sender.split('@')[0]} ممنوع نشر أي روابط هنا\n\n> يرجى الالتزام بقوانين المجموعة`,
                mentions: [m.sender]
            });

            return true;
        }
    }

    return false;
}