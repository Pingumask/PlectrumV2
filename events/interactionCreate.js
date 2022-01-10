module.exports = async (client, interaction) => {
    if (interaction.isButton()) return handleButton(client, interaction);
    if (interaction.isCommand()) return handleCommand(client, interaction);
};

async function handleCommand(client, interaction){
    const now = new Date();
    const command = interaction.commandName;
    let args = '';    
    interaction?.options?._hoistedOptions.forEach(option => {
        args += ` ${option.value}`;
    });
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    console.log(`(${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}) ${interaction?.guild?.name ?? 'MP'}, #${interaction?.channel?.name ?? interaction?.channel?.thread?.name ?? 'MP'}, @${interaction?.member?.displayName ?? interaction?.user?.tag ?? 'unknown user'} : /${command} ${args}` );   
    let toolong = interaction?.options?._hoistedOptions.find(opt=>opt.value.length>1500);       
    if (toolong) return interaction.reply({ content: `La valeur envoyée pour ${toolong.name} est trop longue pour être interprétée`, ephemeral: true })
    if (cmd) {
        if (cmd?.channel=='guild' && !interaction.guild) return interaction.reply(`/${cmd.name} n'est pas utilisable en dehors d'un serveur`);
        try{
            await cmd.execute(client, interaction);
        } catch(e){
            console.error(`Erreur dans l'execution de la commande ${cmd.name} : ${e}`);
        }
        return;
    }
    console.error(`Interaction interceptée mais non reconnue : ${command ?? interaction}`);
}

async function handleButton(client, interaction){
    const now = new Date();
    const btn = client.buttonListeners.get(interaction.customId);
    if (!btn) return console.log(`Reception d'un evenement button de type inconnu : ${interaction.customId}`)
    try{
        console.log(`(${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}) ${interaction?.guild?.name ?? 'MP'}, #${interaction?.channel?.name ?? interaction?.channel?.thread?.name ?? 'MP'}, @${interaction?.member?.displayName ?? interaction?.user?.tag ?? 'unknown user'} : [${btn.name}]` );  
        await btn.execute(client, interaction);
    } catch(e){
        console.error(`Erreur dans l'execution du buttonListener ${btn.name} : ${e}`);
    }
    console.error(`Interaction interceptée mais non reconnue : ${btn ?? interaction}`);
}