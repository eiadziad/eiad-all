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
        options: { debug: true },
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

    // التعامل مع الرسائل
    client.on('message', (channel, tags, message, self) => {
        // تجاهل رسائل البوت نفسه
        if (self) return;

        // تجاهل الرسائل التي تبدأ بـ !
        if (message.startsWith('!')) {
            console.log(`Ignoring command: ${message}`);
            return;
        }

        // طباعة اسم القناة واسم المستخدم والرسالة
        console.log(`#${channel} <${tags['display-name']}>: ${message}`);
    });

    // تشغيل البوت
    client.connect();
});
