const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const items = require("../../content&tools/items/items.js");
const profileModel = require("../../schemas/profile");

const itemsPerPage = 8;

module.exports = {
	name: "inventory",
	cooldown: ["10s"],
	data: new SlashCommandBuilder()
		.setName("inventory")
		.setDescription("Shows all items you own.")
		.addUserOption(option =>
			option
				.setName("user")
				.setRequired(false)
				.setDescription("View yours or someone else's inventory (item collection)."))
		.addNumberOption(option =>
			option
				.setName("page")
				.setRequired(false)
				.setDescription("The page you want to see first.")),
	async execute(interaction, client, profileData) {
		const otherUser = interaction.options.getUser("user");
		let user = interaction.user;
		let page = interaction.options.getNumber("page") || 1;

		if (otherUser) {
			profileData = await profileModel.findOne({ id: otherUser.id });

			if (!profileData) {
				const fail = new EmbedBuilder()
					.setColor("#FF0000")
					.setDescription("That user doesn't have a profile!");
				await interaction.reply({ embeds: [fail] });

				return;
			}

			user = otherUser;
		}

		if (page < 1) {
			page = 1;
		} else if (page > Math.ceil(profileData.items.length / itemsPerPage)) {
			page = Math.ceil(profileData.items.length / itemsPerPage);
		}

		await interaction.reply({ embeds: [createPage(profileData, interaction, page, user)], components: [createButton(profileData, page)] });
	},

	async button(button, client, profileData) {
		let page = parseInt(button.message.embeds[0].footer.text.split(" ")[1]);

		const id = button.message.embeds[0].author.iconURL.slice(35, 53);
		const user = await button.message.guild.members.cache.get(id).user;

		if (id != profileData.id) {
			profileData = await profileModel.findOne({ id: id });
		}

		await button.deferUpdate();

		switch (button.customId.split("-")[1]) {
		case "first":
			page = 1;
			break;
		case "previous":
			page = page - 1;
			break;
		case "next":
			page = page + 1;
			break;
		case "last":
			page = Math.ceil(profileData.items.length / itemsPerPage);
			break;
		}

		if (page > Math.ceil(profileData.items.length / itemsPerPage)) {
			page = Math.ceil(profileData.items.length / itemsPerPage);
		} else if (page < 1) {
			page = 1;
		}

		await button.message.edit({ embeds: [createPage(profileData, button, page, user)], components: [createButton(profileData, page)] });
	},
};

function createPage(profileData, interaction, page, user) {
	const embed = new EmbedBuilder()
		.setAuthor({ name: `${user.username}'s Inventory`, iconURL: user.avatarURL() })
		.setFooter({ text: `page ${page} of ${Math.ceil(profileData.items.length / itemsPerPage)}` });


	let item;
	let description;

	for (let i = 0; i < itemsPerPage && i + ((page - 1) * itemsPerPage) < profileData.items.length; i++) {
		item = ((page - 1) * itemsPerPage) + i;
		if (!profileData.settings.compactmode) {
			description = (description == null ? `${items[profileData.items[item].name].emoji} **${items[profileData.items[item].name].name}** — \`${profileData.items[item].amount}\`\n${items[profileData.items[item].name].description}\n\n` : description + `${items[profileData.items[item].name].emoji} **${items[profileData.items[item].name].name}** — \`${profileData.items[item].amount}\`\n${items[profileData.items[item].name].description}\n\n`);
		} else {
			description = (description == null ? `${items[profileData.items[item].name].emoji} **${items[profileData.items[item].name].name}** — \`${profileData.items[item].amount}\`\n` : description + `${items[profileData.items[item].name].emoji} **${items[profileData.items[item].name].name}** — \`${profileData.items[item].amount}\`\n`);
		}
	}

	if (profileData.items.length == 0) {
		description = "No items in inventory.";
	}

	embed.setDescription(description);
	return embed;
}

function createButton(profileData, page) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("inventory-first")
				.setEmoji("901651930495991828")
				.setStyle(page == 1 ? ButtonStyle.Secondary : ButtonStyle.Primary)
				.setDisabled(page == 1),

			new ButtonBuilder()
				.setCustomId("inventory-previous")
				.setEmoji("901651930256924703")
				.setStyle(page == 1 ? ButtonStyle.Secondary : ButtonStyle.Primary)
				.setDisabled(page == 1),

			new ButtonBuilder()
				.setCustomId("inventory-next")
				.setEmoji("901651930420478052")
				.setStyle(page == Math.ceil(profileData.items.length / itemsPerPage) ? ButtonStyle.Secondary : ButtonStyle.Primary)
				.setDisabled(page == Math.ceil(profileData.items.length / itemsPerPage)),

			new ButtonBuilder()
				.setCustomId("inventory-last")
				.setEmoji("901651930101723157")
				.setStyle(page == Math.ceil(profileData.items.length / itemsPerPage) ? ButtonStyle.Secondary : ButtonStyle.Primary)
				.setDisabled(page == Math.ceil(profileData.items.length / itemsPerPage)),
		);


	return row;
}