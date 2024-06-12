// Import the necessary modules
import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { EmbedColors, Notification } from '../../constants/notificationData';

export function mediaSender(client: Client, payload: any) {
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

    // Define the base color for the embed
    let color = EmbedColors.DARK_PURPLE;
    // Switch the color based on the notification type
    switch (payload.notification_type) {
        case Notification.MEDIA_PENDING:
            color = EmbedColors.ORANGE;
            break;
        case Notification.MEDIA_APPROVED:
        case Notification.MEDIA_AUTO_APPROVED:
            color = EmbedColors.PURPLE;
            break;
        case Notification.MEDIA_AVAILABLE:
            color = EmbedColors.GREEN;
            break;
        case Notification.MEDIA_DECLINED:
            color = EmbedColors.RED;
            break;
        case Notification.MEDIA_FAILED:
            color = EmbedColors.RED;
            break;
        default:
            color = EmbedColors.DARK_PURPLE;
            break;
    }
    // Create an embed using the payload data
    const embed = {
        title: payload.subject,
        url: `${process.env.OVERSEERR_URL}/requests`,
        description: payload.event,
        color,
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
                value: payload.media.status.charAt(0).toUpperCase()
                    + payload.media.status.slice(1).toLowerCase(),
                inline: true,
            },
        ],
        thumbnail: {
            url: payload.image,
        },
    };
    // Check if the payload has an extra field
    if (payload.extra.length > 0) {
        embed.fields.push({
            name: 'Requested Seasons',
            value: payload.extra[0].value,
        });
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
    // Send the message to the channel
    if (channel) {
        channel.send(payload.notification_type === 'MEDIA_PENDING'
            ? {
                embeds: [embed],
                components: [row],
            }
            : {
                embeds: [embed],
            });
    }
}
