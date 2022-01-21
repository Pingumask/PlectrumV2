const {
	Permissions,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
} = require("discord.js");

module.exports = {
	name: "rename",
	category: "outils",
	channel: "guild",
	description:
		"Effectue une demande de changement de pseudo auprès de la modération",
	utilisation: "{prefix}rename [nouveau pseudo]",
	options: [
		{
			name: "pseudo",
			description: "Le nouveau pseudo que vous souhaitez avoir",
			type: 3, //type 3 = STRING
			required: false,
		},
	],
	execute: async (client, interaction) => {
		// Gestion des erreurs si la commande n'est pas configurée sur le serveur
		if (
			!client.guildsData[interaction.guild.id] ||
			!client.guildsData[interaction.guild.id].renameChannel ||
			client.guildsData[interaction.guild.id].renameChannel == "undefined"
		) {
			if (
				interaction.member.permissions.has(
					Permissions.FLAGS.ADMINISTRATOR
				)
			)
				return interaction.reply({
					content: `Pour activer les demandes de rename sur ce serveur, utilisez \`/configrename #channel-de-reception-des-demandes\``,
					ephemeral: true,
				});
			return interaction.reply({
				content: `Les demandes de rename ne sont pas actives sur ce serveur`,
				ephemeral: true,
			});
		}

		// Récupération des parametres
		const now = new Date();
		const newNick =
			interaction.options.getString("pseudo") ?? "[Réinitialisation]";
		const renameChannel = client.channels.cache.get(
			client.guildsData[interaction.guild.id].renameChannel
		);

		//Gestion de l'erreur si le channel est mal configuré sur le serveur (absent ou non visible par le bot)
		if (!renameChannel)
			return interaction.reply({
				content: `Erreur dans la configuration du channel de reception des demandes de rename`,
				ephemeral: true,
			});

		// Vérification des droits du bot
		if (!interaction.member.manageable)
			return interaction.reply({
				content: `Je ne dispose pas des droits suffisants pour vous renommer, si celà ne semble pas normal, contactez un administrateur pour vérifier vos permissions et les miennes`,
				ephemeral: true,
			});

		// Vérification que la longueur du pseudo est valide
		if (newNick && newNick.length > 32)
			return interaction.reply({
				content: `Un pseudo Discord ne peut être plus long que 32 caractères`,
				ephemeral: true,
			});

		// Vérification que le nouveau pseudo est différent de l'ancien
		if (interaction.member.nickname === newNick)
			return interaction.reply({
				content: `Mais, c'est le même pseudo qu'avant ça...`,
				ephemeral: true,
			});

		// Création de la réponse à l'utilisateur
		const replyEmbed = newNick
			? new MessageEmbed().setDescription(
					`Votre demande de changement de pseudo a été transmise à l'équipe de modération`
			  )
			: new MessageEmbed().setDescription(
					`Votre demande de réinitialisation de pseudo a été transmise à l'équipe de modération`
			  );
		await interaction.reply({ embeds: [replyEmbed], ephemeral: true });

		// Création du message aux modérateurs
		let modMessage = new MessageEmbed()
			.setTitle(`Demande de rename`)
			.addField("Demandeur", `<@${interaction.member.id}>`)
			.addField("Ancien Pseudo", interaction.member.displayName, true)
			.addField("Nouveau Pseudo", newNick, true)
			.addField("Channel", `<#${interaction.channel.id}>`)
			.setFooter({
				text: `🕐 En attente depuis le ${now.toLocaleDateString(
					"fr-FR"
				)} à ${now.toLocaleTimeString("fr-FR")}`,
			});
		let embeds = [modMessage];

		// Création des bouttons
		const acceptButton = new MessageButton()
			.setCustomId("rejectRename")
			.setLabel("NOPE")
			.setStyle("DANGER");
		const rejectButton = new MessageButton()
			.setCustomId("acceptRename")
			.setLabel("OK")
			.setStyle("PRIMARY");
		let row = new MessageActionRow()
			.addComponents(acceptButton)
			.addComponents(rejectButton);
		let components = [row];

		// Envoi du message aux modérateurs
		return renameChannel.send({ embeds, components });
	},
};
