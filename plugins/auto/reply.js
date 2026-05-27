.تعديل_امر plugins/auto/auto_reply.js
export default async function before(m, { conn , bot }) {
  const triggers = {
    "السلام عليكم": ["*وعليكم السلام منور يغالي 🤎*", "*وعليكم السلام ورحمة الله وبركاته ❤️*"],
    "تست": ["تست", "تست تست"],
    "هلا": ["*هلا وغلا*", "*هلا بيك*", "*يا هلا*"],
    "باي": ["*مع السلامة*", "*باي باي*", "*الله معاك*"],
    "صباح الخير": ["*صباح النور*", "*صباح الورد*", "*صباح الفل*"],
    "مساء الخير": ["*مساء النور*", "*مساء الورد*", "*مساء الفل*", "*مساء الجوري*"],
    "مساء النور": ["*مساء الورد*", "*مساء الفل*", "*الله نورك*"]
  };

  if (!m.text) return false;
  
  const replies = triggers[m.text.trim()];
  if (replies) {
    const ranReply = replies[Math.floor(Math.random() * replies.length)];
    m.reply(ranReply);
    return true; // تم التعامل مع الرسالة بنجاح
  }
  
  return false;
}
