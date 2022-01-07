module.exports = {
    name: 'acceptRename',
    execute: async (client, interaction)=>{
        const now = new Date();
        const fields = interaction.message.embeds[0].fields;
        let oldNick;
        let newNick;
        let requester;
        let requestChannel;
        fields.forEach(({name,value})=>{
            switch (name){
                case 'Ancien Pseudo':
                    oldNick = value;
                    break;
                case 'Nouveau Pseudo':
                    newNick = value;
                    break;
                case 'Demandeur':
                    let requesterID = value.substring(2,value.length-1);
                    requester = interaction.guild.members.cache.get(requesterID);
                    break;
                case 'Channel':
                    let channelID = value.substring(2,value.length-1);
                    requestChannel = interaction.guild.channels.cache.get(channelID);
            }
        })        
        console.log(`Demande de rename de ${oldNick} en ${newNick} acceptée par ${interaction.member.displayName}`);        
        if (requester.manageable){
            requestChannel.send({embeds:[{description:`Demande de rename de ${requester} acceptée par ${interaction.user}.`}]});
            interaction.message.embeds[0].setFooter({text:`✅ Acceptée par ${interaction.member.displayName} le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}`});
            newNick === "[Réinitialisation]"    ? requester.setNickname('')
                                                : requester.setNickname(newNick);
        } else {
            interaction.message.embeds[0].setFooter({text:`⚠️ Erreur : je n'ai pas la permission de renommer cet utilisateur`});
        }
        interaction.message.edit({embeds:interaction.message.embeds,components:[]});
    },
};
