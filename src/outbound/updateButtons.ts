// Import the necessary modules
import { MessageEditOptions } from 'discord.js';
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
    // Edit the original message
    if (originalMessage) {
        await originalMessage.edit(editOptions);
    }
}
