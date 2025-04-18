const tmi = require('tmi.js');

// قراءة القيم من متغيرات البيئة
const tokenListEnv = process.env.TWITCH_TOKEN_LIST;
if (!tokenListEnv) {
    throw new Error("TWITCH_TOKEN_LIST environment variable is not set.");
}
const tokenList = tokenListEnv.split(',').map(token => token.trim());

const channelsListEnv = process.env.TWITCH_CHANNELS_LIST;
if (!channelsListEnv) {
    throw new Error("TWITCH_CHANNELS_LIST environment variable is not set.");
}
const channelsList = channelsListEnv.split(',').map(channel => channel.trim());

const username = process.env.TWITCH_BOT_USERNAME;
if (!username) {
    throw new Error("TWITCH_BOT_USERNAME environment variable is not set.");
}

console.log(`Attempting to join all channels: ${channelsList}`);

// تشغيل البوتات على جميع القنوات
tokenList.forEach((token, index) => {
    const client = new tmi.Client({
        options: { debug: false },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: username, // اسم البوت
            password: token     // التوكن الخاص بالبوت
        },
        channels: channelsList // جميع القنوات
    });

    // عندما يتصل البوت
    client.on('connected', (address, port) => {
        console.log(`[Bot ${index + 1}] Connected to ${address}:${port}`);
        console.log(`[Bot ${index + 1}] Successfully joined all channels: ${channelsList}`);
    });


const charMap = {
  'h': 'ا', 'g': 'ل', ']': 'د', '[': 'ج', 'p': 'ح', 'o': 'خ', 'i': 'ه', 'u': 'ع', 'y': 'غ',
  't': 'ف', 'r': 'ق', 'e': 'ث', 'w': 'ص', 'q': 'ض', '`': 'ذ', '\'': 'ط', ';': 'ك', 'l': 'م',
  'k': 'ن', 'j': 'ت', 'f': 'ب', 'd': 'ي', 's': 'س', 'a': 'ش', '/': 'ظ', '.': 'ز', ',': 'و',
  'm': 'ة', 'n': 'ى', 'b': 'لا', 'v': 'ر', 'c': 'ؤ', 'x': 'ء', 'z': 'ئ'
};

function replaceChars(text) {
  return text.split('').map(char => charMap[char] || char).join('');
}

function isArabicText(text) {
  return /^[\u0600-\u06FF\s]+$/.test(text);
}

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  // السماح فقط للمستخدم EIADu باستخدام الأمر
  if (tags.username !== 'eiadu') return;

  if (tags['reply-parent-msg-id'] && message.toLowerCase().includes('غير')) {
    if (tags['reply-parent-display-name'] && tags['reply-parent-msg-body']) {
      const originalSender = tags['reply-parent-display-name'];
      const originalMessage = tags['reply-parent-msg-body'];

      const replacedMessage = replaceChars(originalMessage);

      client.say(channel, `**( ${replacedMessage} )**`);
    }
  }

  const command = "غير";
  if (message.startsWith(command)) {
    const textToReplace = message.slice(command.length).trim();

    if (isArabicText(textToReplace)) {
      client.say(channel, `@${tags.username} mhm`);
    } else {
      const replacedMessage = replaceChars(textToReplace);
      client.say(channel, `**( ${replacedMessage} )**`);
    }
  }


 console.log(`#${channel} <${tags['display-name']}>: ${message}`);

});


    // تشغيل البوت
    client.connect();
});
