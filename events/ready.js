module.exports = async (client) => {
	const now = new Date();
	console.log(
		`(${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString(
			"fr-FR"
		)}) Connecté en tant que ${client.user.tag} sur ${
			client.guilds.cache.size
		} serveurs`
	);
	client.user.setActivity("le Links Squad", { type: "LISTENING" });
};
