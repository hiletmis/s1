const fetch = require('node-fetch');
const dotenv = require('dotenv');

module.exports = {
    sendMessage
};

/**
 * Send a push notification to a user's device using OneSignal.
 * @param {string} playerId The user's OneSignal player ID.
 * @param {string} message The message to send.
 * @returns {Promise<void>}
 * @see https://documentation.onesignal.com/reference/create-notification
 * @see https://documentation.onesignal.com/docs/players-view-device#section-example-code-create-a-notification
 * @see https://documentation.onesignal.com/docs/using-the-api
 * @see https://documentation.onesignal.com/docs/onesignal-api
 * @see https://documentation.onesignal.com/docs/onesignal-api-send-notifications
 * 
 **/

const sendMessage = async(playerId, message) => {
    const appId = process.env.ONESIGNAL_APP_ID;
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

    const notification = {
        app_id: appId,
        include_player_ids: [playerId],
        contents: { en: message },
    };

    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${restApiKey}`,
            },
            body: JSON.stringify(notification),
        });
        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};