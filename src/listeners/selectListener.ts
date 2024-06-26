import { Client } from 'discord.js';
import { issueTypeSubmitHandler } from '../handlers/selectHandlers/issueTypeSubmitHandler';
import { issueReportSubmitHandler } from '../handlers/selectHandlers/issueReportSubmitHandler';
import { mediaRequestSubmitHandler } from '../handlers/selectHandlers/mediaRequestSubmitHandler';
import { mediaEmbedBuilder } from '../helpers/mediaEmbedBuilder';
import { tvSeasonSelectHandler } from '../handlers/selectHandlers/tvSeasonSelectHandler';

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
                const mediaType = interaction.values[0].split('-')[1].trim();
                if (mediaType === 'tv') {
                    tvSeasonSelectHandler(interaction, mediaEmbed);
                }
                await mediaRequestSubmitHandler(interaction, mediaEmbed);
                break;
            }
            default: {
                console.error('No handler found for this select interaction');
            }
        }
    });
}
