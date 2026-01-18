// TechNegotia 3.0 Event Constants

export const EVENT_CONFIG = {
    name: "TechNegotia 3.0",
    tagline: "Begin Your Journey",
    description: "A multi-round hackathon-style event focusing on problem-solving, prototyping under crisis, investor pitching with credit-based funding, and final negotiations.",

    // Update these dates for the actual event
    eventDate: new Date("2026-02-21T09:00:00"),
    problemReleaseDate: new Date("2026-02-20T18:00:00"),

    venue: {
        name: "Main Campus Auditorium",
        address: "TBD",
    },

    stats: {
        totalTeams: 150,
        round2Teams: 40,
        round3Teams: 10,
        prizePool: "₹50,000+",
    }
};

export const NAV_LINKS = [
    { href: "/", label: "Home", icon: "hn hn-home" },
    { href: "/schedule", label: "Schedule", icon: "hn hn-calender" },
    { href: "/rounds", label: "Rounds", icon: "hn hn-trophy" },
    { href: "/prizes", label: "Prizes", icon: "hn hn-sparkles" },
    { href: "/contact", label: "Contact", icon: "hn hn-envelope" },
];

export const ROUNDS_DATA = [
    {
        id: 1,
        title: "Round 1: The Foundation",
        subtitle: "Prototype & Crisis Handling",
        description: "Build prototypes from pre-released problems and adapt to sudden crisis scenarios.",
        teams: "All Teams (~150)",
        duration: "Event Day",
        color: "#4ecdc4"
    },
    {
        id: 2,
        title: "Round 2: Investor Pitch",
        subtitle: "Credit-Based Funding",
        description: "Pitch to 'investor' judges to secure virtual credits. Highest funding wins.",
        teams: "Top 30-40 Teams",
        duration: "Pitching Session",
        color: "#f4a020"
    },
    {
        id: 3,
        title: "Round 3: Boardroom Verdict",
        subtitle: "Final Negotiation",
        description: "Defend valuation in a high-stakes boardroom negotiation.",
        teams: "Final 9-10 Teams",
        duration: "Final Showdown",
        color: "#ff6b9d"
    }
];

export type ScheduleItemType = "release" | "ceremony" | "round" | "crisis" | "deadline";

export const SCHEDULE_DATA: {
    time: string;
    event: string;
    description: string;
    type: ScheduleItemType;
}[] = [
        {
            time: "Day Before",
            event: "Problem Statements Released",
            description: "Problems announced via social media - start strategizing!",
            type: "release"
        },
        {
            time: "9:00 AM",
            event: "Check-in & Opening Ceremony",
            description: "Team registration and event kickoff",
            type: "ceremony"
        },
        {
            time: "10:00 AM",
            event: "Round 1 Begins",
            description: "Problem selection (FCFS) and prototype development starts",
            type: "round"
        },
        {
            time: "12:00 PM",
            event: "Crisis Scenario Announced",
            description: "Surprise twist! Adapt your solution",
            type: "crisis"
        },
        {
            time: "2:00 PM",
            event: "Round 1 Submissions",
            description: "Submit prototypes for evaluation",
            type: "deadline"
        },
        {
            time: "3:00 PM",
            event: "Round 2 - Investor Pitches",
            description: "Top 40 teams pitch for credits",
            type: "round"
        },
        {
            time: "5:00 PM",
            event: "Round 3 - Boardroom",
            description: "Final negotiations begin",
            type: "round"
        },
        {
            time: "7:00 PM",
            event: "Winners Announced",
            description: "Prize distribution and closing ceremony",
            type: "ceremony"
        }
    ];

export const FAQ_DATA = [
    {
        question: "What is the team size?",
        answer: "Teams can have 2-4 members. Solo participation is not allowed."
    },
    {
        question: "What should prototypes include?",
        answer: "Prototypes can be wireframes, mockups, or basic demos. No fully functional applications required."
    },
    {
        question: "How does the credit system work?",
        answer: "In Round 2, each judge has virtual credits to invest. Teams need minimum 5000 credits from each interested judge to advance."
    },
    {
        question: "What are the judging criteria?",
        answer: "Practicality of solution, crisis-handling ability, pitch quality, and negotiation skills."
    },
    {
        question: "Can we prepare before the event?",
        answer: "Problem statements are released 1 day before. You can strategize but actual building happens on-site."
    }
];

export const SPONSORS = [
    { name: "Sponsor 1", logo: "/sponsors/sponsor1.svg" },
    { name: "Sponsor 2", logo: "/sponsors/sponsor2.svg" },
    { name: "Sponsor 3", logo: "/sponsors/sponsor3.svg" },
];
