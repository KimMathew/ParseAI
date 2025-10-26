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
    const staggerDelay = stepNumber * 0.15;
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;

    // Main card animation - fade in and slide up
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: containerElement,
            start: `top ${startPercentage}%`,
            end: `top ${endPercentage}%`,
            scrub: 0.6,
            markers: false,
        },
    });

    timeline
        .fromTo(
            element,
            {
                opacity: 0,
                y: 80,
                scale: 0.85,
                rotate: stepNumber > 1 ? stepNumber * 1.5 : 0,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: stepNumber > 1 ? stepNumber * 0.5 : 0,
                duration: 1,
                ease: "power3.out",
            },
            0
        )
        .to(
            element,
            {
                x: stepNumber * 6,
                duration: 0.8,
                ease: "power2.out",
            },
            0
        );

    // Animate glow intensity if provided
    if (glowElement) {
        gsap.fromTo(
            glowElement,
            {
                opacity: 0.4,
                filter: "blur(20px)",
            },
            {
                opacity: 0.9,
                filter: "blur(30px)",
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerElement,
                    start: `top ${startPercentage}%`,
                    end: `top ${endPercentage}%`,
                    scrub: 0.6,
                    markers: false,
                },
            }
        );
    }

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
