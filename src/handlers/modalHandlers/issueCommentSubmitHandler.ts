import { Interaction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';

export async function issueCommentSubmitHandler(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    // Get the data entered by the user
    const modalCommentInput = interaction.fields.getTextInputValue('issueReportComment');

    if (!interaction.message) {
        console.error('Interaction Message not found.');
        return;
    }
    // Get the media title from the embed
    const mediaTitle = interaction.message.embeds[0].fields.find(
        (field) => field.name === 'Media ID',
    );

    if (!mediaTitle) {
        console.error('Media ID field not found.');
        return;
    }
    const requestBody = {
        issueType: 1,
        message: modalCommentInput,
        mediaId: parseInt(mediaTitle.value, 10),
    };
    const url = `/issue`;
    const apiResponse = await overseerrApi(url, 'POST', requestBody);
    // check if the response was received successfull
    if (apiResponse.status !== 200) {
        await interaction.reply({
            content: 'Your comment was not submitted successfully - Check the logs!', ephemeral: true,
        });
        return;
    }
    await interaction.reply({ content: 'Your comment was submitted successfully!', ephemeral: true });
}
