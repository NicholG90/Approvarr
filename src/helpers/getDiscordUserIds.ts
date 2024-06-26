import { overseerrApi } from './apis/overseerr/overseerrApi';

export async function getDiscordUserIds() {
    // Function to get the number of users
    async function numUsers(): Promise<number> {
        try {
            const response = await overseerrApi('/user', 'GET', { take: 1 });
            return response.data.pageInfo.results;
        } catch (error) {
            console.error('Exception on querying Overseerr users:', error);
            throw error;
        }
    }

    // Function to get all user IDs
    async function allUsers(): Promise<number[]> {
        try {
            const totalUsers = await numUsers();
            const response = await overseerrApi(
                `/user?take=${totalUsers}`,
                'GET',
            );
            return response.data.results.map((user: any) => user.id);
        } catch (error) {
            console.error('Exception on querying Overseerr users:', error);
            throw error;
        }
    }

    // Function to get Discord ID for a specific user
    async function discordId(ovsrId: number): Promise<string | null> {
        try {
            const response = await overseerrApi(`/user/${ovsrId}`, 'GET');
            // Check if discordId exists
            if (response.data.settings && 'discordId' in response.data.settings) {
                return response.data.settings.discordId;
            }
            return null;
        } catch (error) {
            console.error('Exception on querying Overseerr Discord ID:', error);
            throw error;
        }
    }

    // Function to get a map of Discord IDs to Overseerr IDs
    async function discordUsers(): Promise<Record<number, string | null>> {
        try {
            const ids = await allUsers();
            const userPromises = ids.map(async (id) => {
                const discordIdValue = await discordId(id);
                return { discordIdValue, id };
            });

            const usersArray = await Promise.all(userPromises);
            const users: Record<number, string | null> = {};
            usersArray.forEach(({ id, discordIdValue }) => {
                users[id] = discordIdValue; // Correctly assign discordIdValue to users[id]
            });
            return users;
        } catch (error) {
            console.error('Exception on querying Overseerr users:', error);
            throw error;
        }
    }

    try {
        const users = await discordUsers();
        return users;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it in the caller function
    }
}
