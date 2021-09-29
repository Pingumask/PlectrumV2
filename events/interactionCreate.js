module.exports = async (client, interaction) => {
    const now = new Date();
    const command = interaction.commandName;
    let args = '';    
    interaction.options._hoistedOptions.forEach(option => {
        args += option.value;
    });
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    console.log(`(${now.toLocaleDateString()} ${now.toLocaleTimeString()}) ${interaction?.guild?.name}, #${interaction?.channel?.name ?? interaction?.channel?.thread?.name}, @${interaction?.member?.displayName} : /${command} ${args}` );   
    let toolong = interaction.options._hoistedOptions.find(opt=>opt.value.length>1500);       
    if (toolong) return await interaction.reply({ content: `La valeur envoyée pour ${toolong.name} est trop longue pour être interprétée`, ephemeral: true })
    if (cmd) return cmd.execute(client, interaction);
    return interaction.reply("NOPE !");
};