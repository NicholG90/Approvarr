import { MessageEditOptions, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
//
export async function updateEmbed(originalMessage: any, mediaTitle: any, interaction: any, action: any) {
    // Capitalize the action
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1).toUpperCase();
    // Create the updated embed
    const updatedEmbed = {
        title: `Media Request ${capitalizedAction}D`,
        description: `Request for ${mediaTitle} has been ${action}d by ${interaction.user.tag}.`,
    };
    // Create the edit options
    const editOptions: MessageEditOptions = {
        embeds: [updatedEmbed],
        components: [],
    };
    const requestExists = new ButtonBuilder()
        .setCustomId('requestExists')
        .setDisabled(true)
        .setLabel('Request Submitted')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(requestExists);
    console.log(interaction.message.components);
    await interaction.update({
        components: [interaction.message.components[1], row],
    });
    console.log(interaction.message.components);

    // // Edit the original message
    // if (originalMessage) {
    //     const exampleEmbed = new EmbedBuilder()
    //         .setTitle('Some title')
    //         .setDescription('Description after the edit');

    //     originalMessage.edit({ embeds: [exampleEmbed] });
    // }
}
