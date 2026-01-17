import { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "featured" | "glass";
    accentColor?: string;
    hoverable?: boolean;
}

export default function Card({
    children,
    className = "",
    variant = "default",
    accentColor,
    hoverable = true
}: CardProps) {
    return (
        <div
            className={`
        ${styles.card} 
        ${styles[variant]} 
        ${hoverable ? styles.hoverable : ""} 
        ${className}
      `}
            style={accentColor ? { "--card-accent": accentColor } as React.CSSProperties : undefined}
        >
            {accentColor && <div className={styles.accentBar} />}
            {children}
        </div>
    );
}

// Card Header Component
export function CardHeader({
    title,
    subtitle,
    icon
}: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
}) {
    return (
        <div className={styles.header}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.headerText}>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
}

// Card Body Component
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`${styles.body} ${className}`}>{children}</div>;
}

// Card Footer Component
export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`${styles.footer} ${className}`}>{children}</div>;
}
