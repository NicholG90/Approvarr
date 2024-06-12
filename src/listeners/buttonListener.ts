// Import the necessary modules
import {
    Client, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalActionRowComponentBuilder,
} from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi';
import { updateEmbed } from '../outbound/updateButtons';

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

        switch (interaction.customId) {
            case 'decline': {
                const url = `/request/${uniqueId}/decline`;
                await overseerrApi(url, 'POST');
                await updateEmbed(interaction.message, mediaTitle, interaction, 'decline'); break;
            }
            case 'approve': {
                const url = `/request/${uniqueId}/approve`;
                await overseerrApi(url, 'POST');
                await updateEmbed(interaction.message, mediaTitle, interaction, 'approve');
                break;
            }
            case 'closeIssue': {
                const url = `/issue/${uniqueId}/resolved`;
                await overseerrApi(url, 'POST');
                await updateEmbed(interaction.message, mediaTitle, interaction, 'resolved');
                break;
            }
            case 'comment': {
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
                const requestType = interaction.message.interaction?.commandName.split('_')[1];

                const url = `/request/`;
                const requestBody = {
                    mediaType: requestType,
                    mediaId: parseInt(uniqueId, 10),
                };
                if (requestType === 'tv') {
                // Add Season Information
                }
                // await overseerrApi(url, 'POST', requestBody);

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
