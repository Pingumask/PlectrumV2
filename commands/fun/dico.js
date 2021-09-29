const { MessageEmbed } = require('discord.js');
const wd=require("word-definition");
module.exports = {
    name: 'dico',
    category: 'fun',
    description: "Cherche la définition d'un mot sur https://fr.wiktionary.org/",
    utilisation: '{prefix}dico [mot]',
    options:[
        {
            name:'mot',
            description:'Le mot à rechercher',
            type:3,//type 3 = STRING
            required:true,
        },
    ],
    execute: async (client, interaction)=>{
        const word = interaction.options.getString('mot');   
        if (word.length>300) return await interaction.reply({ content: `C'est pas un vrai mot ça, j'ai même pas besoin d'ouvrir un dico pour le savoir !`, ephemeral: true });
        wd.getDef(word, "fr", {exact:false}, function(definition) {
            let response;
            if (!definition.category){
                response = `Je n'ai pas trouvé la définition de ${definition.word}`;
                response = new MessageEmbed()
                            .setDescription(`Je n'ai pas trouvé la définition de ${definition.word}`);  
            } else{
                response = new MessageEmbed()
                            .setTitle(`${(word.toLowerCase()!=definition.word.toLowerCase())?word+' -> ':''}${definition.word[0].toUpperCase() + definition.word.substring(1)} : ${definition.category}`)
                            .setDescription(definition.definition);  
            }
            interaction.reply({embeds:[response]});
        });             
    }
};