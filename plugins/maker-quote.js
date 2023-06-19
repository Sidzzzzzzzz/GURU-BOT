import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  let userPfp;

  try {
    if (!text && !m.quoted) {
      m.react('❔');
      return m.reply(`Please provide a text (Type or mention a message)!`);
    }

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) throw '✳️ The user is not found in my database'

    userPfp = './src/avatar_contact.png'; // Ensure the fallback image exists in the right directory
    // Fetch profile picture
    try {
      let vcard = 'vcard' + who.split('@')[0] + '.vcf'
      vcard = await conn.getProfilePicture(who)
      userPfp = vcard
    } catch (e) {
      console.error(e);
    }

    let user = global.db.data.users[who]
    let { name } = global.db.data.users[who]

    m.react(rwait);
    let quoteText = m.quoted ? m.quoted.msg : text ? text : "";

    let quoteJson = {
      type: "quote",
      format: "png",
      backgroundColor: "#FFFFFF",
      width: 1800,
      height: 200, // Adjust the height value as desired
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: name,
            photo: {
              url: userPfp,
            },
          },
          text: quoteText,
          replyMessage: {},
        },
      ],
    };

    let res = await fetch('https://bot.lyo.su/quote/generate', {
      method: 'POST',
      body: JSON.stringify(quoteJson),
      headers: { 'Content-Type': 'application/json' },
    });

    let json = await res.json();
   if (json.ok) {
  let bufferImage = Buffer.from(json.result.image, 'base64');
  let stickerr = await sticker(false, bufferImage, global.packname, global.author);
  await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, { asSticker: true });
} else {
  console.error("API response was not ok. Error: ", json.error);
  throw new Error(`API response was not ok. Error: ${json.error}`);
}

    m.react("🤡");
  } catch (e) {
    m.react("😭")
  } 
}
handler.help = ['quote'];
handler.tags = ['fun'];
handler.command = ['quote'];

export default handler;

