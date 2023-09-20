//TODO: Add a command handler
//TODO: Add a check to see if the user is an admin
//TODO: Explore other ways to get environment variables
//TODO: Error handling - specifically the overseerrSender.ts file and type checking
// TODO: Better TS - specifically get away from any and create interfaces
// TODO: Update the README.md file
// TODO: Set colors of embeds
// TODO: Add other embeds for different overseerr statuses - Pending, Approved, etc - different layouts? definetely different colours
//TODO: Remove buttons from other embeds
// TODO Remove logging statements
// TODO: Look at why everything appears to have Requested Status: Pending
/// TODO: Get Test Webhook from Overseerr working
// Import the necessary modules
import { Client, GatewayIntentBits } from 'discord.js';
import { handleWebhook } from './webhooks/webhook';
import { buttonListener } from './listeners/buttonListener';

import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define an async function to start the bot
async function startBot() {
    // Create a new Discord client with the specified intents
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    });

    // Get the Discord bot token from the environment variables
    const token = process.env.BOT_TOKEN;
    if (!token) {
        // If the bot token is not defined, throw an error
        throw new Error('No bot token provided.');
    }
    // Start the Discord bot by logging in with the bot token
    await client.login(token);

    // Start the webhook server
    handleWebhook(client);

    // Set up button click event listener
    buttonListener(client);
}
// Call the startBot function and handle any errors that occur
startBot().catch((error) => {
    console.error('Bot encountered an error:', error);
});

