const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "pet",
	cooldown: ["15s", "25s", "10s", "1h"],
	order: ["view", "shop", "care", "illegal-shop"],
	data: new SlashCommandBuilder()
		.setName("pet")
		.setDescription("Everything related to your pets.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("view")
				.setDescription("View your pets, train them, and upgrade them."))
		.addSubcommand(subcommand =>
			subcommand
				.setName("shop")
				.setDescription("Purchase a pet to take care of."))
		.addSubcommand(subcommand =>
			subcommand
				.setName("care")
				.setDescription("Take care for your pets and increase their level."))
		.addSubcommand(subcommand =>
			subcommand
				.setName("exotic-shop")
				.setDescription("Purchase limited time pets, that are rare, unique, and expensive.")),
	async execute(interaction, client, profileData) {
		if (interaction.options.getSubcommand() == "view") {
			//
		} else if (interaction.options.getSubcommand() == "shop") {
			await interaction.reply({ embeds: [createShopEmbed()] });

		} else if (interaction.options.getSubcommand() == "care") {
			//
		}
		// } else if (interaction.options.getSubcommand() == "exotic-shop") {
		// 	//
		// }
	},
};


function createShopEmbed() {
	const embed = new EmbedBuilder()
		.setTitle("Petshop Overview")
		.setDescription("This shop is an ordinary petshop. Any average household pet can be found here.")
		.setFields(
			{ name: "<:turt:1064658865582522448> " + "**Turt** — `defense`", value: "idk idk idk" },
			{ name: "<:turt:1064658865582522448> " + "**Turt** — `defense`", value: "idk idk idk" },
			{ name: "<:turt:1064658865582522448> " + "**Turt** — `defense`", value: "idk idk idk" },
			{ name: "<:turt:1064658865582522448> " + "**Turt** — `defense`", value: "idk idk idk" },
		);

	return embed;
}