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
import { EmbedColors } from '../constants/notificationData';

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
        // Add Logic to list seasons here
        console.log(mediaInfo);
        const mediaEmbed = {
            title: mediaInfo.name,
            url: mediaType === 'request_movie' ? `${process.env.OVERSEERR_URL}/movie/${mediaInfo.id}`
                : `${process.env.OVERSEERR_URL}/tv/${mediaInfo.id}`,
            color: EmbedColors.GREEN,
            fields: [
                {
                    name: 'Description',
                    value: mediaInfo.overview,
                },
                {
                    name: 'Media ID',
                    value: mediaInfo.id,
                    inline: true,
                },
                {
                    name: mediaType === 'request_tv' ? 'First Air Date' : 'Release Date',
                    value: mediaType === 'request_tv' ? mediaInfo.firstAirDate : mediaInfo.releaseDate,
                    inline: true,
                },
            ],
            thumbnail: {
                url: `https://image.tmdb.org/t/p/w500${mediaInfo.posterPath}`,
            },
        };

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
        if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status >= 4) {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(mediaExists);
        } else if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status > 1) {
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
