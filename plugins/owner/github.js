import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🐙 *يا ملكة، يرجى كتابة اسم حساب جيت هاب أو مسار المستودع!* \n\n*💡 مثال:* \n• \`${usedPrefix + command} baileys\``);

    const args = text.trim().split('/');
    
    // 1️⃣ الحالة الأولى: لو كتبتي مسار مستودع محدد (User/Repo)
    if (args.length >= 2) {
        const username = args[0].trim();
        const repo = args[1].trim();
        await m.reply(`🛸 *جاري تجهيز رابط التحميل المضغوط للسورس [ ${repo} ]...*`);

        let repoReport = `*━━━━━━╎ ❨ 📦 𝐆𝐈𝐓𝐇𝐔𝐁 𝐙𝐈𝐏 ❩╎━━━━━━*\n`;
        repoReport += `*❖┋ تحميل السورس المضغوط كاملاً ➢*\n`;
        repoReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
        repoReport += `🚀 *المستودع المستهدف:* \`${username}/${repo}\`\n\n`;
        repoReport += `📥 *اضغطي على الرابط أدناه للتحميل المباشر فوراً:*\n`;
        repoReport += `https://github.com/${username}/${repo}/archive/refs/heads/main.zip\n`;
        repoReport += `_(إذا لم يعمل الرابط أعلاه، جربي رابط السيرفر الاحتياطي):_\n`;
        repoReport += `https://github.com/${username}/${repo}/archive/refs/heads/master.zip\n\n`;
        repoReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n`;
        repoReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*`;

        return m.reply(repoReport);
    } 
    
    // 2️⃣ الحالة الثانية (طلبكِ المخصوص): جلب الحساب ومعه روابط الـ ZIP لكل مشاريعه مباشرة
    else {
        const username = text.trim();
        await m.reply(`🕵️‍♂️ *جاري فحص حساب [ ${username} ] وسحب روابط الملفات المضغوطة...*`);

        try {
            // جلب بيانات الحساب الشخصي
            const userUrl = `https://api.github.com/users/${username}`;
            const userRes = await axios.get(userUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const userData = userRes.data;

            // جلب قائمة مستودعات المطور (أول 5 مشاريع عامة)
            const reposUrl = `https://api.github.com/users/${username}/repos?per_page=5&sort=updated`;
            const reposRes = await axios.get(reposUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const reposData = reposRes.data;

            let report = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐔𝐒𝐄𝐑 ❩╎━━━━━━*\n`;
            report += `*👤 المطور:* ${userData.name || 'غير معلن'} | *🆔 اليوزر:* ${userData.login}\n`;
            report += `• المشاريع العامة: ${userData.public_repos} | • المتابِعين: ${userData.followers}\n`;
            report += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
            report += `📦 *روابط تحميل المشاريع جاهزة ومضغوطة (ZIP):*\n\n`;

            if (reposData.length === 0) {
                report += `❗ لا توجد مستودعات عامة متاحة لهذا المستخدم حالياً.\n`;
            } else {
                reposData.forEach((repo, index) => {
                    report += `*${index + 1}️⃣ - السورس:* \`${repo.name}\`\n`;
                    report += `• ⭐ النجوم: ${repo.stargazers_count} | 💻 اللغة: ${repo.language || 'غير محددة'}\n`;
                    report += `• 📥 *رابط التحميل المباشر ZIP:*\n`;
                    report += `https://github.com/${username}/${repo.name}/archive/refs/heads/main.zip\n\n`;
                });
            }

            report += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n`;
            report += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*\n> _نظام جلب السورسات المضغوطة طيران_ ⚡`;

            // إرسال التقرير مع الصورة الشخصية للمطور وروابط التحميل المباشرة تحتها
            if (userData.avatar_url) {
                return conn.sendFile(m.chat, userData.avatar_url, 'avatar.jpg', report, m);
            } else {
                return m.reply(report);
            }

        } catch (err) {
            console.error(err);
            return m.reply("❌ *لم يتم العثور على هذا الحساب، أو حدث خطأ أثناء الاتصال بجيت هاب الحين.*");
        }
    }
};

handler.help = ['جيت'];
handler.tags = ['tools'];
handler.command = ['جيت', 'جيت_هاب', 'git', 'github'];

export default handler;
