const { MessageEmbed } = require("discord.js");
const cooldown = {};
const TIMER = 300000;
const defaultEmotes = {
	1: "🇦",
	2: "🇧",
	3: "🇨",
	4: "🇩",
	5: "🇪",
	6: "🇫",
	7: "🇬",
	8: "🇭",
};

module.exports = {
	name: "sondage",
	category: "fun",
	description: "Crée un sondage",
	utilisation: "{prefix}sondage question [réponses] ([emotes])",
	options: [
		{
			name: "question",
			description: "La question posée par le sondage",
			type: 3, //type 3 = STRING
			required: true,
		},
		{
			name: "réponse1",
			description: "Première option",
			type: 3, //type 3 = STRING
			required: true,
		},
		{
			name: "réponse2",
			description: "Deuxième option",
			type: 3, //type 3 = STRING
			required: true,
		},
		{
			name: "réponse3",
			description: "Troisième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "réponse4",
			description: "Quatrième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "réponse5",
			description: "Cinquième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "réponse6",
			description: "Sixième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "réponse7",
			description: "Septième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "réponse8",
			description: "Huitème option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote1",
			description: " Emote pour la Première option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote2",
			description: " Emote pour la Deuxième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote3",
			description: " Emote pour la Troisième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote4",
			description: " Emote pour la Quatrième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote5",
			description: " Emote pour la Cinquième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote6",
			description: " Emote pour la Sixième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote7",
			description: " Emote pour la Septième option",
			type: 3, //type 3 = STRING
			required: false,
		},
		{
			name: "emote8",
			description: " Emote pour la Huitème option",
			type: 3, //type 3 = STRING
			required: false,
		},
	],
	execute: async (client, interaction) => {
		//Gestion du cooldown
		if (interaction.guild) {
			if (cooldown[interaction.guild.id] === undefined)
				cooldown[interaction.guild.id] = {};
			if (cooldown[interaction.guild.id][interaction.member.id]) {
				let end = new Date(
					cooldown[interaction.guild.id][interaction.member.id]
				);
				return interaction.reply({
					content: `Tu fais ça trop souvent, attends jusqu'à ${end.toLocaleTimeString(
						"fr-FR"
					)} avant de lancer un nouveau sondage`,
					ephemeral: true,
				});
			}
			cooldown[interaction.guild.id][interaction.member.id] =
				Date.now() + TIMER;
			setTimeout(() => {
				delete cooldown[interaction.guild.id][interaction.member.id];
			}, TIMER);
		}

		//Récupération des parametres
		const { question, options, emotes } = retrieveParams(
			interaction.options
		);

		//Sécurisation de la longueur des parametres
		if (question.length > 300)
			return interaction.reply({
				content: `La question est trop longue`,
				ephemeral: true,
			});
		for (let num = 1; num <= 8; num++) {
			if (options[num] !== null && options[num].length > 200)
				return interaction.reply({
					content: `La réponse ${num} est trop longue`,
					ephemeral: true,
				});
		}

		//Envoi de la question
		let initialMessage = new MessageEmbed()
			.setTitle(question)
			.setDescription("...");
		await interaction.reply({ embeds: [initialMessage] });
		const poll = await interaction.fetchReply();

		// Ajout des réactions
		const editedMessage = await addReactions(
			poll,
			question,
			options,
			emotes
		);

		// Ajout des réponses selon les réactions réellement appliquées
		interaction.editReply({ embeds: [editedMessage] });
	},
};

async function addReactions(message, question, options, emotes) {
	let editedMessage = new MessageEmbed()
		.setTitle(question)
		.setDescription("");
	for (let num = 1; num <= 8; num++) {
		if (options[num] !== null) {
			try {
				await message.react(emotes[num]);
				editedMessage.description += `\n${emotes[num]} ${options[num]}`;
			} catch (error) {
				try {
					console.log(`${emotes[num]}`);
					await message.react(`\\${emotes[num]}`);
					editedMessage.description += `\n${emotes[num]} ${options[num]}`;
				} catch (e) {
					console.warn(`Emote ${emotes[num]} inutilisable`);
					await message.react(defaultEmotes[num]);
					editedMessage.description += `\n${defaultEmotes[num]} ${options[num]}`;
				}
			}
		}
	}
	return editedMessage;
}

function retrieveParams(params) {
	let question = params.getString("question");

	let options = {
		1: params.getString("réponse1"),
		2: params.getString("réponse2"),
		3: params.getString("réponse3"),
		4: params.getString("réponse4"),
		5: params.getString("réponse5"),
		6: params.getString("réponse6"),
		7: params.getString("réponse7"),
		8: params.getString("réponse8"),
	};

	let emotes = {
		1: params.getString("emote1") ?? "🇦",
		2: params.getString("emote2") ?? "🇧",
		3: params.getString("emote3") ?? "🇨",
		4: params.getString("emote4") ?? "🇩",
		5: params.getString("emote5") ?? "🇪",
		6: params.getString("emote6") ?? "🇫",
		7: params.getString("emote7") ?? "🇬",
		8: params.getString("emote8") ?? "🇭",
	};
	return { question, options, emotes };
}
