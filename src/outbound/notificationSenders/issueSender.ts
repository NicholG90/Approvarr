// Import the necessary modules
import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { EmbedColors, Notification } from '../../constants/notificationData';

export function issueSender(client: Client, payload: any) {
    // Create the "Comment" button
    const comment = new ButtonBuilder()
        .setCustomId('comment')
        .setLabel('Add Comment')
        .setStyle(ButtonStyle.Primary);
    // Create the "Close Issue" button
    const closeIssue = new ButtonBuilder()
        .setCustomId('closeIssue')
        .setLabel('Close Issue')
        .setStyle(ButtonStyle.Danger);
    // Create the action row with the buttons
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(closeIssue, comment);

    // Define the base color for the embed
    let color = EmbedColors.DARK_PURPLE;
    // Switch the color based on the notification type
    switch (payload.notification_type) {
        case Notification.ISSUE_CREATED:
        case Notification.ISSUE_REOPENED:
            color = EmbedColors.RED;
            break;
        case Notification.ISSUE_COMMENT:
            color = EmbedColors.ORANGE;
            break;
        case Notification.ISSUE_RESOLVED:
            color = EmbedColors.GREEN;
            break;
        default:
            color = EmbedColors.DARK_PURPLE;
            break;
    }
    // Create an embed using the payload data
    const embed = {
        title: payload.subject,
        url: `/issues/${payload.issue.id}`,
        description: payload.event,
        color,
        fields: [
            {
                name: 'Issue Description',
                value: payload.message,
            },
            {
                name: 'Issue ID',
                value: payload.issue.issue_id,
                inline: true,
            },
            {
                name: 'Reported By',
                value: payload.issue.reportedBy_username,
                inline: true,
            },
            {
                name: 'Issue Type',
                value: payload.issue.issue_type.charAt(0).toUpperCase()
                    + payload.issue.issue_type.slice(1).toLowerCase(),
                inline: true,
            },
            {
                name: 'Issue Status',
                value: payload.issue.issue_status.charAt(0).toUpperCase()
                    + payload.issue.issue_status.slice(1).toLowerCase(),
                inline: true,
            },
        ],
        thumbnail: {
            url: payload.image,
        },
    };
    // push the comment to the embed if it exists
    if (payload.comment) {
        embed.fields.push({
            name: 'Issue Comment',
            value: payload.comment.comment_message,
            inline: true,
        });
        embed.fields.push({
            name: 'Comment By',
            value: payload.comment.commentedBy_username,
            inline: true,
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
        channel.send(payload.notification_type !== 'ISSUE_RESOLVED'
            ? {
                embeds: [embed],
                components: [row],
            }
            : {
                embeds: [embed],
            });
    }
}
