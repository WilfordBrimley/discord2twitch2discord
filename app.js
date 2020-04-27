//Discord to Twitch both ways by Lovecraft#4690. WTFPL

//Load Core config
let config = require(`./config.json`),

	//Discord Client Logon
	discordClient = new(require(`discord.js`)).Client(),
	logChannel = [];

discordClient.once('ready', () => {
	console.log('Ready!');
	logChannel = discordClient.guilds.get(config.guildMirror).channels.find(channel => channel.name === config.disChannel);
});
discordClient.login(config.token);

// Handle discord to twitch
discordClient.on(`message`, (message) => {
	if (message.author.bot == true) return;
	if (message.channel == logChannel) {
		twitchClient.say(config.channels, `${message.author.username}: ${message.cleanContent}`)
	}
})

//Twitch Client Logon
const twitchClient = new(require('tmi.js')).Client({
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
twitchClient.connect();


//Handle twitch to discord
twitchClient.on('message', (channel, tags, message, self) => {
	if (message == `!test`) {
		twitchClient.say(channel, `whatever`)
	}
	if (self) return;
	logChannel.send(`**${tags.username}**: ${message}`)
});

//Extras
twitchClient.on("connected", (address, port) => {
	console.log(`twitchClient connected success!
	ADDDRESS: ${address}
	PORT: ${port}`)
});

twitchClient.on('logon', () => {
	console.log(`Connection established, TX/RX UP`)
});

twitchClient.on("hosting", (channel, target, viewers) => {
	twitchClient.say(`Now Hosting: ${channel} with ${viewers}
	You can check them out at: ${target}`)
});
