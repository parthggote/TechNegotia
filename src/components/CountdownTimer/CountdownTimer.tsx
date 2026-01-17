"use client";

import { useState, useEffect } from "react";
import styles from "./CountdownTimer.module.css";

interface CountdownTimerProps {
    targetDate: Date;
    label?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer({ targetDate, label = "Event Starts In" }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const calculateTimeLeft = (): TimeLeft => {
            const difference = targetDate.getTime() - new Date().getTime();

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, "0");
    };

    if (!isClient) {
        return (
            <div className={styles.countdown}>
                <span className={styles.label}>{label}</span>
                <div className={styles.timer}>
                    <div className={styles.block}>
                        <span className={styles.number}>--</span>
                        <span className={styles.unit}>Days</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.block}>
                        <span className={styles.number}>--</span>
                        <span className={styles.unit}>Hours</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.block}>
                        <span className={styles.number}>--</span>
                        <span className={styles.unit}>Mins</span>
                    </div>
                    <span className={styles.separator}>:</span>
                    <div className={styles.block}>
                        <span className={styles.number}>--</span>
                        <span className={styles.unit}>Secs</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.countdown}>
            <span className={styles.label}>{label}</span>
            <div className={styles.timer}>
                <div className={styles.block}>
                    <span className={styles.number}>{formatNumber(timeLeft.days)}</span>
                    <span className={styles.unit}>Days</span>
                </div>
                <span className={styles.separator}>:</span>
                <div className={styles.block}>
                    <span className={styles.number}>{formatNumber(timeLeft.hours)}</span>
                    <span className={styles.unit}>Hours</span>
                </div>
                <span className={styles.separator}>:</span>
                <div className={styles.block}>
                    <span className={styles.number}>{formatNumber(timeLeft.minutes)}</span>
                    <span className={styles.unit}>Mins</span>
                </div>
                <span className={styles.separator}>:</span>
                <div className={styles.block}>
                    <span className={styles.number}>{formatNumber(timeLeft.seconds)}</span>
                    <span className={styles.unit}>Secs</span>
                </div>
            </div>
        </div>
    );
}
