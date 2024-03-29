const { MessageEmbed } = require("discord.js");
const cooldown = {};
const images = [
	"https://c.tenor.com/DxMIq9-tS5YAAAAC/milk-and-mocha-bear-couple.gif",
	"https://c.tenor.com/vVBFWMH7J9oAAAAC/hug-peachcat.gif",
	"https://c.tenor.com/wqCAHtQuTnkAAAAC/milk-and-mocha-hug.gif",
	"https://c.tenor.com/FduR7Yr84OQAAAAC/milk-and-mocha-kiss.gif",
	"https://c.tenor.com/jX1-mxefJ54AAAAC/cat-hug.gif",
];

module.exports = {
	name: "calin",
	category: "fun",
	description: "Fait un câlin aux gens",
	utilisation: "{prefix}calin [destinataire]",
	options: [
		{
			name: "destinataire",
			description: "A qui faire le câlin",
			type: 3, //type 3 = STRING
			required: true,
		},
	],
	execute: async (client, interaction) => {
		if (interaction.guild) {
			const TIMER = 300000;
			if (!cooldown[interaction.guild.id])
				cooldown[interaction.guild.id] = {};
			if (cooldown[interaction.guild.id][interaction.member.id]) {
				let end = new Date(
					cooldown[interaction.guild.id][interaction.member.id]
				);
				return interaction.reply({
					content: `Tu fais ça trop souvent, attends jusqu'à ${end.toLocaleTimeString(
						"fr-FR",
						{ timeZone: "Europe/Paris" }
					)} pour ton prochain câlin`,
					ephemeral: true,
				});
			}
			cooldown[interaction.guild.id][interaction.member.id] =
				Date.now() + TIMER;
			setTimeout(() => {
				delete cooldown[interaction.guild.id][interaction.member.id];
			}, TIMER);
		}

		const picked = images[Math.floor(Math.random() * images.length)];
		const target = interaction.options.getString("destinataire");

		if (target.length > 300)
			return interaction.reply({
				content: `Ca fait beaucoup là non ?`,
				ephemeral: true,
			});

		const resultat = `${interaction.user} fait un câlin à ${target} <3.`;
		let messageEmbed = new MessageEmbed()
			.setDescription(resultat)
			.setImage(picked);

		//On envoit d'abbord le câlin sous forme d'un message normal pour déclencher les pings
		await interaction.reply({ content: resultat });

		//Puis on le remplace par un embed avec l'image
		await interaction.editReply({ content: " ", embeds: [messageEmbed] });

		//Puis l'image est supprimée de l'embed
		messageEmbed.setImage(null);
		setTimeout(
			() =>
				interaction.editReply({ content: " ", embeds: [messageEmbed] }),
			25000
		);
	},
};
