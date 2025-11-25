import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStackAnimationConfig {
    element: HTMLElement;
    containerElement: HTMLElement;
    stepNumber: number;
    totalSteps: number;
    glowElement?: HTMLElement;
}

/**
 * Creates a smooth scroll stack animation effect for cards
 * Cards appear and stack as user scrolls
 */
export function createScrollStackAnimation({
    element,
    containerElement,
    stepNumber,
    totalSteps,
    glowElement,
}: ScrollStackAnimationConfig): () => void {
    // Stagger timing based on step position
    const staggerDelay = stepNumber * 0.1;
    const startPercentage = 70;

    // Main card animation - fade in and slide up (plays once)
    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 60,
            scale: 0.9,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: staggerDelay,
            scrollTrigger: {
                trigger: containerElement,
                start: `top ${startPercentage}%`,
                toggleActions: "play none none none",
                markers: false,
            },
        }
    );

    // Return cleanup function
    return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
            if (
                trigger.vars.trigger === containerElement ||
                trigger.vars.trigger === element
            ) {
                trigger.kill();
            }
        });
    };
}

/**
 * Refresh all ScrollTrigger instances
 */
export function refreshScrollAnimations(): void {
    ScrollTrigger.refresh();
}

/**
 * Kill all scroll animations
 */
export function killAllScrollAnimations(): void {
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
