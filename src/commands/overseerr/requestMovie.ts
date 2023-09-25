import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { mediaSelectList } from '../../outbound/mediaSelects/mediaSelectList';

export const data = new SlashCommandBuilder()
    .setName('request_movie')
    .setDescription('Request a movie from Overseerr')
    .addStringOption((option) => option
        .setName('movie_title')
        .setDescription('Enter the movie you are requesting'));

export async function execute(interaction: any) {
    const movie = interaction.options.getString('movie_title');
    if (!movie) {
        await interaction.reply('You did not provide a Movie title');
        return;
    }
    const movieSearchResults = await overseerrApi(`/search?query=${movie}`, 'get');
    if (movieSearchResults.data.results.length === 0) {
        await interaction.reply('No results found');
    }
    const movieSearchResultsArray = movieSearchResults.data.results;
    // filter out the results that are not movies
    const movieSearchResultsArrayFiltered = movieSearchResultsArray.filter(
        (result: any) => result.mediaType === 'movie',
    );
    await mediaSelectList(interaction, movieSearchResultsArrayFiltered, 'Movie');
}
