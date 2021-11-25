const { MessageEmbed } = require('discord.js');
const cooldown = {};

module.exports = {
    name: 'sondage',
    category: 'fun',
    description: 'Crée un sondage',
    utilisation: '{prefix}sondage question [réponses] ([emotes])',
    options:[
        {
            name:'question',
            description:'La question posée par le sondage',
            type:3,//type 3 = STRING
            required:true,            
        },
        {
            name:'réponse1',
            description:'Première option',
            type:3,//type 3 = STRING
            required:true,            
        },
        {
            name:'réponse2',
            description:'Deuxième option',
            type:3,//type 3 = STRING
            required:true,            
        },
        {
            name:'réponse3',
            description:'Troisième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'réponse4',
            description:'Quatrième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'réponse5',
            description:'Cinquième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'réponse6',
            description:'Sixième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'réponse7',
            description:'Septième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'réponse8',
            description:'Huitème option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote1',
            description:' Emote pour la Première option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote2',
            description:' Emote pour la Deuxième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote3',
            description:' Emote pour la Troisième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote4',
            description:' Emote pour la Quatrième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote5',
            description:' Emote pour la Cinquième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote6',
            description:' Emote pour la Sixième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote7',
            description:' Emote pour la Septième option',
            type:3,//type 3 = STRING
            required:false,            
        },
        {
            name:'emote8',
            description:' Emote pour la Huitème option',
            type:3,//type 3 = STRING
            required:false,            
        },
    ],
    execute: async (client, interaction)=>{
        //Gestion du cooldown
        if (interaction.guild){
            const TIMER = 300000;
            if (cooldown[interaction.guild.id]===undefined) cooldown[interaction.guild.id] ={}
            if(cooldown[interaction.guild.id][interaction.member.id]){
                let end = new Date(cooldown[interaction.guild.id][interaction.member.id]);
                return await interaction.reply({ content: `Tu fais ça trop souvent, attends jusqu'à ${end.toLocaleTimeString()} avant de lancer un nouveau sondage`, ephemeral: true });
            }
            cooldown[interaction.guild.id][interaction.member.id] = Date.now() + TIMER;
            setTimeout(()=>{
                delete cooldown[interaction.guild.id][interaction.member.id];
            }, TIMER);
        }

        //Récupération des parametres
        let question = interaction.options.getString('question');

        let options = {
            1:interaction.options.getString('réponse1'),
            2:interaction.options.getString('réponse2'),
            3:interaction.options.getString('réponse3'),
            4:interaction.options.getString('réponse4'),
            5:interaction.options.getString('réponse5'),
            6:interaction.options.getString('réponse6'),
            7:interaction.options.getString('réponse7'),
            8:interaction.options.getString('réponse8'),
        };

        let defaultEmotes = {
            1:"🇦",
            2:"🇧",
            3:"🇨",
            4:"🇩",
            5:"🇪",
            6:"🇫",
            7:"🇬",
            8:"🇭",
        }

        let emotes = {
            1:interaction.options.getString('emote1') ?? "🇦",
            2:interaction.options.getString('emote2') ?? "🇧",
            3:interaction.options.getString('emote3') ?? "🇨",
            4:interaction.options.getString('emote4') ?? "🇩",
            5:interaction.options.getString('emote5') ?? "🇪",
            6:interaction.options.getString('emote6') ?? "🇫",
            7:interaction.options.getString('emote7') ?? "🇬",
            8:interaction.options.getString('emote8') ?? "🇭",
        }

        //Sécurisation de la longueur des parametres
        if (question.length > 300) return await interaction.reply({ content: `La question est trop longue`, ephemeral: true });
        for(num=1;num<=8;num++){
            if(options[num] !== null && options[num].length>200) return await interaction.reply({ content: `La réponse ${num} est trop longue`, ephemeral: true });
        }

        //Envoi de la question
        let messageEmbed = new MessageEmbed()
            .setTitle(question)
            .setDescription("");
        await interaction.reply({embeds:[messageEmbed]});
        const poll = await interaction.fetchReply();

        //Ajout des réponses et réactions
        for(num=1;num<=8;num++){
            if(options[num] !== null){
                try{
                    await poll.react(emotes[num]);
                    messageEmbed.description += `\n${emotes[num]}:${options[num]}`;
                }
                catch(error){
                    try{
                        await poll.react(`\\${emotes[num]}`);
                        messageEmbed.description += `\n${emotes[num]}:${options[num]}`;
                        }
                        catch(error){
                        console.warn(`Emote ${emotes[num]} inutilisable`);
                        await poll.react(defaultEmotes[num]);
                        messageEmbed.description += `\n${defaultEmotes[num]} ${options[num]}`;
                    }
                }                
            }
        }
        interaction.editReply({embeds:[messageEmbed]});
    }
};
