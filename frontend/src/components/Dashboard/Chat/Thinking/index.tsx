"use client"

import {motion} from "motion/react"

function LoadingThreeDotsPulse() {
    const dotVariants = {
        pulse: {
            scale: [1, 1.5, 1],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    }

    return (
        <motion.div
            animate="pulse"
            transition={{staggerChildren: -0.2, staggerDirection: -1}}
            className="container"
        >
            <motion.div className="dot" variants={dotVariants}/>
            <motion.div className="dot" variants={dotVariants}/>
            <motion.div className="dot" variants={dotVariants}/>
            <StyleSheet/>
        </motion.div>
    )
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>
            {`
            .container {
                display: flex;
                gap: 6px;
            }

            .dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #525252;
                will-change: transform;
            }
            `}
        </style>
    )
}

export default LoadingThreeDotsPulse
