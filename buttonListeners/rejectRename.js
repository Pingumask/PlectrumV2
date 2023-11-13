module.exports = {
	name: "rejectRename",
	execute: async (client, interaction) => {
		const now = new Date();
		const fields = interaction.message.embeds[0].fields;
		let oldNick;
		let newNick;
		let requester;
		let requestChannel;
		await fields.forEach(async ({ name, value }) => {
			switch (name) {
				case "Ancien Pseudo":
					oldNick = value;
					break;
				case "Nouveau Pseudo":
					newNick = value;
					break;
				case "Demandeur":
					let requesterID = value.substring(2, value.length - 1);
					requester = await interaction.guild.members.fetch(
						requesterID
					);
					break;
				case "Channel":
					let channelID = value.substring(2, value.length - 1);
					requestChannel = await interaction.guild.channels.fetch(
						channelID
					);
			}
		});
		console.log(
			`(${now.toLocaleDateString("fr-FR", {
				timeZone: "Europe/Paris",
			})} ${now.toLocaleTimeString("fr-FR", {
				timeZone: "Europe/Paris",
			})}) [Rename] ${oldNick} 🚫 ${newNick} ✅ refusé par ${
				interaction.member.displayName
			}`
		);
		requestChannel.send({
			embeds: [
				{
					description: `🚫 Demande de rename de ${requester} refusée par l'équipe de modération.`,
				},
			],
		});
		interaction.message.embeds[0].setFooter({
			text: `🚫 Rejeté par ${
				interaction.member.displayName
			} le ${now.toLocaleDateString("fr-FR", {
				timeZone: "Europe/Paris",
			})} à ${now.toLocaleTimeString("fr-FR", {
				timeZone: "Europe/Paris",
			})}`,
		});
		interaction.message.edit({
			embeds: interaction.message.embeds,
			components: [],
		});
	},
};
