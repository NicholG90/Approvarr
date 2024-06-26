import { Interaction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

export async function issueTypeSubmitHandler(interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    // Adding the Issue Type to the customID so we can access it on the modal
    const issueType = interaction.values[0];

    const modal = new ModalBuilder()
        .setCustomId(`issueCommentSubmit-${issueType}`)
        .setTitle('Report Issue');

    const issueReportComment = new TextInputBuilder()
        .setCustomId('issueReportComment')
        .setLabel('Add your comment on the issue below')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(1000)
        .setMinLength(5)
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(issueReportComment);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
}
