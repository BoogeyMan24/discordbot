const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "ping",
	cooldown: ["35s"],
	order: ["ping"],
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Returns pong!"),
	async execute(interaction) {
		await interaction.reply({ content: "pong" });
	},
};