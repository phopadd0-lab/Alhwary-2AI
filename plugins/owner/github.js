import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🐙 *يا أسطورة، اكتب اسم حساب جيت هاب أو مسار المستودع!* \n\n*💡 مثال:* \n• \`${usedPrefix + command} baileys\``);

    const args = text.trim().split('/');

    // الحالة الأولى: مسار مستودع محدد (User/Repo)
    if (args.length >= 2) {
        const username = args[0].trim();
        const repo = args[1].trim();
        await m.reply(`🛸 *جاري تجهيز رابط التحميل المضغوط للسورس [ ${repo} ]...*`);

        let repoReport = `*━━━━━━╎ ❨ 📦 𝐆𝐈𝐓𝐇𝐔𝐁 𝐙𝐈𝐏 ❩╎━━━━━━*\n`;
        repoReport += `🚀 *المستودع المستهدف:* \`${username}/${repo}\`\n\n`;
        repoReport += `📥 *رابط التحميل المباشر:* \n`;
        repoReport += `https://github.com/${username}/${repo}/archive/refs/heads/main.zip\n`;
        repoReport += `_(لو الرابط ما اشتغل، جرب الاحتياطي)_:\n`;
        repoReport += `https://github.com/${username}/${repo}/archive/refs/heads/master.zip\n\n`;
        repoReport += `*⌯︙ 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥 بوت*`;

        return m.reply(repoReport);
    } 

    // الحالة الثانية: جلب الحساب وروابط ZIP لكل مشاريعه
    else {
        const username = text.trim();
        await m.reply(`🕵️‍♂️ *جاري فحص حساب [ ${username} ] وسحب روابط الملفات المضغوطة...*`);

        try {
            const userUrl = `https://api.github.com/users/${username}`;
            const userRes = await axios.get(userUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const userData = userRes.data;

            const reposUrl = `https://api.github.com/users/${username}/repos?per_page=5&sort=updated`;
            const reposRes = await axios.get(reposUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const reposData = reposRes.data;

            let report = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐔𝐒𝐄𝐑 ❩╎━━━━━━*\n`;
            report += `👤 *المطور:* ${userData.name || 'غير معلن'} | 🆔 *اليوزر:* ${userData.login}\n`;
            report += `• المشاريع العامة: ${userData.public_repos} | • المتابعين: ${userData.followers}\n\n`;
            report += `📦 *روابط تحميل المشاريع (ZIP):*\n\n`;

            if (reposData.length === 0) {
                report += `❗ لا توجد مستودعات عامة لهذا المستخدم.\n`;
            } else {
                reposData.forEach((repo, index) => {
                    report += `*${index + 1}️⃣ - السورس:* \`${repo.name}\`\n`;
                    report += `• ⭐ النجوم: ${repo.stargazers_count} | 💻 اللغة: ${repo.language || 'غير محددة'}\n`;
                    report += `• 📥 رابط ZIP:\n`;
                    report += `https://github.com/${username}/${repo.name}/archive/refs/heads/main.zip\n\n`;
                });
            }

            report += `*⌯︙ 𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥 بوت*\n> _نظام جلب السورسات المضغوطة_ ⚡`;

            if (userData.avatar_url) {
                return conn.sendFile(m.chat, userData.avatar_url, 'avatar.jpg', report, m);
            } else {
                return m.reply(report);
            }

        } catch (err) {
            console.error(err);
            return m.reply("❌ *لم يتم العثور على الحساب أو حدث خطأ أثناء الاتصال بجيت هاب.*");
        }
    }
};

handler.help = ['جيت'];
handler.tags = ['tools'];
handler.category = "𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥";
handler.command = ['جيت', 'جيت_هاب', 'git', 'github'];

export default handler;