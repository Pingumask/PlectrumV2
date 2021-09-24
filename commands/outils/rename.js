const { Permissions, ReactionCollector, MessageEmbed } = require('discord.js');
const fs=require('fs');
const renamechannels = require('../../save/renamechannels.json');

module.exports = {
    name: 'rename',
    category: 'outils',
    description: 'Effectue une demande de changement de pseudo auprès de la modération',
    utilisation: '{prefix}rename [nouveau pseudo]',
    options:[
        {
            name:'pseudo',
            description:'Le nouveau pseudo que vous souhaitez avoir',
            type:3,//type 3 = STRING
            required:false,
        },
    ],
    execute: async (client, interaction)=>{
        //Déclaration des émotes utilisées dans la comande
        const emotes={
            accept:'✅',
            refuse:'🚫',
            error:'⚠️',
            pending:'🕐',
        }

        // Gestion des erreurs si la commande n'est pas configurée sur le serveur
        if ( 
            !renamechannels[interaction.guild.id]
            || !renamechannels[interaction.guild.id].channel
            || renamechannels[interaction.guild.id].channel == 'undefined'
        ){ 
            if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return await interaction.reply({ content: `Pour activer les demandes de rename sur ce serveur, utilisez \`/configrename #channel-de-reception-des-demandes\``, ephemeral: true });
            return await interaction.reply({ content: `Les demandes de rename ne sont pas actives sur ce serveur`, ephemeral: true });
        }

        // Récupération des parametres
        const newNick = interaction.options.getString('pseudo');
        const chanIdRegex= /<#(.+)>/;
        const renameChannel =  client.channels.cache.get(renamechannels[interaction.guild.id].channel.replace(chanIdRegex, '$1'));

        //Gestion de l'erreur si le channel est mal configuré sur le serveur (absent ou non visible par le bot)
        if (!renameChannel) return await interaction.reply({ content: `Erreur dans la configuration du channel de reception des demandes de rename`, ephemeral: true });

        // Vérification des droits du bot
        if (!interaction.member.manageable) return await interaction.reply({ content: `Je ne dispose pas des droits suffisants pour vous renommer, si celà ne semble pas normal, contactez un administrateur pour vérifier vos permissions et les miennes`, ephemeral: true });

        // Vérification que la longueur du pseudo est valide
        if (newNick && newNick.length>32) return await interaction.reply({ content: `Un pseudo Discord ne peut être plus long que 32 caractères`, ephemeral: true });

        // Vérification que le nouveau pseudo est différent de l'ancien
        if (interaction.member.nickname === newNick) return await interaction.reply({ content: `Mais, c'est le même pseudo qu'avant ça...`, ephemeral: true });

        // Création de la réponse à l'utilisateur
        const replyEmbed = new MessageEmbed().setTitle(`Demande de changement de pseudo`).setDescription(`${emotes.pending} En attente d'approbation`);
        await interaction.reply({embeds:[replyEmbed]});
        let modMessage = new MessageEmbed().setDescription(`Demande de rename de ${interaction.member}`);

        // Création du message aux modérateurs
        if(newNick) modMessage.setTitle(`${interaction.member.displayName} :arrow_forward: ${newNick}`);
        else modMessage.setTitle(`${interaction.member.displayName} demande la réinitialisation de son pseudo :arrow_forward: ${interaction.member.user.tag}`);
        const pendingRename = await renameChannel.send({embeds:[modMessage]});
        pendingRename.react(emotes.accept);
        pendingRename.react(emotes.refuse);   
        
        // Création du collecteur de réactions
        const reactionFilter = (reaction,user) => {
            return !user.bot && [emotes.accept,emotes.refuse].includes(reaction.emoji.name);
        };
        const reactionCollector = new ReactionCollector(pendingRename,{'filter':reactionFilter,dispose:true});

        //Gestion de la décision du modérateur
        reactionCollector.on('collect',(reaction, user)=>{       
            if (reaction.emoji.name === emotes.accept){
                if (interaction.member.manageable){ // Demande acceptée
                    modMessage.setFooter(`${emotes.accept} Accepté par ${user.username}`);
                    interaction.member.setNickname(newNick);
                    replyEmbed.setDescription(`${emotes.accept} Accceptée`);
                    interaction.editReply({embeds:[replyEmbed]});
                }else{ // Demande acceptée alors que le bot n'a pas les droits suffisants (si les droits de l'utilisateur ou du bot ont changé depuis la demande)
                    modMessage.setFooter(`${emotes.error} Accepté par ${user.username}, mais je n'ai pas les droits pour renommer cet utilisateur`);
                    replyEmbed.setDescription(`${emotes.error} Erreur`);
                    interaction.editReply({embeds:[replyEmbed]});
                }
            } else{ // Demande refusée
                modMessage.setFooter(`${emotes.refuse} Refusé par ${user.username}`);
                replyEmbed.setDescription(`${emotes.refuse} Refusée`);
                interaction.editReply({embeds:[replyEmbed]});
            }
            pendingRename.edit({embeds:[modMessage]});
            pendingRename.reactions.removeAll();
            reactionCollector.stop();
        });        
    },
};