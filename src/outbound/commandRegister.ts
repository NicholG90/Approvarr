import { SlashCommandBuilder, Client, REST, Routes } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs'; // Use 'fs/promises' for async file operations

interface Command {
    data: SlashCommandBuilder;
    toJSON(): object;
}
export async function commandRegister(client: Client, token: string, serverID: string) {
    const rest = new REST().setToken(token);
    // Read command files from a directory and import them
    const commands = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    //TODO: Fix this mess
    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    (async () => {
        try {
            console.info('Started refreshing application (/) commands.');
            if (!client.user) {
                console.error('Client user is null or undefined.');
                return;
            }
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, serverID), // Replace with your guild ID
                { body: commands },
            );

            console.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}
