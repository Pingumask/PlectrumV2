const { Permissions } = require("discord.js");

module.exports = {
	name: "configrename",
	category: "admin",
	channel: "guild",
	description:
		"Configure le salon dans lequel doivent apparaitre les demandes de rename",
	utilisation: "{prefix}configrename [channel]",
	options: [
		{
			name: "channel",
			description:
				"Le salon dans lequel doivent apparaitre les demandes de rename (ignorer pour désactiver les renames)",
			type: 3, //type 3 = STRING
			required: false,
		},
	],
	execute: async (client, interaction) => {
		if (
			!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
		) {
			return interaction.reply({
				content: `Cette commande est reservée aux administrateurs du serveur !`,
				ephemeral: true,
			});
		}
		let channel = (await interaction.options
			?.getString("channel")
			?.startsWith("<#"))
			? interaction.options.getString("channel")
			: "undefined"; // TODO: remplacer par un vrai test d'existance du channel
		if (channel.length > 300)
			return interaction.reply({
				content: `C'est pas un vrai id de channel ça !`,
				ephemeral: true,
			});
		channel = channel.substring(2, channel.length - 1);

		if (!client.guildsData[interaction.guild.id]) {
			client.guildsData[interaction.guild.id] = {};
		}
		client.guildsData[interaction.guild.id].renameChannel = channel;

		//Enregistrer la modif sur firebase
		client.firestoreDb
			.collection("guilddata")
			.doc(interaction.guild.id)
			.set(client.guildsData[interaction.guild.id]);

		interaction.reply({
			content: `Channel de reception des demandes de rename réglé à : ${channel}`,
			ephemeral: true,
		});
	},
};
