// Import the necessary modules
import express from "express";
import { sendMessage } from '../outbound/overseerrSender';
import { Client } from "discord.js";
import * as dotenv from 'dotenv';
dotenv.config();

// Create an Express application
const app = express();
// Get the port from the environment variables
const PORT = process.env.PORT;


export function handleWebhook(client: Client) {
    // Apply the JSON middleware to parse the request body
    app.use(express.json());

    // Start an HTTP server for receiving webhooks
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
    // Define a POST route for the webhook
    app.post('/webhook', (req, res) => {
        // Verify that the request contains data
        if (!req.body) {
            return res.status(400).send('No webhook data received.');
        }
        // Send the webhook data to the sendMessage function
        sendMessage(client, req.body);
        // Send a response to the webhook source
        res.status(200).send('Webhook data processed successfully.');
    });
}