const { MessageEmbed } = require("discord.js");
module.exports = {
	name: "divination",
	category: "fun",
	description: "Donne une réponse aléatoire",
	utilisation: "{prefix}divination [question]",
	options: [
		{
			name: "question",
			description: "La question à laquelle le bot va répondre",
			type: 3, //type 3 = STRING
			required: true,
		},
	],
	execute: async (client, interaction) => {
		const phrases = [
			"Oui.",
			"Bien sûr.",
			"Tout à fait.",
			"Tutafeh.",
			"Absolument !",
			"Evidemment !",
			"Tu en doutes ?",
			"Oui, mais attention, ça pourrait changer.",
			"C'est une certitude absolue !",
			"Oui, mais ça sera pas facile !",

			"Ca se pourrait",
			"Peut être",
			"C'est pas impossible",
			"Ptêt bein qu'oui, Ptêt bein qu'non",
			"Mais j'en sais rien moi !",
			"Je t'en pose des questions ?",
			"C'est pas toi qui décide !",
			"Y a vraiment des gens qui se demandent ça ?",
			"La réponse devrait te paraitre évidente.",
			"Je refuse de répondre à ça, mais j'en pense pas moins !",
			"Peu me chaut.",
			"Je n'en ai cure.",

			"Non ||, mais t'as vu c'que t'écoutes ?||",
			"Non, mais c'est pas faute d'essayer.",
			"Mais ça va pas de dire des choses comme ça ?",
			"Non, mais ça viendra peut-être.",
			"Pas vraiment...",
			"Lol nope.",
			"Non.",
			"Absolument ||pas !||",
			"Pas du tout !",
			"Et la marmotte, elle met le chocolat dans le papier alu.",
			"Ha ha ha... Non !",
		];
		const reponse = phrases[Math.floor(Math.random() * phrases.length)];
		const question = interaction.options.getString("question");
		if (question.length > 1200)
			return interaction.reply({
				content: `J'ai pas compris la question`,
				ephemeral: true,
			});
		let message = new MessageEmbed().setDescription(
			`**Question:** ${question}\n**Réponse:** ${reponse}`
		);
		if (question) interaction.reply({ embeds: [message] });
		else interaction.reply(reponse);
	},
};
