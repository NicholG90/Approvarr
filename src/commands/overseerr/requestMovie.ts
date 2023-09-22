import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('request_movie')
    .setDescription('Request a movie from overseerr')
    .addStringOption((option) => option
        .setName('movie')
        .setDescription('The movie you a requesting'));

export async function execute(interaction: any) {
    const movie = interaction.options.getString('movie') ?? 'No movie provided';
    await interaction.reply(`You requested the following movie: ${movie}`);
}
