import { Client } from 'discord.js';
import { overseerrApi } from '../helpers/overseerrApi';

export function modalListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isModalSubmit()) return;

        // Get the data entered by the user
        const modalCommentInput = interaction.fields.getTextInputValue('commentInput');

        const messageToPost = {
            message: modalCommentInput,
        };

        if (!interaction.message) {
            console.error('Interaction Message not found.');
            return;
        }
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

        const url = `${process.env.OVERSEERR_URL}/api/v1/issue/${uniqueId}/comment`;
        const apiResponse = await overseerrApi(url, 'POST', 'comment', JSON.stringify(messageToPost));
        // check if the response was received successfull
        if (apiResponse.status !== 200) {
            await interaction.reply({ content: 'Your comment was not submitted successfully - Check the logs!' });
            return;
        }
        await interaction.reply({ content: 'Your comment was submitted successfully!' });
    });
}
