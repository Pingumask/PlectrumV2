const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {Collection} = require('discord.js');
const fs = require('fs');
require('dotenv-json-complex')();
const { CLIENT_ID, BETA_GUILD_ID, DISCORD_TOKEN } = process.env;
const commands = new Collection();
const betaCommands = new Collection();
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

fs.readdirSync('./commands').forEach(dirs => {
    const commandList = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commandList) {
        const command = require(`./commands/${dirs}/${file}`);
        if (!command.beta){
            console.log(`Chargement de la commande ${command.name}`);
            commands.set(command.name.toLowerCase(), command);
        } else {
            console.log(`[BETA] Chargement de la commande ${command.name}`);
            betaCommands.set(command.name.toLowerCase(), command);
        }        
    };
});

rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
	.then(() => console.log(`${commands.size} Commandes globales répertoriées.`))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, BETA_GUILD_ID), { body: betaCommands })
	.then(() => console.log(`${betaCommands.size} Commandes BETA répertoriées.`))
	.catch(console.error);
