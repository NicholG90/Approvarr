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
        await interaction.reply({
            content: 'You did not provide a title',
            ephemeral: true,
        });
        return;
    }

    const mediaSearchResults = await overseerrApi(`/search?query=${mediaIssue}`, 'get');
    const mediaSearchResultsArray = mediaSearchResults.data.results.filter(
        (result: any) => result.mediaInfo && result.mediaInfo.status >= 4,
    );
    if (mediaSearchResultsArray.length === 0) {
        await interaction.reply({
            content: 'No results found',
            ephemeral: true,
        });
        return;
    }
    await issueSelectList(interaction, mediaSearchResultsArray);
}
