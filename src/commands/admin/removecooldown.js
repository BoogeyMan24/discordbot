const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../../schemas/profile");

module.exports = {
	name: "removecooldown",
	cooldown: ["0s"],
	order: ["removecooldown"],
	data: new SlashCommandBuilder()
		.setName("removecooldown")
		.setDescription("Removes all cooldowns from either your or someone's profile!")
		.addUserOption(option =>
			option
				.setName("user")
				.setRequired(false)
				.setDescription("Remove all cooldowns from that user.")),
	async execute(interaction, client, profileData) {
		if (interaction.user.id != "707265292635734076") {
			await interaction.reply({ content: "No." });
			return;
		}

		const otherUser = interaction.options.getUser("user");

		if (!otherUser) {
			await profileData.updateOne({
				$set: {
					cooldowns: {},
				},
			});

			await interaction.reply({ content: `Done. ${interaction.user.username}'s cooldowns have been removed.` });
		} else {
			profileData = await profileModel.findOne({ id: otherUser.id });

			await profileData.updateOne({
				$set: {
					cooldowns: {},
				},
			});

			await interaction.reply({ content: `Done. ${otherUser.username}'s cooldowns have been removed.` });
		}
	},
};