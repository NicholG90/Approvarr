import { SlashCommandBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { mediaSelectList } from '../../outbound/mediaSelects/mediaSelectList';

export const data = new SlashCommandBuilder()
    .setName('request_tv')
    .setDescription('Request a TV series from Overseerr')
    .addStringOption((option) => option
        .setName('tv_title')
        .setDescription('Enter the TV Series you are requesting')
        .setRequired(true));

export async function execute(interaction: any) {
    const tvSeries = interaction.options.getString('tv_title');
    if (!tvSeries) {
        await interaction.reply('You did not provide a TV Series title');
        return;
    }
    const tvSearchResults = await overseerrApi(`/search?query=${tvSeries}`, 'get');
    if (tvSearchResults.data.results.length === 0) {
        await interaction.reply('No results found');
    }
    const tvSearchResultsArray = tvSearchResults.data.results;
    // filter out the results that are not tv
    const tvSearchResultsArrayFiltered = tvSearchResultsArray.filter(
        (result: any) => result.mediaType === 'tv',
    );
    await mediaSelectList(interaction, tvSearchResultsArrayFiltered, 'TV Series');
}
