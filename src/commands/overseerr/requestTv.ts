import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('request_tv')
    .setDescription('Request a TV series from overseerr');

export async function execute(interaction: CommandInteraction) {
    const { commandName, options } = interaction;

    await interaction.reply('test');
}
