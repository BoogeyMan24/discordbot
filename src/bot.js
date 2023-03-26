// ---------------IMPORTANT PLANS---------------
// 1. Profile command
// 2. Subcommand cooldown


// ---------------IMPORTANT IDEAS---------------
// 1. Limited items storage
//


// ---------------MAYBE IDEAS---------------
// 1. Use autocompletion to inform the user about their status (money)
//

require("dotenv").config();
const { connect, connection, mongoose } = require("mongoose");
const { Client, Events, Collection } = require("discord.js");
const fs = require("fs");

const TOKEN = process.env.TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;


// SETTINGS
const clientId = "1059180189554331709";
const guildIds = ["1040657469216653466", "1060592992395726932"];
const guildId = guildIds[0];



/*
    LIST OF IMPORTANT INTENTS:
    -
    -
*/
const client = new Client({
	intents: 3276799,
});


client.commands = new Collection();
client.commandArray = [];

const utilityFolders = fs.readdirSync("./src/utilities");
for (const folder of utilityFolders) {
	const utilityFiles = fs.readdirSync(`./src/utilities/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of utilityFiles) require(`./utilities/${folder}/${file}`)(client, clientId, guildId);
}


// Important Events
client.once(Events.ClientReady, () => {
	console.log("Bot is UP and RUNNING!");
});

connection.once("connected", () => {
	console.log("Connected to Database!");
});

connection.once("disconnected", () => {
	console.log("Disconnected to Database!!!!");
});

connection.once("err", err => {
	console.log(`[Database status]: ERROR:\n${err}`);
});



client.handleEvents();
client.handleCommands();
client.login(TOKEN);
mongoose.set("strictQuery", false);
(async () => {
	await connect(MONGODB_URI).catch(console.error);
})();