const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../../schemas/profile");

module.exports = {
	name: "deleteprofile",
	cooldown: ["0s"],
	order: ["deleteprofile"],
	data: new SlashCommandBuilder()
		.setName("deleteprofile")
		.setDescription("Deletes your or someone's profile!")
		.addUserOption(option =>
			option
				.setName("user")
				.setRequired(false)
				.setDescription("Delete that user's profile.")),
	async execute(interaction, client, profileData) {
		if (interaction.user.id != "707265292635734076") {
			await interaction.reply({ content: "No." });
			return;
		}

		const otherUser = interaction.options.getUser("user");

		if (!otherUser) {
			await profileData.deleteOne();
			await interaction.reply({ content: `Done. ${interaction.user.username}'s profile has been deleted.` });
		} else {
			profileData = await profileModel.findOne({ id: otherUser.id });
			await profileData.deleteOne();

			await interaction.reply({ content: `Done. ${otherUser.username}'s profile has been deleted.` });
		}
	},
};
