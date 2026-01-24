export interface MascotData {
    src: string;
    message: string;
}

export const MASCOTS: MascotData[] = [
    {
        src: "/e6109e32a9ac1a8f2496d7fba78e9c84.gif",
        message: "Efficiency is key. Your journey begins now."
    },
    {
        src: "/mascot_3.gif",
        message: "Precision and power. Welcome to the arena."
    },
    {
        src: "/output-onlinegiftools (2).gif",
        message: "Adaptability wins wars. Stay sharp."
    },
    {
        src: "/output-onlinegiftools.gif",
        message: "Innovation starts here. Make your mark."
    }
];

// Mascot Guide Message Types
export type MessageType = 'greeting' | 'help' | 'tip' | 'celebration' | 'warning' | 'info';

export interface MascotMessage {
    id: string;
    type: MessageType;
    text: string;
    duration?: number; // Auto-dismiss time in ms (0 = manual dismiss only)
    dismissible: boolean;
    showOnce?: boolean; // Only show first time visiting page
}

// Page-specific mascot messages
export const MASCOT_MESSAGES: Record<string, MascotMessage[]> = {
    home: [
        {
            id: 'home-welcome',
            type: 'greeting',
            text: "Welcome, challenger! Ready to test your skills in TechNegotia?",
            duration: 5000,
            dismissible: true,
            showOnce: true
        },
        {
            id: 'home-tip',
            type: 'tip',
            text: "Check out the rounds to see what challenges await you!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        }
    ],
    register: [
        {
            id: 'register-help',
            type: 'help',
            text: "Assemble your team and fill in the details to join the competition!",
            duration: 0,
            dismissible: true,
            showOnce: true
        },
        {
            id: 'register-tip',
            type: 'tip',
            text: "Choose your team name wisely - it's how you'll be known in the arena!",
            duration: 5000,
            dismissible: true,
            showOnce: true
        }
    ],
    rounds: [
        {
            id: 'rounds-info',
            type: 'info',
            text: "Three rounds of pure challenge await you! Each tests different skills.",
            duration: 5000,
            dismissible: true,
            showOnce: true
        },
        {
            id: 'rounds-tip',
            type: 'tip',
            text: "Study each round carefully and prepare your strategy!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        }
    ],
    schedule: [
        {
            id: 'schedule-info',
            type: 'info',
            text: "Mark these important dates in your calendar!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        },
        {
            id: 'schedule-warning',
            type: 'warning',
            text: "Don't be late - timing is everything in competition!",
            duration: 5000,
            dismissible: true,
            showOnce: true
        }
    ],
    prizes: [
        {
            id: 'prizes-celebration',
            type: 'celebration',
            text: "These glorious rewards await the victorious!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        },
        {
            id: 'prizes-motivation',
            type: 'info',
            text: "Glory and prizes for those who prove their worth!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        }
    ],
    about: [
        {
            id: 'about-info',
            type: 'info',
            text: "Learn about the epic TechNegotia competition!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        }
    ],
    contact: [
        {
            id: 'contact-help',
            type: 'help',
            text: "Need assistance? Send us a message and we'll help you out!",
            duration: 4000,
            dismissible: true,
            showOnce: true
        }
    ]
};

// Default help message when summoned
export const DEFAULT_HELP_MESSAGE: MascotMessage = {
    id: 'default-help',
    type: 'help',
    text: "Need help? I'm here to guide you through TechNegotia!",
    duration: 0,
    dismissible: true,
    showOnce: false
};

