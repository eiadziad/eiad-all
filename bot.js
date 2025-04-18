const tmi = require('tmi.js');

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

    client.on('connected', (address, port) => {
        console.log(`[Bot ${index + 1}] Connected to ${address}:${port}`);
        console.log(`[Bot ${index + 1}] Successfully joined all channels: ${channelsList}`);
    });


client.on('message', (channel, tags, message, self) => {
  if (self) return; 
  
  const firstWord = message.split(' ')[0];

    if(firstWord == '##') {
        if(username == 'eiadu') {
            const response = message.slice(3); 
            client.say(channel, response);
    }
}
});

    client.connect();
});
