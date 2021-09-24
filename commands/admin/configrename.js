const { Permissions } = require('discord.js');
const fs=require('fs');
const renamechannels = require('../../save/renamechannels.json');

module.exports = {
    name: 'configrename',
    category: 'admin',
    description: 'Configure le salon dans lequel doivent apparaitre les demandes de rename',
    utilisation: '{prefix}configrename [channel]',
    options:[
        {
            name:'channel',
            description:'Le salon dans lequel doivent apparaitre les demandes de rename (ignorer pour désactiver les renames)',
            type:3,//type 3 = STRING
            required:false,
        },
    ],
    execute: async (client, interaction)=>{
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            return await interaction.reply({ 
                content: `Cette commande est reservée aux administrateurs du serveur !`, 
                ephemeral: true ,
            });
        }
        let channel = interaction.options.getString('channel').startsWith('<#') ? interaction.options.getString('channel') : 'undefined';

        renamechannels[interaction.guild.id] = {
            'guild':interaction.guild.name,
            'channel':channel,
        }        

        fs.writeFile("./save/renamechannels.json",JSON.stringify(renamechannels,null,4), (err)=>{
            if(err) return console.error(err);
        });     

        interaction.reply(`Channel de reception des demandes de rename réglé à : ${channel}`);
    },
};