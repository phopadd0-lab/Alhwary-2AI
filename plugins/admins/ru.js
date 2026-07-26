async function handler(m, { conn }) {
    // 1. التأكد أن الرسالة مقتبسة (رد على شخص)
    if (!m.quoted) {
        return await m.reply('⚠️ يجب عليك الرد (ريبلاي) على رسالة الشخص لمعرفة من قام بإضافته وتاريخ انضمامه وقوانين الجروب.');
    }

    // 2. التأكد أن الأمر يعمل داخل مجموعة فقط
    if (!m.isGroup) {
        return await m.reply('❌ هذا الأمر يشتغل داخل المجموعات فقط!');
    }

    try {
        // جلب بيانات الجروب
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants || [];

        // الشخص المستهدف (صاحب الرسالة المقتبسة)
        const targetJid = m.quoted.sender;
        const targetParticipant = participants.find(p => p.id === targetJid);

        // معرفة من قام بإضافته وتاريخ الانضمام
        const addedByJid = targetParticipant?.addedBy;
        const addedByText = addedByJid 
            ? `@${addedByJid.split('@')[0]}` 
            : 'غير معروف (انضم عبر رابط الدعوة أو قديم)';

        const joinedDate = targetParticipant?.joinedAt 
            ? new Date(targetParticipant.joinedAt * 1000).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) 
            : 'غير مسجل في السجلات';

        // نص القوانين الخاصة بجروبات الرغي
        const rulesText = `📜 *[ قـوانـيـن جـروب الـرغـي ]*

1. 🚫 يُمنع منعاً باتاً الشتم أو الإساءة لأي عضو.
2. 🔗 يُمنع إرسال الروابط أو الإعلانات لأي جروبات أخرى.
3. 💬 الجروب مخصص للرغي والدردشة الودية، يرجى تجنب التعصب والجدال.
4. 🛑 احترم خصوصية الأعضاء ويُمنع الدخول خاص بدون إذن.`;

        // صياغة الرسالة النهائية
        const responseText = `┌─── ❖ [ 📜 بـيـانـات الـعـضـو 📜 ] ❖ ───┐
│
│ 👤 *الـعـضـو:* @${targetJid.split('@')[0]}
│ ➕ *تـمـت إضـافـتـه بـواسـطـة:* ${addedByText}
│ ⏰ *تـاريـخ الانـضـمـام:* ${joinedDate}
│
└─── ❖ [ 𝐴𝐿𝐻𝑊𝐴𝑅Y ] ❖ ───

${rulesText}`;

        // تجهيز التاجات (Mentions)
        const mentions = [targetJid];
        if (addedByJid) mentions.push(addedByJid);

        // إرسال الرد
        await conn.sendMessage(m.chat, { 
            text: responseText, 
            mentions: mentions 
        }, { quoted: m });

    } catch (error) {
        console.error('Error in rules command:', error);
        await m.reply('❌ حدث خطأ أثناء جلب بيانات العضو.');
    }
}

// تحديد البادئة والكلمات التي ينشط بها الأمر
handler.customPrefix = /^\./;
handler.command = new RegExp('^(قوانين|قونين|القوانين|قانون)$', 'i');

export default handler;