const { Routes, REST } = require("discord.js");
const fs = require("fs");

const TOKEN = process.env.TOKEN;



module.exports = (client, clientId, guildId) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync("./src/commands");
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));

			const { commands, commandArray } = client;
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
			}
		}


		const rest = new REST({ version: 9 }).setToken(TOKEN);
		try {
			console.log("Started refreshing application commands");

			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: client.commandArray,
			});

			console.log("Successfully reloaded application commands");
		} catch (error) {
			console.error(error);
		}
	};
};