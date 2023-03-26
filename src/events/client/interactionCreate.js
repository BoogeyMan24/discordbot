const { EmbedBuilder } = require("@discordjs/builders");
const profileModel = require("../../schemas/profile.js");

function interpretCooldown(command, cooldownStr) {
	const time = parseInt(cooldownStr.slice(0, -1));
	let cooldown;
	try {
		switch (cooldownStr.slice(-1)) {
		case "s":
			cooldown = time;
			break;
		case "m":
			cooldown = time * 60;
			break;
		case "h":
			cooldown = time * 3_600;
			break;
		case "d":
			cooldown = time * 86_400;
			break;
		case "w":
			cooldown = time * 604_800;
			break;
		case "t":
			cooldown = time * 2_628_000;
			break;
		case "y":
			cooldown = time * 31_540_000;
			break;
		default:
			console.log(`ERROR: Command ${command.name} FAILED to identify cooldown time.`);
			break;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
	return parseInt(cooldown);
}

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		/* Profile Creation */ // add valid profile check using { item : { $exists: false }
		let profileData = await profileModel.findOne({ id: interaction.user.id });
		if (profileData == null) {
			try {
				const profile = await profileModel.create({
					username: interaction.user.username,
					id: interaction.user.id, // 1673046409000
					memberSince: (interaction.user.id != "707265292635734076" ? Date.now() : 1673046409000),

					items: [
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "idcard", amount: 1 },
						{ name: "start", amount: 1 },
					],
				});
				await profile.save();

				profileData = await profileModel.findOne({ id: interaction.user.id });
			} catch (err) {
				console.log("Couldn't create profile in database: \n" + err);
			}
		}

		/* SLASH COMMAND HANDLING */
		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) return;


			/* Cooldown Check */
			if (command.cooldown != null) {
				const embed = new EmbedBuilder();
				if (command.cooldown.length == 1) {
					if (profileData.cooldowns[commandName] > Math.floor(Date.now() / 1000)) {
						embed.setTitle("Chillax! Take it easy")
							.setDescription(`Run /${commandName} again <t:${profileData.cooldowns[commandName]}:R>\nDefault cooldown is ${command.cooldown[0]}`);

						await interaction.reply({ embeds:[embed], ephemeral: true });
						return;
					}
				} else if (profileData.cooldowns[`${commandName}/${interaction.options.getSubcommand()}`] > Math.floor(Date.now() / 1000)) {
					embed.setTitle("Chillax! Take it easy")
						.setDescription(`Run /${commandName} ${interaction.options.getSubcommand()} again <t:${profileData.cooldowns[`${commandName}/${interaction.options.getSubcommand()}`]}:R>\nDefault cooldown is ${command.cooldown[(command.order.indexOf(interaction.options.getSubcommand()))]}`);

					await interaction.reply({ embeds:[embed], ephemeral: true });
					return;
				}
			}


			/* Command Execution */
			try {
				await command.execute(interaction, client, profileData);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "Something went wrong while executing command...",
					ephemeral: true,
				});
			}

			/* Add Cooldown */
			if (command.cooldown != null) {
				await profileData.updateOne({
					$set: {
						[(command.cooldown.length == 1 ? `cooldowns.${commandName}` : `cooldowns.${commandName}/${interaction.options.getSubcommand()}`)] : Math.floor(Date.now() / 1000) + interpretCooldown(command, (command.cooldown.length == 1 ? command.cooldown[0] : command.cooldown[(command.order.indexOf(interaction.options.getSubcommand()))])),
					},
				});
			}
		} else if (interaction.isButton()) {
			const command = interaction.client.commands.get(interaction.customId.split("-")[0]);

			if (command.ogonly != false) {
				if (interaction.message.interaction.user != interaction.user) {
					await interaction.reply({ content: "Only the slash command sender may interact with this message.", ephemeral: true });
					return;
				}
			}

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.button(interaction, client, profileData);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isStringSelectMenu()) {
			const command = interaction.client.commands.get(interaction.customId.split("-")[0]);

			if (command.ogonly != false) {
				if (interaction.message.interaction.user != interaction.user) {
					await interaction.reply({ content: "Only the slash command sender may interact with this message.", ephemeral: true });
					return;
				}
			}

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.menu(interaction, client, profileData);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	},
};