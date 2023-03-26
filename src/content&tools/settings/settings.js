module.exports = {
	compactmode: {
		name: "Compact Mode",
		short: "How much information is displayed at once",
		description: `Choose whether you want feature rich or cut down, fewer paged, inventories and shops.

					Options:
					> **True**: Most embeds only show neccessary inforamtion.
					> **Flase**: Embeds show all relevant information.
					`,
		type: "truefalse",
	},
	friendrequests: {
		name: "Friend Requests",
		short: "Choose who can add you as a friend.",
		description: `There are 3 levels of privacy to choose from: Anyone, Guild, Off.

					Options:
					> **Anyone**: Everyone can send you a friend request
					> **Guild**: Only user's that hava a mutual server with you
					> **Off**: No one will be allowed to send you friend request (you still can)
					`,
		type: "friendrequests",
	},
};