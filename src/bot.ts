// ! ERROR: Comment Submission not working
// TODO: Add a check to see if the user is an admin
// TODO: Handle adminstrator permsissions
// TODO: Better TS - specifically get away from any and create interfaces
// TODO: Update the README.md file
// TODO Remove logging statements
// TODO: Look at why everything appears to have Requested Status: Pending
// TODO: Copy Assets over to the dist folder automatically on build + Fix TMDB Logo
// TODO: Get existing media as placeholder on select after initial select
// TODO: Create Issue within Discord
// TODO: Handle Seasons on TV requests and issues
// TODO: Jellyseer Support
// TODO: Users requests are auto approving?

// Import the necessary modules
import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleWebhook } from './webhooks/webhook';
import { buttonListener } from './listeners/buttonListener';
import { modalListener } from './listeners/modalListener';
import { selectListener } from './listeners/selectListener';
import { commandListener } from './listeners/commandListener';
import { commandRegister } from './outbound/commandRegister';
import { errorListener } from './listeners/errorListener';

// Load environment variables from .env file
dotenv.config();

// Define an async function to start the bot
async function startBot() {
    // Create a new Discord client with the specified intents

    console.info(`Starting Discord Bot`);

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

    const channelId = process.env.CHANNEL_ID;

    if (!channelId) {
        throw new Error('No channel ID provided.');
    }

    const serverID = process.env.SERVER_ID;

    if (!serverID) {
        throw new Error('No server ID provided.');
    }
    // Start the Discord bot by logging in with the bot token
    await client.login(token);

    // Start the webhook server
    handleWebhook(client);
    commandRegister(client, token, serverID);

    // Set up event listeners
    buttonListener(client);
    modalListener(client);
    commandListener(client);
    selectListener(client);
    errorListener(client);
}
// Call the startBot function and handle any errors that occur
startBot().catch((error) => {
    console.error('Bot encountered an error:', error);
});
