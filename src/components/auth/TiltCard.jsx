import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Wraps its children in a card that tilts in 3D toward the cursor and
 * shows a soft spotlight glow that follows the mouse across the border.
 * On touch devices this just never triggers (no mousemove), so the
 * card sits flat with no special handling needed.
 */
function TiltCard({ children, className = "" }) {
    const ref = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [7, -7]),
        { stiffness: 200, damping: 20 }
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-7, 7]),
        { stiffness: 200, damping: 20 }
    );

    const glowBackground = useTransform([mouseX, mouseY], ([x, y]) => {
        const gx = (x + 0.5) * 100;
        const gy = (y + 0.5) * 100;
        return `radial-gradient(360px circle at ${gx}% ${gy}%, rgba(129,140,248,0.35), transparent 70%)`;
    });

    const handleMouseMove = (event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            className={`relative ${className}`}
        >
            {/* Mouse-tracked border glow */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
                style={{
                    opacity: isHovering ? 1 : 0,
                    background: glowBackground,
                }}
            />

            {children}
        </motion.div>
    );
}

export default TiltCard;