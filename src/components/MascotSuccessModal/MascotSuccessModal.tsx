"use client";

import styles from "./MascotSuccessModal.module.css";
import React from "react";
import NextImage from "next/image";
import { MascotData } from "@/lib/mascotData";

interface MascotSuccessModalProps {
    onClose: () => void;
    mascot: MascotData;
}

export default function MascotSuccessModal({ onClose, mascot }: MascotSuccessModalProps) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>

                <div className={styles.mascotContainer}>
                    <NextImage
                        src={mascot.src}
                        alt="Allocated Mascot"
                        fill
                        className={styles.mascotGif}
                        unoptimized
                    />
                </div>

                <div className={styles.helperText}>
                    {mascot.message}
                </div>

                <h2 className={styles.title}>
                    Team Registered!
                </h2>

                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                    Your mascot has been allocated. Good luck!
                </p>
            </div>
        </div>
    );
}
