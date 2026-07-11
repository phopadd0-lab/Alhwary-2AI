async function test(m, { conn, bot, text }) {
  try {
    if (!text) return m.reply("*💙 ~ Type your search in English to get images ~ ❤️*");

    const res = await bot.Api.search.pinterestImages({ q: text });
    const arr = res.data;

    if (!arr || arr.length === 0) {
      return m.reply("*⚠️ ~ No search results found ~*");
    }

    const start = Math.floor(Math.random() * (arr.length - 10));
    const selectedImages = arr.slice(start, start + 10);

    const cards = selectedImages.map((item, index) => {
      const title = item.title && item.title !== 'No title' ? item.title : `Image ~ ${index + 1}`;

      return {
        imageUrl: item.url,
        bodyText: `*${title}*`,
        footerText: item.owner ? `👤 ${item.owner} • Pinterest` : '📌 Pinterest Image',
        buttons: [
          { name: 'cta_url', params: { display_text: '🔗╎ View', url: item.pinUrl || item.url } },
          { name: 'cta_copy', params: { display_text: '📋╎ Copy Link', copy_code: item.url } }
        ]
      };
    });

    return await conn.sendCarousel(m.chat, {
      headerText: `📸 Your search → *[ ${text} ]* `,
      globalFooterText: 'Swipe to see more images →',
      cards: cards,
      mentions: [m.sender],
      newsletter: {
        name: 'OWNER',
        jid: '201556853817@newsletter'
      },
    }, reply_status);

  } catch (error) {
    console.error(error.message);
    m.react("❌")
  }
}

test.category = "search";
test.usage = ["pinterest"];
test.command = ["pin", "pinterest"];
export default test;