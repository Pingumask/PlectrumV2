module.exports = {
    name: 'rejectRename',
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
        console.log(`Demande de rename de ${oldNick} en ${newNick} refusée par ${interaction.member.displayName}`);
        requestChannel.send({embeds:[{description:`🚫 Demande de rename de ${requester} refusée par l'équipe de modération.`}]});
        interaction.message.embeds[0].setFooter({text:`🚫 Rejeté par ${interaction.member.displayName} le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}`});
        interaction.message.edit({embeds:interaction.message.embeds,components:[]});
    },
};
