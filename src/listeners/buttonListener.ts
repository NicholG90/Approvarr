// Import the necessary modules
import { Client } from 'discord.js';
import { overseerrApi } from '../helpers/overseerrApi';
import { updateEmbed } from "../outbound/updateButtons";

export function buttonListener(client: Client) {
    // Listen for button click events
    client.on('interactionCreate', async (interaction) => {
        // Check if the interaction is a button click
        if (!interaction.isButton()) return;
        // Get the custom ID of the button
        const { customId } = interaction;
        // Get the original message that the button was clicked on
        const originalMessage = await interaction.channel?.messages.fetch(interaction.message.id);
        // Get the request ID from the embed
        const requestIdField = interaction.message.embeds[0].fields.find((field) => field.name === 'Request ID');
        // Check if the request ID field was found
        if (!requestIdField) {
            console.error('Request ID field not found.');
            return
        }
        // Get the media title from the embed
        const mediaTitle = interaction.message.embeds[0].title;
        // Get the request ID from the field value
        const requestId = requestIdField.value;
        // Check if the button is the "Approve" button
        if (customId === 'approve') {
            // Send a PUT request to the Overseerr API to approve the request
            const url = `${process.env.OVERSEERR_URL}/api/v1/request/${requestId}/approve`;
            await overseerrApi(url, 'PUT')
            // Update the embed with the new title and description
            if (originalMessage) {
                await updateEmbed(originalMessage, mediaTitle, interaction, 'approve');
            }
        } else if (customId === 'decline') {
            // Send a PUT request to the Overseerr API to decline the request
            const url = `${process.env.OVERSEERR_URL}/api/v1/request/${requestId}/decline`;
            await overseerrApi(url, 'PUT')
            // Update the embed with the new title and description
            if (originalMessage) {
                await updateEmbed(originalMessage, mediaTitle, interaction, 'decline');
            }
        }
    });
}
