// TODO: Add a command handler
// TODO: Add a check to see if the user is an admin
// TODO: Explore other ways to get environment variables
// TODO: Error handling - specifically the overseerrSender.ts file and type checking
// TODO: Better TS - specifically get away from any and create interfaces
// TODO: Update the README.md file
// TODO Remove logging statements
// TODO: Look at why everything appears to have Requested Status: Pending
// TODO: Copy Assets over to the dist folder automatically on build + Fix TMDB Logo
// TODO: Get existing media as placeholder on select after initial select
// TODO: Add Year to Select Options

// TODO: Get Test Webhook from Overseerr working - DONE
// TODO: Add other embeds for different overseerr statuses - Pending, Approved, etc - different layouts? definetely different colours - DONE
// TODO: Set colors of embeds - DONE
// TODO: Remove buttons from other embeds - DONE
// TODO: Issue Comment Button that pops up text input modal - Done
// TODO: Handle requessts that are already cancelled but the buttons are still active - Done - Works by default thanks to overseerr

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
        throw new Error('No channel ID provided.');
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
