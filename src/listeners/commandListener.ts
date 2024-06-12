import { Client } from 'discord.js';
import { execute as executeOverseerrMovieRequest } from '../commands/overseerr/requestMovie';
import { execute as executeOverseerrTvRequest } from '../commands/overseerr/requestTv';
import { execute as executeOverseerrReportIssue } from '../commands/overseerr/reportIssue';

export function commandListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;

        switch (commandName) {
            case 'request_movie':
                executeOverseerrMovieRequest(interaction);
                break;
            case 'request_tv':
                executeOverseerrTvRequest(interaction);
                break;
            case 'report_issue':
                executeOverseerrReportIssue(interaction);
                break;
            default:
                console.error('Invalid command');
        }
    });
}
