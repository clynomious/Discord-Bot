const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const { execute } = require("../Client/ready");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({ embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription('⛔ Terjadi kesalahan saat menjalankan perintah ini.')
            ]}) && client.commands.delete(interaction.commandName);
            command.execute(interaction, client);
        }
    }
}