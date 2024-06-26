// Import the necessary modules
import {
    Client, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalActionRowComponentBuilder,
} from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi';
import { updateEmbed } from '../outbound/updateButtons';
import { getDiscordUserIds } from '../helpers/getDiscordUserIds';
import { Permission, hasPermission } from '../helpers/permissions';

export function buttonListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        const buttonID = interaction.message.embeds[0].fields.find(
            (field) => field.name === 'Request ID' || field.name === 'Issue ID' || field.name === 'Media ID',
        );
        if (!buttonID) {
            console.error('Request ID or Issue ID field not found.');
            return;
        }
        const mediaTitle = interaction.message.embeds[0].title;
        const uniqueId = buttonID.value;
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
        // If the user ID is still not found, reply with an error message
        if (!overseerrId) {
            await interaction.reply({
                content: 'Your Discord ID is not linked to an Overseerr account.',
                ephemeral: true,
            });
            return;
        }
        // check if the user is an admin
        const userPermissions = await overseerrApi(`/user/${overseerrId}/settings/permissions`, 'GET');
        const manageRequests = hasPermission(
            Permission.MANAGE_REQUESTS,
            userPermissions.data.permissions,
            { type: 'or' },
        );
        const manageIssues = hasPermission(
            Permission.MANAGE_ISSUES,
            userPermissions.data.permissions,
            { type: 'or' },
        );
        const requestMedia = hasPermission(
            Permission.REQUEST,
            userPermissions.data.permissions,
            { type: 'or' },
        );

        switch (interaction.customId) {
            case 'decline': {
                if (!manageRequests) {
                    await interaction.reply({
                        content: 'You do not have permission to decline requests.',
                        ephemeral: true,
                    });
                    return;
                }
                const url = `/request/${uniqueId}/decline`;
                const response = await overseerrApi(url, 'POST');
                if (response.status === 200) {
                    await updateEmbed(interaction.message, mediaTitle, interaction, 'decline');
                } else {
                    await interaction.reply({
                        content: 'An error occurred while declining the request. Do you have permission?',
                        ephemeral: true,
                    });
                }
                break;
            }
            case 'approve': {
                if (!manageRequests) {
                    await interaction.reply({
                        content: 'You do not have permission to approve requests.',
                        ephemeral: true,
                    });
                    return;
                }
                const url = `/request/${uniqueId}/approve`;
                const response = await overseerrApi(url, 'POST');
                if (response.status === 200) {
                    await updateEmbed(interaction.message, mediaTitle, interaction, 'approve');
                } else {
                    await interaction.reply({
                        content: 'An error occurred while approving the request.',
                        ephemeral: true,
                    });
                }
                await updateEmbed(interaction.message, mediaTitle, interaction, 'approve');
                break;
            }
            case 'closeIssue': {
                if (!manageIssues) {
                    await interaction.reply({
                        content: 'You do not have permission to close issues.',
                        ephemeral: true,
                    });
                    return;
                }
                const url = `/issue/${uniqueId}/resolved`;
                await overseerrApi(url, 'POST');
                await updateEmbed(interaction.message, mediaTitle, interaction, 'resolved');
                break;
            }
            case 'comment': {
                if (!manageIssues) {
                    await interaction.reply({
                        content: 'You do not have permission to comment on issues.',
                        ephemeral: true,
                    });
                    return;
                }
                const modal = new ModalBuilder()
                    .setCustomId('issueCommentResponse')
                    .setTitle('Add Comment');

                const commentInput = new TextInputBuilder()
                    .setCustomId('commentInput')
                    .setLabel('Add your comment on the issue below')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(1000)
                    .setMinLength(5)
                    .setRequired(true);

                const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(commentInput);
                modal.addComponents(actionRow);

                await interaction.showModal(modal);
                break;
            }
            case 'requestMedia': {
                if (!requestMedia) {
                    await interaction.reply({
                        content: 'You do not have permission to request Movies.',
                        ephemeral: true,
                    });
                    return;
                }
                const requestType = interaction.message.interaction?.commandName.split('_')[1];
                const url = `/request/`;
                const requestBody = {
                    mediaType: requestType,
                    mediaId: parseInt(uniqueId, 10),
                };
                if (requestType === 'tv') {
                // Add Season Information
                }

                await overseerrApi(url, 'POST', requestBody, parseInt(overseerrId, 10));
                // Update the embed with the new title and description
                await updateEmbed(interaction.message, mediaTitle, interaction, 'requested');
            }
                break;
            default: {
                console.error('No handler found for this button interaction');
            }
        }
    });
}
