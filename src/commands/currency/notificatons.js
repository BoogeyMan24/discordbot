const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "notifications",
	cooldown: ["35s"],
	order: ["alerts"],
	data: new SlashCommandBuilder()
		.setName("notifications")
		.setDescription("See the latest news, friend requests, or trade offers!"),
	async execute(interaction) {
		
	},
};