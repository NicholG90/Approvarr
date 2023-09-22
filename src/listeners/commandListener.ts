import { Client } from 'discord.js';
import { execute as executeOverseerrMovieRequest } from '../commands/overseerr/requestMovie';
import { execute as executeOverseerrTvRequest } from '../commands/overseerr/requestTv';

export function commandListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;

        // TODO: Probably want to make this a switch case?
        if (commandName === 'request_movie') {
            executeOverseerrMovieRequest(interaction);
        }
        if (commandName === 'request_tv') {
            executeOverseerrTvRequest(interaction);
        }
        // Add more command handlers as needed
    });
}
