import { MessageEditOptions, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
//
export async function updateEmbed(originalMessage: any, mediaTitle: any, interaction: any, action: any) {
    switch (action) {
        case 'decline': {
            const mediaDeclined = new ButtonBuilder()
                .setCustomId('mediaDeclined')
                .setDisabled(true)
                .setLabel(`Request declined by ${interaction.user.tag}`)
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(mediaDeclined);
            await interaction.update({
                components: [row],
            });
            break;
        }
        case 'approve': {
            const mediaApproved = new ButtonBuilder()
                .setCustomId('mediaApproved')
                .setDisabled(true)
                .setLabel(`Request approved by ${interaction.user.tag}`)
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(mediaApproved);
            await interaction.update({
                components: [row],
            });
            break;
        }
        case 'resolved': {
            const issueClosed = new ButtonBuilder()
                .setCustomId('issueClosed')
                .setDisabled(true)
                .setLabel(`Issue Closed by ${interaction.user.tag}`)
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(issueClosed);
            await interaction.update({
                components: [row],
            });
            break;
        }
        case 'comment': {
            const commentSubmitted = new ButtonBuilder()
                .setCustomId('commentSubmitted')
                .setDisabled(true)
                .setLabel(`Comment Submitted by ${interaction.user.tag}`)
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(commentSubmitted);
            await interaction.update({
                components: [row],
            });
            break;
        }
        case 'requested': {
            const requestSubmitted = new ButtonBuilder()
                .setCustomId('requestSubmitted')
                .setDisabled(true)
                .setLabel('Request Submitted')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestSubmitted);
            await interaction.update({
                components: [row],
            });
            break;
        }
        default: {
            console.error('Invalid action provided.');
        }
    }
}
