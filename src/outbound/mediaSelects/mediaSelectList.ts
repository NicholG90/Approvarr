// Import the necessary modules
import {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, CommandInteraction,
} from 'discord.js';
import { OverseerrSearchMediaResults } from '../../interfaces/overseerr';

export async function mediaSelectList(
    interaction: CommandInteraction,
    mediaArray: OverseerrSearchMediaResults[],
) {
    const { mediaType } = mediaArray[0];

    const options = mediaArray.map((media) => {
        const label = mediaType === 'tv' && media.name
            ? `${media.title} (${media.firstAirDate?.split('-')[0]})`
            : `${media.title} (${media.releaseDate?.split('-')[0]})` ?? 'Unknown Title';
        return new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(`${media.id.toString()}-${media.mediaType.toString()}`);
    });
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('mediaSelect')
        .setPlaceholder('What would you like to request!')
        .addOptions(...options);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
    await interaction.reply({
        content: `Please select a ${mediaType === 'tv' ? 'TV Series' : 'Movie'}:`,
        components: [row],
        ephemeral: true,
    });
}
