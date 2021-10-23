const { MessageEmbed } = require('discord.js');
const cooldown = {};

module.exports = {
    name: 'calin',
    category: 'fun',
    channel:'guild',
    description: 'Fait un calin aux gens',
    utilisation: '{prefix}calin [destinataire]',
    options:[
        {
            name:'destinataire',
            description:'A qui faire le calin',
            type:3,//type 3 = STRING
            required:true,
            
        },
    ],
    execute: async (client, interaction)=>{
        const TIMER = 300000;
        if (interaction.guild==undefined) return interaction.reply("Cette commande n'est utilisable que dans un serveur");
        if (cooldown[interaction.guild.id]===undefined) cooldown[interaction.guild.id] ={}
        if(cooldown[interaction.guild.id][interaction.member.id]){
            let end = new Date(cooldown[interaction.guild.id][interaction.member.id]);
            return await interaction.reply({ content: `Tu fais ça trop souvent, attends jusqu'à ${end.toLocaleTimeString()} pour ton prochain calin`, ephemeral: true });
        }
        cooldown[interaction.guild.id][interaction.member.id] = Date.now() + TIMER;
        setTimeout(()=>{
            delete cooldown[interaction.guild.id][interaction.member.id];
        }, TIMER);

        const images =[
            'https://c.tenor.com/DxMIq9-tS5YAAAAC/milk-and-mocha-bear-couple.gif',
            'https://c.tenor.com/vVBFWMH7J9oAAAAC/hug-peachcat.gif',
            'https://c.tenor.com/wqCAHtQuTnkAAAAC/milk-and-mocha-hug.gif',
            'https://c.tenor.com/FduR7Yr84OQAAAAC/milk-and-mocha-kiss.gif',
            'https://c.tenor.com/jX1-mxefJ54AAAAC/cat-hug.gif'
        ]
        const picked = images[Math.floor(Math.random() * images.length)];
        const calin = interaction.options.getString('destinataire');

        if (calin.length>300) return await interaction.reply({ content: `Ca fait beaucoup là non ?`, ephemeral: true });

        const resultat = `${interaction.member} fait un calin à ${calin} <3.`;
        let messageEmbed = new MessageEmbed()
            .setDescription(resultat)
            .setImage(picked)
    
        //On envoit d'abbord le calin sous forme d'un message normal pour déclencher les pings
        await interaction.reply({content:resultat});
        
        //Puis on le remplace par un embed avec l'image
        await interaction.editReply({content:' ',embeds:[messageEmbed]});

        //Puis l'image est supprimée de l'embed
        messageEmbed.setImage(null);
        setTimeout(()=>interaction.editReply({content:' ',embeds:[messageEmbed]}),25000);
    },
};