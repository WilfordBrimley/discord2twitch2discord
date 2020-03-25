//Discord to Twitch both ways by Lovecraft#4690. WTFPL
//Load Core config
config = require(`./config.json`);
//Discord Client
const disBot = new(require(`discord.js`)).Client();
disBot.once('ready', () => {
	console.log('Ready!');
	logChannel = disBot.guilds.get(config.guildMirror).channels.find(channel => channel.name === config.disChannel);
});
disBot.login(config.token);

//Twitch client
const client = new(require('tmi.js')).Client({
	options: {
		debug: true
	},
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: config.username,
		password: config.oauth
	},
	channels: [config.channels]
});
client.connect();

// Handle discord to twitch
disBot.on(`message`, (message) => {
	if (message.author.bot == true) return;
	if (message.channel == logChannel) {
		client.say(config.channels, `${message.author.username}: ${message.cleanContent}`)
	}
})

//Handle twitch to discord
client.on('message', (channel, tags, message, self) => {
	if (self) return;
	logChannel.send(`${tags.username}: ${message}`)
});
/* This is the config.json setup:
{
    "oauth": "YOUROAUTH",
    "username": "xOverBot",
    "channels": "",
    "token" : "YOURTOKEN",
    "guildMirror": "",
    "disChannel": "stream-chat"

}
*/
