module.exports = {
	cat: {
		name:"Cat",
		type: "intelligence",
		emoji: ":cat:",
		description: "A cat is very relaxed and sleepy, until you provoke it.",

		probability: 0.2,
		priceRange: [8500, 10000],
		boost: {
			intelligence: {
				boostType: "intelligence",
				boostRange: [0.1, 0.5],
			},
		},
	},
	dog: {
		name: "Dog",
		type: "scavenge",
		emoji: ":dog:",
		description: "A man's best friend. A dog is an active and trustworthy companion that is able to sniff any rare loot.",

		probability: 0.2,
		priceRange: [8500, 10000],
		boost: {
			scavenge: {
				boostType: "scavenge",
				boostRange: [0.1, 0.5],
			},
		},
	},
	turtle: {
		name: "Turtle",
		type: "defense",
		emoji: ":turtle:",
		description: "A slow but protective friend. Able to be used as a shield.",

		probability: 0.2,
		priceRange: [8500, 10000],
		boost: {
			defense: {
				boostType: "defense",
				boostRange: [0.1, 0.5],
			},
		},
	},
	snake: {
		name: "Snake",
		type: "attack",
		emoji: ":snake:",
		description: "A slimy slithery animal that has a posinous attack.",

		probability: 0.2,
		priceRange: [8500, 10000],
		boost: {
			attack: {
				boostType: "attack",
				boostRange: [0.1, 0.5],
			},
		},
	},
};