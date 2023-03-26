const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const profileModel = require("../../schemas/profile");

module.exports = {
	name: "balance",
	cooldown: ["10s"],
	order: ["balance"],
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Shows your or someone's financial balance.")
		.addUserOption(option =>
			option
				.setName("user")
				.setRequired(false)
				.setDescription("See the user's balance.")),
	async execute(interaction, client, profileData) {
		const otherUser = interaction.options.getUser("user");

		let embed;
		if (!otherUser) {
			embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Balance`)
				.setColor("36393F")
				.setFields(
					{ name: "Wallet", value: `${(profileData.wallet).toLocaleString("en-US")}`, inline: true },
					{ name: "Bank", value: `${(profileData.bank).toLocaleString("en-US")}/${(profileData.bankSpace).toLocaleString("en-US")} \`${(100 * profileData.bank / profileData.bankSpace).toFixed(1)}%\``, inline: true },
				)
				.setFooter({ text:"BoogeyMan#6398" })
				.setTimestamp();
		} else {
			profileData = await profileModel.findOne({ id: otherUser.id });

			if (!profileData) {
				embed = new EmbedBuilder()
					.setTitle(`${otherUser.username}'s Balance`)
					.setColor("36393F")
					.setFields(
						{ name: "Wallet", value: `${(profileData.wallet).toLocaleString("en-US")}`, inline: true },
						{ name: "Bank", value: `${(profileData.bank).toLocaleString("en-US")}/${(profileData.bankSpace).toLocaleString("en-US")} \`${(100 * profileData.bank / profileData.bankSpace).toFixed(1)}%\``, inline: true },
					)
					.setFooter({ text:"BoogeyMan#6398" })
					.setTimestamp();
			} else {
				const fail = new EmbedBuilder()
					.setColor("#FF0000")
					.setDescription("That user doesn't have a profile!");
				await interaction.reply({ embeds: [fail] });

				return;
			}
		}

		await interaction.reply({ embeds: [embed] });
	},
};