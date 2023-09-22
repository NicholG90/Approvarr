// Import the necessary modules
import {
    Client, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalActionRowComponentBuilder,
} from 'discord.js';
import { overseerrApi } from '../helpers/overseerrApi';
import { updateEmbed } from '../outbound/updateButtons';

export function buttonListener(client: Client) {
    // Listen for button click events
    client.on('interactionCreate', async (interaction) => {
        // Check if the interaction is a button click
        if (!interaction.isButton()) return;
        // Get the custom ID of the button
        const { customId } = interaction;
        // Get the request ID from the embed
        const buttonID = interaction.message.embeds[0].fields.find(
            (field) => field.name === 'Request ID' || field.name === 'Issue ID',
        );
        // Check if the request ID field was found
        if (!buttonID) {
            console.error('Request ID or Issue ID field not found.');
            return;
        }
        // Get the media title from the embed
        const mediaTitle = interaction.message.embeds[0].title;
        // Get the request ID from the field value
        const uniqueId = buttonID.value;
        // Check if the button is the "Approve" button
        if (customId === 'approve') {
            // Send a PUT request to the Overseerr API to approve the request
            const url = `${process.env.OVERSEERR_URL}/api/v1/request/${uniqueId}/approve`;
            await overseerrApi(url, 'POST');
            // Update the embed with the new title and description
            await updateEmbed(interaction.message, mediaTitle, interaction, 'approve');
        }
        if (customId === 'decline') {
            // Send a PUT request to the Overseerr API to decline the request
            const url = `${process.env.OVERSEERR_URL}/api/v1/request/${uniqueId}/decline`;
            await overseerrApi(url, 'POST');
            // Update the embed with the new title and description
            await updateEmbed(interaction.message, mediaTitle, interaction, 'decline');
        }
        if (customId === 'closeIssue') {
            // Send a PUT request to the Overseerr API to approve the request
            const url = `${process.env.OVERSEERR_URL}/api/v1/issue/${uniqueId}/resolved`;
            await overseerrApi(url, 'POST');
            // Update the embed with the new title and description
            await updateEmbed(interaction.message, mediaTitle, interaction, 'resolved');
        }
        if (customId === 'comment') {
            // Send a PUT request to the Overseerr API to approve the request
            const modal = new ModalBuilder()
                .setCustomId('issueComment')
                .setTitle('Add Comment');

            // Add components to modal
            const commentInput = new TextInputBuilder()
                .setCustomId('commentInput')
                .setLabel('Add your comment on the issue below')
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(1000)
                .setMinLength(5)
                .setRequired(true);

            // An action row only holds one text input,
            // so you need one action row per text input.
            const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(commentInput);

            // Add inputs to the modal
            modal.addComponents(actionRow);

            // Show the modal to the user
            await interaction.showModal(modal);
        }
    });
}
