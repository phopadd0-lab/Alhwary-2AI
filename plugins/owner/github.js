import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🐙 *يا ملكة، يرجى كتابة مسار المستودع بالكامل!* \n\n*💡 مثال:* \n• \`${usedPrefix + command} elhawary-developer/hawary-bot\``);

    const args = text.trim().split('/');
    
    if (args.length >= 2) {
        const username = args[0].trim();
        const repo = args[1].trim();
        await m.reply(`🛸 *جاري فحص المستودع وتفكيك بنية الملفات نصياً...*`);

        try {
            const repoContentUrl = `https://api.github.com/repos/${username}/${repo}/contents`;
            const res = await axios.get(repoContentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            if (!res.data || !Array.isArray(res.data)) return m.reply("❌ *المسار خاطئ أو المستودع فارغ.*");

            let repoReport = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐒𝐎𝐔𝐑𝐂𝐄 ❩╎━━━━━━*\n`;
            repoReport += `*❖┋ مستودع:* ${username} / ${repo} ➢*\n`;
            repoReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
            repoReport += `📂 *الملفات والأوامر الجاهزة للسحب:*\n\n`;

            res.data.forEach(item => {
                if (item.type === 'file') {
                    repoReport += `📄 *الملف:* \`${item.name}\`\n`;
                    repoReport += `• أمر سحب الكود: \`${usedPrefix}سحب_كود ${username}/${repo}/${item.name}\`\n\n`;
                } else {
                    repoReport += `📁 *مجلد:* \`${item.name}\`\n\n`;
                }
            });

            repoReport += `*📥 رابط تحميل السورس كامل ZIP:*\n`;
            repoReport += `https://github.com/IbrahimElhawary/test_rep/archive/refs/heads/main.zip\n\n`;
            repoReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

            return m.reply(repoReport);

        } catch (err) {
            return m.reply("❌ *فشل جلب ملفات المستودع، تأكدي من المسار.*");
        }
    } else {
        // فحص الملف الشخصي للمطور
        const username = text.trim();
        try {
            const userUrl = `https://api.github.com/users/${username}`;
            const res = await axios.get(userUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const data = res.data;

            let userReport = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐔𝐒𝐄𝐑 ❩╎━━━━━━*\n`;
            userReport += `*👤 المطور:* ${data.name || 'غير معلن'} | *🆔 اليوزر:* ${data.login}\n`;
            userReport += `• المشاريع العامة: ${data.public_repos} | • المتابِعين: ${data.followers}\n\n`;
            userReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

            if (data.avatar_url) return conn.sendFile(m.chat, data.avatar_url, 'avatar.jpg', userReport, m);
            return m.reply(userReport);
        } catch (err) {
            return m.reply("❌ *لم يتم العثور على الحساب.*");
        }
    }
};

// المحرك الخفي لقراءة كود الملف عند كتابة أمر السحب
handler.before = async (m, { conn }) => {
    if (!m.text || !m.text.startsWith('.سحب_كود')) return;
    const pathData = m.text.replace('.سحب_كود', '').trim().split('/');
    if (pathData.length < 3) return;

    const username = pathData[0];
    const repo = pathData[1];
    const filename = pathData[2];

    try {
        const fileRawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${filename}`;
        const fileRes = await axios.get(fileRawUrl).catch(async () => {
            return await axios.get(`https://raw.githubusercontent.com/${username}/${repo}/master/${filename}`);
        });

        if (fileRes && fileRes.data) {
            let codeContent = typeof fileRes.data === 'object' ? JSON.stringify(fileRes.data, null, 2) : fileRes.data;
            if (codeContent.length > 4000) codeContent = codeContent.slice(0, 4000) + "\n\n... (الكود طويل جداً)";
            return m.reply(`📄 *كود الملف [ ${filename} ] :*\n\`\`\`javascript\n${codeContent}\n\`\`\``);
        }
    } catch (e) {
        return m.reply("❌ *تعذر قراءة محتوى الملف الحين.*");
    }
};

handler.help = ['جيت'];
handler.tags = ['tools'];
handler.command = ['جيت', 'جيت_هاب', 'سحب_كود'];

export default handler;
