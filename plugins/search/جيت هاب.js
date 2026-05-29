import axios from "axios";

export default {
  name: "github",
  command: ["github", "gitsearch", "جيت"],
  category: "search",
  description: "البحث في GitHub",

  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const query = args.join(" ");

      if (!query) {
        return await sock.sendMessage(from, {
          text: "❌ اكتب اسم المشروع أو المستخدم\n\nمثال:\n.github baileys"
        }, { quoted: msg });
      }

      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`;

      const { data } = await axios.get(url, {
        headers: {
          "Accept": "application/vnd.github+json",
          "User-Agent": "EL-HAWARY-BOT"
        }
      });

      if (!data.items || data.items.length === 0) {
        return await sock.sendMessage(from, {
          text: "❌ مفيش نتائج"
        }, { quoted: msg });
      }

      let text = `╭─┈─┈─⟞🌐⟝─┈─┈─╮\n`;
      text += `┃ نتائج بحث GitHub\n`;
      text += `┃ البحث ← ${query}\n`;
      text += `╰─┈─┈─⟞🌐⟝─┈─┈─╯\n\n`;

      data.items.forEach((repo, index) => {
        text += `*${index + 1} • ${repo.full_name}*\n`;
        text += `⭐ النجوم: ${repo.stargazers_count}\n`;
        text += `🍴 Forks: ${repo.forks_count}\n`;
        text += `📝 الوصف: ${repo.description || "لا يوجد"}\n`;
        text += `🔗 الرابط: ${repo.html_url}\n\n`;
      });

      await sock.sendMessage(from, {
        text
      }, { quoted: msg });

    } catch (err) {
      console.log(err);

      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ\n\n${err.message}`
      }, { quoted: msg });
    }
  }
};
