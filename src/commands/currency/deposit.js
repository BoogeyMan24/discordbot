const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "deposit",
	cooldown: ["10s"],
	order: ["deposit"],
	data: new SlashCommandBuilder()
		.setName("deposit")
		.setDescription("Move money from your wallet to your bank.")
		.addStringOption(option =>
			option
				.setName("amount")
				.setRequired(true)
				.setDescription("Deposit an integer like '25,000' (or '25k'), a percent like '35%', or a word like 'max' or 'half'.")),
	async execute(interaction, client, profileData) {
		if (profileData.bank == profileData.bankSpace) {
			await interaction.reply({ embeds: [createEmbed("fullbank")] });
			return;
		}

		let value = interaction.options.getString("amount").replace(",", "").replace(/\s/g, "");
		let intValue = 0;

		switch (value) {
		case "max":
			value = 1;
			intValue = 1;
			break;
		case "half":
			value = 1 / 2;
			intValue = 1;
			break;
		case "third":
			value = 1 / 3;
			intValue = 1;
			break;
		case "fourth":
			value = 1 / 4;
			intValue = 1;
			break;
		case "fifth":
			value = 1 / 5;
			intValue = 1;
			break;
		case "sixth":
			value = 1 / 6;
			intValue = 1;
			break;
		case "seventh":
			value = 1 / 7;
			intValue = 1;
			break;
		case "eighth":
			value = 1 / 8;
			intValue = 1;
			break;
		case "ninth":
			value = 1 / 9;
			intValue = 1;
			break;
		case "tenth":
			value = 1 / 10;
			intValue = 1;
			break;
		default:
			if (value.slice(-1) == "%") {
				value = Math.round(parseInt(value.slice(0, -1))) / 100;
				intValue = 1;
			}
		}


		if (profileData.wallet >= profileData.bankSpace - profileData.bank && value - intValue <= 0) {
			// Wallet is enough to fill bank  ( Use Bankspace Left )
			value = Math.round((profileData.bankSpace - profileData.bank) * value);

			if (value <= 0) {
				await interaction.reply({ embeds: [createEmbed("invalid")] });
				return;
			} else {
				await profileData.updateOne({
					$inc: {
						bank: value,
						wallet: -value,
					},
				});
			}

			await interaction.reply({ embeds: [createEmbed("valid", profileData, value)] });
			return;
		} else if (value - intValue <= 0) {
			// Wallet is not enough to fill bank  ( Use Wallet Amount )
			value = Math.round(profileData.wallet * value);

			if (value <= 0) {
				await interaction.reply({ embeds: [createEmbed("invalid")] });
				return;
			} else {
				await profileData.updateOne({
					$inc: {
						bank: value,
						wallet: -value,
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

			if (intValue > profileData.bankSpace - profileData.bank || intValue >= profileData.wallet) {
				await interaction.reply({ embeds: [createEmbed("nospace", profileData)] });
				return;
			} else {
				await profileData.updateOne({
					$inc: {
						bank: intValue,
						wallet: -intValue,
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
	case "fullbank":
		embed.setDescription("Your bank is already full!").setColor("Red");
		break;
	case "nospace":
		embed.setDescription(`Not enough space in bank or not enough money!  \`${(profileData.bankSpace - (profileData.bank)).toLocaleString("en-US")}\` space left.`).setColor("Red");
		break;
	case "invalid":
		embed.setDescription("Tried to deposited an invalid amount!").setColor("Red");
		break;
	case "valid":
		embed.setDescription(`Deposited \`${amount.toLocaleString("en-US")}\``).addFields(
			{ name: "New Wallet", value: `${(profileData.wallet - amount).toLocaleString("en-US")}`, inline: true },
			{ name: "New Bank", value: `${(profileData.bank + amount).toLocaleString("en-US")}/${(profileData.bankSpace).toLocaleString("en-US")} \`${(100 * (profileData.bank + amount) / profileData.bankSpace).toFixed(1)}%\``, inline: true },
		).setColor("36393F");
		break;
	}


	return embed;
}