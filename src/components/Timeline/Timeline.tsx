import styles from "./Timeline.module.css";

interface TimelineEvent {
    time: string;
    event: string;
    description: string;
    type: "release" | "ceremony" | "round" | "crisis" | "deadline";
}

interface TimelineProps {
    events: TimelineEvent[];
}

const typeColors: Record<TimelineEvent["type"], string> = {
    release: "#9d4edd",
    ceremony: "#4ecdc4",
    round: "#f4a020",
    crisis: "#ff6b9d",
    deadline: "#f87171",
};

export default function Timeline({ events }: TimelineProps) {
    return (
        <div className={styles.timeline}>
            {events.map((event, index) => (
                <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                        <div
                            className={styles.dot}
                            style={{ background: typeColors[event.type] }}
                        />
                        {index < events.length - 1 && <div className={styles.line} />}
                    </div>

                    <div className={styles.timelineContent}>
                        <div className={styles.timeWrapper}>
                            <span className={styles.time}>{event.time}</span>
                            <span
                                className={styles.badge}
                                style={{
                                    background: `${typeColors[event.type]}20`,
                                    color: typeColors[event.type],
                                    borderColor: typeColors[event.type]
                                }}
                            >
                                {event.type}
                            </span>
                        </div>
                        <h3 className={styles.eventTitle}>{event.event}</h3>
                        <p className={styles.eventDesc}>{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
