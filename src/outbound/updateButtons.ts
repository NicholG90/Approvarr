import { MessageEditOptions, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
//
export async function updateEmbed(originalMessage: any, mediaTitle: any, interaction: any, action: any) {
    switch (action) {
        case 'decline': {
            const updatedEmbed = {
                title: `Media Request Approved`,
                description: `Request for ${mediaTitle} has been approved by ${interaction.user.tag}.`,
            };
            await interaction.update({
                embeds: [updatedEmbed],
                components: [],
            });
            break;
        }
        case 'approve': {
            const updatedEmbed = {
                title: `Media Request Approved`,
                description: `Request for ${mediaTitle} has been approved by ${interaction.user.tag}.`,
            };
            await interaction.update({
                embeds: [updatedEmbed],
                components: [],
            });
            break;
        }
        case 'resolved': {
            const updatedEmbed = {
                title: `Issue Closed`,
                description: `Issue for ${mediaTitle} has been closed by ${interaction.user.tag}.`,
            };
            await interaction.update({
                embeds: [updatedEmbed],
                components: [],
            });
            break;
        }
        case 'requested': {
            const requestSubmitted = new ButtonBuilder()
                .setCustomId('requestSubmitted')
                .setDisabled(true)
                .setLabel('Request Submitted')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestSubmitted);
            await interaction.update({
                components: [interaction.message.components[1], row],
            });
            break;
        }
        default: {
            console.error('Invalid action provided.');
        }
    }
}
