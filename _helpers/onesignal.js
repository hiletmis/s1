const axios = require('axios');
const dotenv = require('dotenv');

const sendMessage = async(playerId, message) => {
    const appId = process.env.ONESIGNAL_APP_ID;

    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

    const notification = {
        app_id: appId,
        include_player_ids: [playerId],
        contents: { en: message },
    };

    try {
        const response = await axios.post(
            'https://onesignal.com/api/v1/notifications',
            notification, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${restApiKey}`,
                },
            }
        );

        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};

// Example usage
const playerId = process.env.ONESIGNAL_PLAYER_ID;
const message = 'Hello, this is a test notification!';

sendMessage(playerId, message);