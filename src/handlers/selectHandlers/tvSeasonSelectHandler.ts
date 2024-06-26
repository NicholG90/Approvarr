import { Interaction, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';

export async function tvSeasonSelectHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('tvSeasonSelect')
        .setPlaceholder('What Season would you like to request?')
        .addOptions(
            { label: 'Season 1', value: '1' },
            { label: 'Season 2', value: '2' },
            { label: 'Season 3', value: '3' },
        );
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
    await interaction.update({
        embeds: [mediaEmbed],
        components: [interaction.message.components[0], row],
    });
}
