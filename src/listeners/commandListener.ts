import { Client } from 'discord.js';
import { execute as executeOverseerrMovieRequest } from '../commands/overseerr/requestMovie';
import { execute as executeOverseerrTvRequest } from '../commands/overseerr/requestTv';
import { execute as executeOverseerrReportIssue } from '../commands/overseerr/reportIssue';
import { getDiscordUserIds } from '../helpers/getDiscordUserIds';
import { globalStore } from '../store/globalStore';

export function commandListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        // use overseerr API to get user's overseerr ID
        const users = await getDiscordUserIds();
        // look for interaction.user.id in the values of the users object
        const overseerrId = Object.keys(users).find((key: any) => users[key] === interaction.user.id);

        if (!overseerrId) {
            // if the user's discord ID is not found in the users object, return an error
            await interaction.reply({
                content: 'Your discord ID is not linked to an Overseerr account.',
                ephemeral: true,
            });
            return;
        }
        globalStore.overseerrId = overseerrId;

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
