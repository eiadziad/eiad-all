const tmi = require('tmi.js');

const tokenList = process.env.TWITCH_TOKEN_LIST?.split(',').map(t => t.trim()) || [];
const channelsList = process.env.TWITCH_CHANNELS_LIST?.split(',').map(c => c.trim()) || [];
const username = process.env.TWITCH_BOT_USERNAME;

if (!tokenList.length || !channelsList.length || !username) {
    throw new Error("Please make sure TWITCH_TOKEN_LIST, TWITCH_CHANNELS_LIST, and TWITCH_BOT_USERNAME are set.");
}

// Set لتتبع الرسائل التي تمت طباعتها بالفعل
const seenMessages = new Set();

tokenList.forEach((token, index) => {
    const client = new tmi.Client({
        options: { debug: true },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: username,
            password: token
        },
        channels: channelsList
    });

    client.on('connected', () => {
        console.log(`[Bot ${index + 1}] Connected and joined: ${channelsList}`);
    });

    client.on('message', (channel, tags, message, self) => {
        if (self || message.startsWith('!')) return;

        // نستخدم معرف فريد بناءً على اسم المستخدم، اسم القناة، والرسالة
        const msgId = `${channel}-${tags['id'] || tags['user-id']}-${message}`;

        if (!seenMessages.has(msgId)) {
            seenMessages.add(msgId);


        }
    });

    client.connect();
});
