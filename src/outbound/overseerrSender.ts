// Import the necessary modules
import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';

export function sendMessage(client: Client, payload: any) {
    // Create the "Approve" button
    const approve = new ButtonBuilder()
        .setCustomId('approve')
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success);
    // Create the "Decline" button
    const decline = new ButtonBuilder()
        .setCustomId('decline')
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger);
    // Create the action row with the buttons
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(approve, decline);

    // Create an embed using the payload data
    const embed = {
        title: payload.subject,
        url: `${process.env.OVERSEERR_URL}/requests`,
        description: payload.event,
        fields: [
            {
                name: 'Description',
                value: payload.message,
            },
            {
                name: 'Request ID',
                value: payload.request.request_id,
                inline: true,
            },
            {
                name: 'Requested By',
                value: payload.request.requestedBy_username,
                inline: true,
            },
            {
                name: 'Requested Status',
                value: payload.media.status,
                inline: true,
            },
        ],
        thumbnail: {
            url: payload.image,
        },
    };
    // Set the channel ID from the environment variables
    const channelId = process.env.CHANNEL_ID;
    // Check if the channel ID is defined
    if (!channelId) {
        console.error('Channel ID is undefined in the environment variables.');
        return
    }
    // Get the channel from the client cache
    const channel = client.channels.cache.get(channelId) as TextChannel;
    // Send the message to the channel
    if (channel) {
        channel.send({
            embeds: [embed],
            components: [row],
        });
    }
}
