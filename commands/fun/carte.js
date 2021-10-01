const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'carte',
    category: 'fun',
    description: 'Tire une carte',
    utilisation: '{prefix}carte',
    execute: async (client, interaction)=>{
        const valeurs =["A","2","3","4","5","6","7","8","9","10","V","D","R"];
        const symboles =["♠","♥","♣","♦"];
        const valeur = valeurs[Math.floor(Math.random()*valeurs.length)];
        const symbole = symboles[Math.floor(Math.random()*symboles.length)];
        let message = new MessageEmbed().setTitle(`${symbole}${valeur}`);
        interaction.reply({embeds:[message]});
    },
};