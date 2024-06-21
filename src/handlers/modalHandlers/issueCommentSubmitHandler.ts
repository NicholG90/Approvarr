import { Interaction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';

export async function issueCommentSubmitHandler(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;
    console.log(interaction);

    // const url = `/issue/${uniqueId}/resolved`;
    // await overseerrApi(url, 'POST');
}
