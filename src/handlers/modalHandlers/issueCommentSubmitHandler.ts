import { Interaction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

export async function issueCommentSubmitHandler(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    console.log('Issue Comment Submit Handler');
}
