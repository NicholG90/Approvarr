// Import the necessary modules
import {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, CommandInteraction,
} from 'discord.js';
import { OverseerrSearchMediaResults } from '../../interfaces/overseerr';

export async function mediaSelectList(
    interaction: CommandInteraction,
    mediaArray: OverseerrSearchMediaResults[],
    mediaType: string,
) {
    const options = mediaArray.map((media) => {
        const label = mediaType === 'TV Series' && media.name ? media.name : media.title ?? 'Unknown Title';
        return new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(media.id.toString());
    });
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('mediaSelect')
        .setPlaceholder('What would you like to request!')
        .addOptions(...options);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
    await interaction.reply({
        content: `Please select a ${mediaType}:`,
        components: [row],
        ephemeral: true,
    });
}
