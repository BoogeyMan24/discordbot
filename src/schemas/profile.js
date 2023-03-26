const mongoose = require("mongoose");
const { Schema } = mongoose;


const schema = new Schema(
	{
		username: { type: String, require: true },
		id: { type: String, require: true, unique: true },
		memberSince: { type: Date, default: Date.now(), require: true },

		settings: { type: Object, default: {
			compactmode: false,
			friendrequests: "anyone",
		} },
		shops: { type: Object, default: {
			last: null,
			exoticshop: {},
		} },

		wallet: { type: Number, default: 0 },
		bank: { type: Number, default: 0 },
		bankSpace: { type: Number, default: 250000 },
		items: { type: Object, default: [
			{ name: "start", amount: 1 },
		] },

		job: { type: String, default: "unemployed" },
		skills: { type: Object, default: {
			intelligence: 0, // Boosts how fast you learn new skills and increases your likelyhood of solving puzzle related activities
			strength: 0, // You do more damage  [add more...]
			charisma: 0, // More promotions  [add more...]
			luck: 0, // Boosts your chances in luck involcing scenarios
			agility: 0, // Allows you to do more stunts [add more...]
			defense: 0, // Improves your max health / withstand more damage
			scavenge: 0, // Boosts activities involving scavenging (hints maybe?)
		},
		},

		pets: { type: Object, default: {} },

		cooldowns: { type: Object, default: {} },
	},
);

const name = "profiles";

module.exports = mongoose.models[name] || mongoose.model(name, schema);