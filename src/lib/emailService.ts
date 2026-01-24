// EmailJS service for sending registration status emails
import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_APPROVED = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_APPROVED || '';
const TEMPLATE_REJECTED = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTED || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

/**
 * Initialize EmailJS (call this once in your app)
 */
export const initEmailJS = (): void => {
    if (PUBLIC_KEY) {
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS public key not found');
    }
};

/**
 * Send approval email to team leader
 */
export const sendApprovalEmail = async (
    teamName: string,
    teamLeaderEmail: string,
    teamLeaderName: string
): Promise<boolean> => {
    try {
        // Ensure EmailJS is initialized
        initEmailJS();

        const templateParams = {
            to_name: teamLeaderName,
            team_name: teamName,
            user_email: teamLeaderEmail, // This will be used in template settings
        };

        console.log('Sending approval email with params:', templateParams);
        console.log('To email:', teamLeaderEmail);

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_APPROVED,
            templateParams,
            {
                publicKey: PUBLIC_KEY,
            }
        );

        console.log('Approval email sent successfully:', response);
        return true;
    } catch (error: any) {
        console.error('Error sending approval email:', error);
        console.error('Error details:', {
            message: error.message,
            text: error.text,
            status: error.status
        });
        return false;
    }
};

/**
 * Send rejection email to team leader
 */
export const sendRejectionEmail = async (
    teamName: string,
    teamLeaderEmail: string,
    teamLeaderName: string,
    reason?: string
): Promise<boolean> => {
    try {
        // Ensure EmailJS is initialized
        initEmailJS();

        const templateParams = {
            to_name: teamLeaderName,
            team_name: teamName,
            reason: reason || 'Please contact the organizers for more information.',
            user_email: teamLeaderEmail, // This will be used in template settings
        };

        console.log('Sending rejection email with params:', templateParams);
        console.log('To email:', teamLeaderEmail);

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_REJECTED,
            templateParams,
            {
                publicKey: PUBLIC_KEY,
            }
        );

        console.log('Rejection email sent successfully:', response);
        return true;
    } catch (error: any) {
        console.error('Error sending rejection email:', error);
        console.error('Error details:', {
            message: error.message,
            text: error.text,
            status: error.status
        });
        return false;
    }
};
