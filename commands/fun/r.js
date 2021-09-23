const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'r',
    category: 'fun',
    description: 'Lance des dés',
    utilisation: '{prefix}r [nombre de dés]d[nombre de faces]',
    options:[
        {
            name:'dés',
            description:'Le nombre de dés et le nombre de faces au format jeu de rôle : [dés]d[faces]',
            type:3,//type 3 = STRING
            required:true,
        },
    ],
    execute: async (client, interaction)=>{
        const rpgDices = interaction.options.getString('dés').split('d');
        const dices = rpgDices[0] ?? -1;
        const sides = rpgDices[1] ?? -1;
        if(isNaN(dices) || isNaN(sides) || dices<1 || sides<1){
            return await interaction.reply({ 
                content: `L'envoi de dés soit se faire au format jeu de rôles : [nombre de dés]d[nombre de faces]
                          \nexample: \`/r 3d6\` pour lancer trois dés à six faces.`, 
                ephemeral: true ,
            });
        }

        if(dices>10000){
            return await interaction.reply({ 
                content: `Impossible de lancer plus de 10 000 dés à la fois.`, 
                ephemeral: true ,
            });
        }

        const rolls = [];
        let total=0;
        for(let throws=0; throws<dices;throws++){
            let result = Math.ceil(Math.random()*sides);
            total+=result;
            rolls.push(result);
        }

        let detail = `[${rolls.join('] [')}]`;
        total = `Total : ${total}`;
        if(dices<=5){
            description = detail;
            footer = total;
        } else if (detail.length>1951){
            description = total;
            footer='';            
        } else{
            description = total;
            footer = detail;
        }

        let response = new MessageEmbed()
            .setTitle(`${interaction.member.displayName} lance ${dices} dé${dices>1?'s':''} à ${sides} faces`)
            .setDescription(description)
            .setFooter(footer);
        
        interaction.reply({embeds:[response]});
    },
};