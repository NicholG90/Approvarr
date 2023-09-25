// Import the necessary modules
import axios, { Method, AxiosResponse } from 'axios';

export async function overseerrApi(
    url: string,
    method: Method,
    requestBody?: any,
    apiKey: string = process.env.OVERSEERR_API_KEY || '',
): Promise<AxiosResponse> {
    const apiUrl = `${process.env.OVERSEERR_URL}/api/v1${url}`;
    // Check if the Overseerr API key is defined
    try {
        // Set the request headers
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
        };
        // Send the request to the Overseerr API
        const response: AxiosResponse = await axios({
            method,
            url: apiUrl,
            headers,
            data: requestBody,
        });
        // Return the response data
        return response;
    } catch (error) {
        console.warn(error);
        // Handle any errors here
        throw error;
    }
}
