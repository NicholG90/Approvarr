// Import the necessary modules
import axios, { Method, AxiosResponse } from 'axios';

export async function overseerrApi(
    url: string,
    method: Method,
    requestBody?: any,
    userId?: number,
): Promise<AxiosResponse> {
    const apiUrl = `${process.env.OVERSEERR_URL}/api/v1${url}`;
    const apiKey = process.env.OVERSEERR_API_KEY || '';
    // Check if the Overseerr API key is defined
    try {
        // Set the request headers
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
            'X-API-User': userId ? userId.toString() : '',
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
        console.error('Error calling Overseerr API');
        // Handle any errors here
        throw error;
    }
}
