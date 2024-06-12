import { SlashCommandBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { issueSelectList } from '../../outbound/issueSelects/issueSelectList';

export const data = new SlashCommandBuilder()
    .setName('report_issue')
    .setDescription('Report an issue with content on Overseerr')
    .addStringOption((option) => option
        .setName('media_title')
        .setDescription('Enter the title of the media you are reporting')
        .setRequired(true));

export async function execute(interaction: any) {
    const mediaIssue = interaction.options.getString('media_title');
    if (!mediaIssue) {
        await interaction.reply('You did not provide a title');
        return;
    }
    const mediaSearchResults = await overseerrApi(`/search?query=${mediaIssue}`, 'get');
    if (mediaSearchResults.data.results.length === 0) {
        await interaction.reply('No results found');
    }
    const mediaSearchResultsArray = mediaSearchResults.data.results;
    const mediaSearchResultsArrayFiltered = mediaSearchResultsArray.filter(
        (result: any) => result.mediaInfo && result.mediaInfo.status >= 4,
    );
    await issueSelectList(interaction, mediaSearchResultsArrayFiltered);
}
