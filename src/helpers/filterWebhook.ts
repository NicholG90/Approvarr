import { Client } from 'discord.js';
import { mediaSender } from '../outbound/notificationSenders/mediaSender';
import { testSender } from '../outbound/notificationSenders/testSender';
import { issueSender } from '../outbound/notificationSenders/issueSender';

export async function filterWebhook(client: Client, payload: any) {
    // Filter out Test Notifications
    if (payload.notification_type === 'TEST_NOTIFICATION') {
        testSender(client, payload);
    }
    // Filter out Media Update Notifications
    if (payload.notification_type.includes('MEDIA')) {
        mediaSender(client, payload);
    }
    // Filter Out Issue Notifications
    if (payload.notification_type.includes('ISSUE')) {
        issueSender(client, payload);
    }
}
