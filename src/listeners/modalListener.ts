import { Client } from 'discord.js';
import { issueCommentResponseHandler } from '../handlers/modalHandlers/issueCommentResponseHandler';
import { issueCommentSubmitHandler } from '../handlers/modalHandlers/issueCommentSubmitHandler';

export function modalListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isModalSubmit()) return;

        switch (interaction.customId) {
            case 'issueCommentResponse':
                await issueCommentResponseHandler(interaction);
                break;
            case 'issueCommentSubmit':
                await issueCommentSubmitHandler(interaction);
                break;
            default:
                console.error('No handler found for this modal interaction');
        }
    });
}
