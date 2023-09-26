import {
    Client, EmbedBuilder, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder,
} from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi';

export function selectListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        // Get the data selected by the user
        const mediaId = interaction.values[0];
        const mediaType = interaction.message?.interaction?.commandName;
        let mediaInfo;
        if (mediaType === 'request_tv') {
            mediaInfo = await overseerrApi(`/tv/${mediaId}`, 'get');
            mediaInfo = mediaInfo.data;
        } else if (mediaType === 'request_movie') {
            mediaInfo = await overseerrApi(`/movie/${mediaId}`, 'get');
            mediaInfo = mediaInfo.data;
            mediaInfo.name = mediaInfo.title;
        }

        // Add Logic to list seasons here
        const mediaEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(mediaInfo.name)
            .setURL('https://discord.js.org/')
            .setDescription(mediaInfo.overview)
            .setThumbnail('https://i.imgur.com/nZTzL4i.jpeg')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Media ID', value: mediaInfo.id, inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setImage(`https://image.tmdb.org/t/p/w500${mediaInfo.posterPath}`);
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
        // Set the channel ID from the environment variables
        const channelId = process.env.CHANNEL_ID;
        // Check if the channel ID is defined
        if (!channelId) {
            console.error('Channel ID is undefined in the environment variables.');
            return;
        }
        // Get the channel from the client cache
        const channel = client.channels.cache.get(channelId) as TextChannel;
        channel.send({
            embeds: [mediaEmbed],
            components: [row],
        });
    });
}
