module.exports = async (client) => {
	const now = new Date();
	for (const [guildId, guild] of client.guilds.cache) {
		if (!client.guildsData.hasOwnProperty(guildId)){
			client.guildsData[guildId] = {};
		}
		let owner = await guild.members.fetch(guild.ownerId);	
		client.guildsData[guildId].guild = guild.name;
		client.guildsData[guildId].owner = {id:owner.user.id,tag:owner.user.tag};
		client.firestoreDb.collection("guilddata").doc(guildId).set(client.guildsData[guildId]);
	};	

	console.log(
		`(${
			now.toLocaleDateString("fr-FR",{ timeZone: 'Europe/Paris' })
		} ${
			now.toLocaleTimeString("fr-FR",{ timeZone: 'Europe/Paris' })
		}) Connecté en tant que ${client.user.tag} sur ${
			client.guilds.cache.size
		} serveurs`
	);
	
	client.user.setActivity("le Links Squad", { type: "LISTENING" });
};
