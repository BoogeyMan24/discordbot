const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "withdraw",
	cooldown: ["10s"],
	order: ["withdraw"],
	data: new SlashCommandBuilder()
		.setName("withdraw")
		.setDescription("Transfer money from your bank to your wallet.")
		.addStringOption(option =>
			option
				.setName("amount")
				.setRequired(true)
				.setDescription("Withdraw an integer like '25,000' (or '25k'), a percent like '35%', or a word like 'max' or 'half'.")),
	async execute(interaction, client, profileData) {
		let value = interaction.options.getString("amount").replace(",", "").replace(/\s/g, "");
		let intValue = 0;

		switch (value) {
		case "max":
			value = 1;
			intValue = 1;
			break;
		case "half":
			value = 1 / 2;
			break;
		case "third":
			value = 1 / 3;
			break;
		case "fourth":
			value = 1 / 4;
			break;
		case "fifth":
			value = 1 / 5;
			break;
		case "sixth":
			value = 1 / 6;
			break;
		case "seventh":
			value = 1 / 7;
			break;
		case "eighth":
			value = 1 / 8;
			break;
		case "ninth":
			value = 1 / 9;
			break;
		case "tenth":
			value = 1 / 10;
			break;
		case value.slice(-1) == "%":
			value = parseInt(value.slice(0, -1)) / 100;
			break;
		default:
			if (value.slice(-1) == "%") {
				value = Math.round(parseInt(value.slice(0, -1))) / 100;
				intValue = 1;
			} else {
				await interaction.reply({ embeds: [createEmbed("invalid")] });
				return;
			}
		}

		if (value - intValue <= 0) {
			// Wallet is enough to fill bank  ( Use Bankspace Left )
			value = Math.round(profileData.bank * value);

			if (value <= 0) {
				console.log("This shouldn't happen. If it does try to figure out why. ERROR: src/commands/currency/withdraw.js on line ~57.");
				await interaction.reply({ embeds: [createEmbed("invalid")] });
				return;
			} else {
				await profileData.updateOne({
					$inc: {
						wallet: value,
						bank: -value,
					},
				});
			}

			await interaction.reply({ embeds: [createEmbed("valid", profileData, value)] });
			return;
		}



		const unitless = Math.round(parseInt(value.slice(0, -1)));

		switch (value.slice(-1).toLowerCase()) {
		case "k":
			value = unitless * 1_000;
			break;
		case "m":
			value = unitless * 1_000_000;
			break;
		case "b":
			value = unitless * 1_000_000_000;
			break;
		}


		try {
			intValue = parseInt(value);

			if (intValue <= profileData.bank) {
				console.log("test2");
				await profileData.updateOne({
					$inc: {
						wallet: intValue,
						bank: -intValue,
					},
				});

				await interaction.reply({ embeds: [createEmbed("valid", profileData, intValue)] });
				return;
			}
		} catch (err) {
			console.log("error");
		}
	},
};


function createEmbed(reason, profileData, amount) {
	const embed = new EmbedBuilder();

	switch (reason) {
	case "invalid":
		embed.setDescription("Tried to withdraw an invalid amount!").setColor("Red");
		break;
	case "valid":
		embed.setDescription(`Withdraw \`${amount.toLocaleString("en-US")}\``).addFields(
			{ name: "New Wallet", value: `${(profileData.wallet + amount).toLocaleString("en-US")}`, inline: true },
			{ name: "New Bank", value: `${(profileData.bank - amount).toLocaleString("en-US")}/${(profileData.bankSpace).toLocaleString("en-US")} \`${(100 * (profileData.bank - amount) / profileData.bankSpace).toFixed(1)}%\``, inline: true },
		).setColor("36393F");
		break;
	}

	return embed;
}