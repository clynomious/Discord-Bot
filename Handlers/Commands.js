const { Perms } = require('../Validation/Permission');
const { Client, CommandInteraction } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async(client) => {
    const Table = new Ascii("Command Loaded");
    CommandArray = [];
    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async(file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "♦️ MISSING","Invalid a name.")

        if(!command.description)
        return Table.addRow(command.name, "♦️ MISSING","Missing a description.")

        if(command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, "♦️ MISSING","Permission is invalid.")
        }

        client.commands.set(command.name, command);
        CommandArray.push(command);

        await Table.addRow(command.name, "🔷 SUCCESSFUL")

    });
    console.log(Table.toString());

    // Cek permission //
    client.on("ready", async() => {
        const MainGuild = client.guilds.cache.get("933098845078958140");
        MainGuild.commands.set(CommandArray).then(async(command) => {
            const Roles = (CommandName) => {
                const cmdPerms = CommandArray.find((c) => c.name === CommandName).permission;
                if(!cmdPerms) return null;

                return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
            }
            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);

                const permissions = roles.reduce((a, r) => {
                    return [...a, {id: r.id, type: "ROLE", permission: true}]
                }, []);

                return [...accumulator, {id: r.id, permissions}]
            }, []);
            
            await MainGuild.commands.permissions.set({ fullPermissions });
        });
    });
}