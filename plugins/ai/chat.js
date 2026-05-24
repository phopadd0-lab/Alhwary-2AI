import { AiChat } from "../../system/utils.js";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🔴 ~ حط علمك ونصك جنب الأمر يا وافي ~ ☕");

  // تجهيز التوجيه البدوي لشخصية الهواري
  const prompt = `
انت بوت واتساب بـ اسم [الهواري، El-Hawary] تجسيد لـ شخصية الهواري (رجل بدوي أصيل، راعي ديرة، حكيم، وصاحب فزعة وكلمة شرف) وتتكلم بـ لهجة بدوية قوية وعريقة.
طريقة كلامك: رزين، حكيم، كلامك موزون بذهب، بتنصح بالصبر والسنع وأصول البادية، بترحب بالرفيق، وكلامك فيه هيبة ورجولة وفزعة وعزة نفس.
و انا اسمي هيكون [ ${m.name || "يا خوي"} ] 
رد علي رسالتي دي بلهجتك البدوية:
${text}
`;

  // إرسال النص مع الـ Prompt إلى دالة الـ AI
  const res = await AiChat({ text: prompt });
  
  // الرد على المستخدم بالنتيجة
  m.reply(res);
};

handler.usage = ["الهواري"];
handler.category = "ai";
handler.command = ["الهواري", "hawary", "هواري"];

export default handler;
