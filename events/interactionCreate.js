module.exports = async (client, interaction) => {
	if (interaction.isButton()) return handleButton(client, interaction);
	if (interaction.isCommand()) return handleCommand(client, interaction);
};

async function handleCommand(client, interaction) {
	const now = new Date();
	const commandName = interaction.commandName;
	let args = "";
	interaction?.options?._hoistedOptions.forEach((option) => {
		args += ` ${option.value}`;
	});
	const cmd =
		client.commands.get(commandName) ||
		client.commands.find(
			(command) =>
				command.aliases && command.aliases.includes(commandName)
		);
	console.log(
		`(${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString(
			"fr-FR"
		)}) ${interaction?.guild?.name ?? "MP"}, #${
			interaction?.channel?.name ??
			interaction?.channel?.thread?.name ??
			"MP"
		}, @${
			interaction?.member?.displayName ??
			interaction?.user?.tag ??
			"unknown user"
		} : /${commandName} ${args}`
	);
	let toolong = interaction?.options?._hoistedOptions.find(
		(opt) => opt.value.length > 1500
	);
	if (toolong)
		return interaction.reply({
			content: `La valeur envoyée pour ${toolong.name} est trop longue pour être interprétée`,
			ephemeral: true,
		});
	if (cmd) {
		if (cmd?.channel == "guild" && !interaction.guild)
			return interaction.reply(
				`/${cmd.name} n'est pas utilisable en dehors d'un serveur`
			);
		try {
			await cmd.execute(client, interaction);
		} catch (e) {
			console.error(
				`Erreur dans l'execution de la commande /${cmd.name} : ${e}`
			);
		}
		return;
	}
	console.error(
		`Commande interceptée mais non reconnue : ${commandName ?? interaction}`
	);
}

async function handleButton(client, interaction) {
	const now = new Date();
	const btn = client.buttonListeners.get(interaction.customId);
	if (!btn)
		return console.log(
			`Reception d'un evenement button de type inconnu : ${interaction.customId}`
		);
	try {
		console.log(
			`(${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString(
				"fr-FR"
			)}) ${interaction?.guild?.name ?? "MP"}, #${
				interaction?.channel?.name ??
				interaction?.channel?.thread?.name ??
				"MP"
			}, @${
				interaction?.member?.displayName ??
				interaction?.user?.tag ??
				"unknown user"
			} : [${btn.name}]`
		);
		await btn.execute(client, interaction);
	} catch (e) {
		console.error(
			`Erreur dans l'execution du buttonListener ${btn.name} : ${e}`
		);
	}
	console.error(
		`Interaction bouton interceptée mais non reconnue : [${
			btn ?? interaction
		}]`
	);
}
