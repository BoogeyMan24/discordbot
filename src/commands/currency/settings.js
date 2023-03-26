const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const settings = require("../../content&tools/settings/settings.js");
const profileModel = require("../../schemas/profile.js");

module.exports = {
	name: "settings",
	cooldown: ["35s"],
	order: ["settings"],
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Change the way the bot interactions with you. From dm permissions, to which notifications alert you."),
	async execute(interaction, client, profileData) {
		await interaction.reply({ embeds: [createEmbed("overview", profileData, interaction)], components: [createMenu(profileData)] });
	},

	async button(button, client, profileData) {
		await button.deferUpdate();

		const value = button.message.embeds[0].title.replaceAll(" ", "").toLowerCase();

		switch (button.customId.split("-")[1]) {
		case "true":
		case "false":
			await profileData.updateOne({
				$set: {
					["settings." + value]: (button.customId.split("-")[1] === "true" ? true : false),
				},
			});
			break;
		case "anyone":
		case "guild":
		case "off":
			await profileData.updateOne({
				$set: {
					["settings." + value]: button.customId.split("-")[1],
				},
			});
			break;
		}
		profileData = await profileModel.findOne({ id: button.user.id });


		await button.message.edit({ embeds: [createEmbed(value, profileData, button)], components: [createMenu(profileData), createRow(value, profileData)] });
	},

	async menu(menu, client, profileData) {
		await menu.deferUpdate();

		const value = menu.values[0];

		let component = null;
		if (value != "overview") {
			component = createRow(value, profileData);
		}

		const row = (component != null ? [createMenu(profileData), component] : [createMenu(profileData)]);

		await menu.message.edit({ embeds: [createEmbed(value, profileData, menu)], components: row });
	},
};


function createEmbed(value, profileData, interaction) {
	const embed = new EmbedBuilder();
	let description;
	if (value == "overview") {
		embed.setTitle(`${interaction.user.username}'s Settings`);
		for (let i = 0; i < Object.keys(settings).length; i++) {
			if (!profileData.settings.compactmode) {
				description = (description == null ? "Using the menu below, select which settings you would like\nto view in more detail or modify.\n\n" + `**${settings[Object.keys(settings)[i]].name}** — \`${profileData.settings[Object.keys(settings)[i]]}\`\n${settings[Object.keys(settings)[i]].short}\n\n` : description + `**${settings[Object.keys(settings)[i]].name}** — \`${profileData.settings[Object.keys(settings)[i]]}\`\n${settings[Object.keys(settings)[i]].short}\n\n`);
			} else {
				description = (description == null ? "Using the menu below, select which settings you would like\nto view in more detail or modify.\n\n" + `**${settings[Object.keys(settings)[i]].name}** — \`${profileData.settings[Object.keys(settings)[i]]}\`\n` : description + `**${settings[Object.keys(settings)[i]].name}** — \`${profileData.settings[Object.keys(settings)[i]]}\`\n`);
			}
		}
		embed.setDescription(description);
	} else if (value != null) {
		embed.setTitle(settings[value].name)
			.setDescription(settings[value].description);
	}

	return embed;
}


function createMenu(profileData) {
	const row = new ActionRowBuilder();
	const menu = new StringSelectMenuBuilder()
		.setCustomId("settings-settings")
		.setPlaceholder("Nothing selected...")
		.setMaxValues(1)
		.addOptions([
			{
				label: "Overview",
				description: "See all availavable settings and their values.",
				value: "overview",
			},
		]);
	for (let i = 0; i < Object.keys(settings).length; i++) {
		menu.addOptions([
			{
				label: `${settings[Object.keys(settings)[i]].name}`,
				description: `${profileData.settings[Object.keys(settings)[i]]} — ${settings[Object.keys(settings)[i]].short}`,
				value: `${Object.keys(settings)[i]}`,
			},
		]);
	}

	row.addComponents(menu);

	return row;
}


function createRow(value, profileData) {
	let row = null;

	switch (settings[value].type) {
	case "truefalse":
		row = trueFalse(value, profileData);
		break;
	case "friendrequests":
		row = friendRequests(value, profileData);
		break;
	case null:
		row = null;
		break;
	}

	return row;
}



function trueFalse(value, profileData) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("settings-false")
				.setLabel("Disable")
				.setStyle(ButtonStyle.Danger)
				.setDisabled(profileData.settings[value] == false ? true : false),

			new ButtonBuilder()
				.setCustomId("settings-true")
				.setLabel("Enable")
				.setStyle(ButtonStyle.Success)
				.setDisabled(profileData.settings[value] == true ? true : false),
		);

	return row;
}


function friendRequests(value, profileData) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("settings-anyone")
				.setLabel("Anyone")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(profileData.settings[value] == "anyone" ? true : false),

			new ButtonBuilder()
				.setCustomId("settings-guild")
				.setLabel("Guild")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(profileData.settings[value] == "guild" ? true : false),
			new ButtonBuilder()
				.setCustomId("settings-off")
				.setLabel("Off")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(profileData.settings[value] == "off" ? true : false),
		);

	return row;
}