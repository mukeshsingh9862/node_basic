import axios from "axios";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../", ".env") });


const sendPushNotification = async (token: any, title: any, profile_pic: any, message: any) => {
    try {

        const response = await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            JSON.stringify({
                to: token,
                priority: 'high',
                notification: {
                    title: title,
                    body: `${message}`,
                    icon: profile_pic ?? process.env.USER_DUMMY_IMG
                },
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.FCM_KEY || '',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

export {
    sendPushNotification
};

