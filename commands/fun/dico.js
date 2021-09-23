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
        wd.getDef(word, "fr", {exact:false}, function(definition) {
            let response;
            if (!definition.category){
                response = `Je n'ai pas trouvé la définition de ${definition.word}`;
            } else{
                response = {
                    embeds:[
                        new MessageEmbed()
                            .setTitle(`${definition.word[0].toUpperCase() + definition.word.substring(1)} : ${definition.category}`)
                            .setDescription(definition.definition)
                    ]
                };  
            }
            interaction.reply(response);
        });             
    }
};