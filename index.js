const { Client, Intents, Collection } = require('discord.js');
require('dotenv-json-complex')();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
const fs = require('fs');

const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials:['MESSAGE','CHANNEL','REACTION'],
});
const ENV = process.env;
client.env = ENV;

async function initGuildsData(){ 
  let guildsData = {}; 
  const guildsDataCollection = collection(client.firestoreDb, 'guilddata');
  const snap = await getDocs(guildsDataCollection);
  snap.docs.forEach(async (entry) =>{
    guildsData[entry.id] = await entry.data();
  });
  return guildsData;
}

// Chargement de mes variables globales dans le client
client.commands = new Collection();
client.buttonListeners = new Collection();
client.firestoreDb = getFirestore(initializeApp(JSON.parse(ENV.FIREBASE_CONFIG)));
initGuildsData().then(data=>{
  client.guildsData = data;
});

fs.readdirSync('./commands').forEach(dirs => {
  const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

  for (const file of commands) {
      const command = require(`./commands/${dirs}/${file}`);
      console.log(`Chargement de la commande ${file}`);
      client.commands.set(command.name.toLowerCase(), command);
  }
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
  console.log(`Chargement de l'évenement ${file}`);
  const event = require(`./events/${file}`);
  client.on(file.split(".")[0], event.bind(null, client));
}

fs.readdirSync('./buttonListeners').forEach(file => {
  console.log(`Chargement du bouttonListener ${file}`);
  const buttonListener = require(`./buttonListeners/${file}`);
  client.buttonListeners.set(buttonListener.name, buttonListener);
});

client.login(ENV.DISCORD_TOKEN);
