import { Client } from 'discord.js';
import { issueTypeSubmitHandler } from '../handlers/selectHandlers/issueTypeSubmitHandler';
import { issueReportSubmitHandler } from '../handlers/selectHandlers/issueReportSubmitHandler';
import { mediaRequestSubmitHandler } from '../handlers/selectHandlers/mediaRequestSubmitHandler';
import { mediaEmbedBuilder } from '../helpers/mediaEmbedBuilder';

export function selectListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        switch (interaction.customId) {
            case 'issueReportType': {
                await issueTypeSubmitHandler(interaction);
                break;
            }
            case 'issueReportMedia': {
                const mediaEmbed = await mediaEmbedBuilder(interaction);
                await issueReportSubmitHandler(interaction, mediaEmbed);
                break;
            }
            case 'mediaSelect': {
                const mediaEmbed = await mediaEmbedBuilder(interaction);
                await mediaRequestSubmitHandler(interaction, mediaEmbed);
                break;
            }
            default: {
                console.error('No handler found for this select interaction');
            }
        }
    });
}
