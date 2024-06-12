import { Interaction, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';

export async function issueReportSubmitHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('issueReportType')
        .setPlaceholder('What is the issue with the media?')
        .addOptions(...issueReasons);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
    await interaction.update({
        embeds: [mediaEmbed],
        components: [interaction.message.components[0], row],
    });
}
