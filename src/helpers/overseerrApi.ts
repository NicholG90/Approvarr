// Import the necessary modules
import axios, { Method } from 'axios';

interface RequestBody {
    // Define the request body properties here
}

interface ResponseData {
    // Define the response data properties here
}

export async function overseerrApi(
    url: string,
    method: Method,
    apiKey: string = process.env.OVERSEERR_API_KEY || '',
    requestBody?: RequestBody,
): Promise<ResponseData> {
    // Check if the Overseerr API key is defined
    try {
        // Set the request headers
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
        };
        // Send the request to the Overseerr API
        const response = await axios({
            method,
            url,
            headers,
            data: requestBody,
        });
        console.log(response.data)
        // Return the response data
        return response.data;
    } catch (error) {
        // Handle any errors here
        throw error;
    }
}
