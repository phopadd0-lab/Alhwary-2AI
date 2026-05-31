import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🐙 *يا ملكة، يرجى كتابة اسم حساب جيت هاب أو مسار المستودع بعد الأمر!*\n\n*💡 أمثلة للاستخدام:* \n• فحص حساب: \`${usedPrefix + command} elhawary-developer\`\n• فحص سورس وسحبه: \`${usedPrefix + command} elhawary-developer/hawary-bot\``);

    const args = text.trim().split('/');
    
    // 1️⃣ الحالة الأولى: فحص مستودع وسحب سورس كامل (User/Repo)
    if (args.length >= 2) {
        const username = args[0].trim();
        const repo = args[1].trim();
        await m.reply(`🛸 *جاري فحص مستودع [ ${repo} ] واختراق تفاصيل الكود...*`);

        try {
            const repoUrl = `https://api.github.com/repos/${username}/${repo}`;
            const res = await axios.get(repoUrl);
            
            if (!res.data) return m.reply("❌ *تعذر العثور على هذا المستودع، تأكدي من الاسم والمسار.*");
            const data = res.data;

            let repoReport = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐑𝐄𝐏𝐎 ❩╎━━━━━━*\n`;
            repoReport += `*❖┋ تفاصيل المستودع والسورس المكتشف ➢*\n`;
            repoReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
            repoReport += `*📦 اسم السورس:* ${data.name}\n`;
            repoReport += `*👑 المالك/المطور:* ${data.owner.login}\n`;
            repoReport += `*📝 الوصف:* ${data.description || 'لا يوجد وصف متاح لهذا المشروع.'}\n`;
            repoReport += `*🌐 لغة البرمجة الأساسية:* 💻 ${data.language || 'غير محددة'}\n`;
            repoReport += `*⭐ النجوم (Stars):* ${data.stargazers_count} | *🍴 التفرعات (Forks):* ${data.forks_count}\n`;
            repoReport += `*🐛 المشاكل المفتوحة (Issues):* ${data.open_issues_count}\n\n`;
            repoReport += `*🔗 رابط تحميل السورس كامل كملف مضغوط (ZIP):*\n`;
            repoReport += `https://github.com/IbrahimElhawary/test_rep/archive/refs/heads/main.zip\n\n`;
            repoReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*\n`;
            repoReport += `> _تم سحب بيانات المشروع بنجاح_ ⚡`;

            return m.reply(repoReport);
        } catch (err) {
            console.error(err);
            return m.reply("❌ *فشل جلب بيانات المستودع. تأكدي من أن المستودع عام (Public) وليس خاصاً.*");
        }
    } 
    
    // 2️⃣ الحالة الثانية: فحص حساب مطور (User Profile)
    else {
        const username = text.trim();
        await m.reply(`🕵️‍♂️ *جاري سحب بيانات الحساب والـ OSINT للمستخدم [ ${username} ]...*`);

        try {
            const userUrl = `https://api.github.com/users/${username}`;
            const res = await axios.get(userUrl);
            
            if (!res.data) return m.reply("❌ *لم يتم العثور على هذا الحساب على منصة جيت هاب.*");
            const data = res.data;

            let userReport = `*━━━━━━╎ ❨ 🐙 𝐆𝐈𝐓𝐇𝐔𝐁 𝐔𝐒𝐄𝐑 ❩╎━━━━━━*\n`;
            userReport += `*❖┋ تقرير الـ OSINT البرمجي للمطور ➢*\n`;
            userReport += `*━━━━─━━━─━━━ 🍷 ━━━─━━━─━━━*\n\n`;
            userReport += `*👤 الاسم الحقيقي:* ${data.name || 'غير معلن'}\n`;
            userReport += `*🆔 اليوزر:* ${data.login}\n`;
            userReport += `*📧 الإيميل:* ${data.email || 'مخفي/خاص'}\n`;
            userReport += `*🏢 الشركة/المنظمة:* ${data.company || 'مطور حر'}\n`;
            userReport += `*🌍 الموقع/الدولة:* ${data.location || 'غير محددة'}\n`;
            userReport += `*📝 البايو:* ${data.bio || 'لا يوجد بايو مكتوب.'}\n\n`;
            userReport += `*📊 إحصائيات الحساب:*\n`;
            userReport += `• المشاريع العامة: ${data.public_repos}\n`;
            userReport += `• المتابِعين (Followers): ${data.followers}\n`;
            userReport += `• المتابَعين (Following): ${data.following}\n`;
            userReport += `• تاريخ إنشاء الحساب: ${new Date(data.created_at).toLocaleDateString('ar-EG')}\n\n`;
            userReport += `*⌯︙ الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*\n`;
            userReport += `> _تم اختراق ملف المطور بنجاح_ ⚡`;

            // إرسال التقرير مع صورة آلفاتار (بروفايل الحساب)
            if (data.avatar_url) {
                return conn.sendFile(m.chat, data.avatar_url, 'avatar.jpg', userReport, m);
            } else {
                return m.reply(userReport);
            }
        } catch (err) {
            console.error(err);
            return m.reply("❌ *حدث خطأ أثناء جلب بيانات الحساب المكتوب.*");
        }
    }
};

handler.help = ['جيت', 'github'];
handler.tags = ['tools'];
handler.command = ['جيت', 'جيت_هاب', 'git', 'github'];

export default handler;
