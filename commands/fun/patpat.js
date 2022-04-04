const { MessageEmbed } = require("discord.js");
const cooldown = {};
const images = [
	"https://c.tenor.com/o4_qJ_1tzz8AAAAC/good-night.gif",
	"https://c.tenor.com/xrjwFDekb7EAAAAi/peach-cat-pet.gif",
	"https://c.tenor.com/5VbS6pyBYvsAAAAC/gif-fofinho-heart.gif",
	"https://c.tenor.com/2kmDRTqIIDAAAAAC/kitty-so-cute-head-pat.gif",
	"https://c.tenor.com/qRW7PesyukIAAAAC/peach-cat-goma.gif",
];

module.exports = {
	name: "patpat",
	category: "fun",
	description: "Console quelqu'un",
	utilisation: "{prefix}patpat [destinataire]",
	options: [
		{
			name: "destinataire",
			description: "la personne à consoler",
			type: 3, //type 3 = STRING
			required: true,
		},
	],
	execute: async (client, interaction) => {
		if (interaction.guild) {
			const TIMER = 300000;
			if (! cooldown[interaction.guild.id])
				cooldown[interaction.guild.id] = {};
			if (cooldown[interaction.guild.id][interaction.member.id]) {
				let end = new Date(
					cooldown[interaction.guild.id][interaction.member.id]
				);
				return interaction.reply({
					content: `Tu fais ça trop souvent, attends jusqu'à ${end.toLocaleTimeString(
						"fr-FR"
					)} pour ton prochain patpat`,
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

		const resultat = `${interaction.user} fait un patpat à ${target} <3.`;
		let messageEmbed = new MessageEmbed()
			.setDescription(resultat)
			.setImage(picked);

		//On envoit d'abbord le patpat sous forme d'un message normal pour déclencher les pings
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
