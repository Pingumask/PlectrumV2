module.exports = {
	name: "ping",
	category: "Infos",
	description: "Teste la latence du bot",
	utilisation: "{prefix}ping",
	options: [
		{
			name: "public",
			description: "Afficher la réponse publiquement",
			type: 5, //type 5 = BOOLEAN
			required: false,
		},
	],

	execute: async (client, interaction) => {
		let content = `Pong : **${client.ws.ping}ms** !`;
		let ephemeral = !interaction.options.getBoolean("public");
		interaction.reply({ content, ephemeral });
	},
};
