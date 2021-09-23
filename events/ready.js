module.exports = async (client) => {
    console.log(`Connecté en tant que ${client.user.tag} sur ${client.guilds.cache.size} serveurs`);
    client.user.setActivity("le Links Squad", { type: "LISTENING"});
};