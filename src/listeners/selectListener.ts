import {
    Client,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    StringSelectMenuComponent,
    ActionRow,
} from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi';

export function selectListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        // Use destructuring to simplify the code
        const [mediaId] = interaction.values;
        const mediaType = interaction.message?.interaction?.commandName;

        // Use switch instead of if-else statements
        let mediaInfo;
        switch (mediaType) {
            case 'request_tv':
                mediaInfo = (await overseerrApi(`/tv/${mediaId}`, 'get')).data;
                break;
            case 'request_movie':
                mediaInfo = (await overseerrApi(`/movie/${mediaId}`, 'get')).data;
                mediaInfo.name = mediaInfo.title;
                break;
            default:
                console.error('Invalid media type');
                return;
        }

        // Use template literals instead of string concatenation
        const posterPath = mediaInfo.posterPath ? `https://image.tmdb.org/t/p/w500${mediaInfo.posterPath}` : null;
        const tmdbLogoPath = 'https://i.imgur.com/nZTzL4i.jpeg';

        // Use optional chaining to avoid errors when accessing nested properties
        const mediaEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(mediaInfo.name ?? '')
            .setURL('https://discord.js.org/')
            .setDescription(mediaInfo.overview ?? '')
            .setThumbnail(tmdbLogoPath)
            .addFields(
                { name: 'Media ID', value: mediaInfo.id?.toString() ?? '', inline: true },
            );
        if (posterPath) {
            mediaEmbed.setImage(posterPath);
        }

        const requestButton = new ButtonBuilder()
            .setCustomId('requestMedia')
            .setLabel('Request')
            .setStyle(ButtonStyle.Primary);
        // Create the action row with the buttons
        const mediaExists = new ButtonBuilder()
            .setCustomId('mediaExists')
            .setDisabled(true)
            .setLabel('Media Exists')
            .setStyle(ButtonStyle.Danger);
        const requestExists = new ButtonBuilder()
            .setCustomId('requestExists')
            .setDisabled(true)
            .setLabel('Request Exists')
            .setStyle(ButtonStyle.Danger);

        let row;
        if (mediaInfo.mediaInfo) {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(mediaExists);
        } else if (mediaInfo.request) {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestExists);
        } else {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestButton);
        }
        await interaction.update({
            embeds: [mediaEmbed],
            components: [interaction.message.components[0], row],
        });
    });
}
