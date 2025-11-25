import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animation Presets for different scroll stack effects
 */

export enum AnimationPreset {
    CLASSIC = "classic",
    ROTATESTACK = "rotateStack",
    PARALLAX = "parallax",
    FLIP = "flip",
    BOUNCE = "bounce",
}

export interface AdvancedScrollStackConfig {
    element: HTMLElement;
    containerElement: HTMLElement;
    stepNumber: number;
    totalSteps: number;
    glowElement?: HTMLElement;
    preset?: AnimationPreset;
    customEasing?: string;
    customDuration?: number;
}

/**
 * Classic fade-in and slide animation
 */
function classicAnimation(
    element: HTMLElement,
    container: HTMLElement,
    stepNumber: number
) {
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;

    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 80,
            scale: 0.85,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: container,
                start: `top ${startPercentage}%`,
                end: `top ${endPercentage}%`,
                scrub: 0.6,
            },
        }
    );
}

/**
 * Rotate and stack effect
 */
function rotateStackAnimation(
    element: HTMLElement,
    container: HTMLElement,
    stepNumber: number
) {
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;
    const rotation = stepNumber * 3 - 3;

    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 100,
            rotation: rotation,
            scale: 0.8,
        },
        {
            opacity: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out",
            scrollTrigger: {
                trigger: container,
                start: `top ${startPercentage}%`,
                end: `top ${endPercentage}%`,
                scrub: 0.6,
            },
        }
    );
}

/**
 * Parallax scrolling effect
 */
function parallaxAnimation(
    element: HTMLElement,
    container: HTMLElement,
    stepNumber: number
) {
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;

    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 150,
            scale: 0.8,
        },
        {
            opacity: 1,
            y: -stepNumber * 30,
            scale: 1,
            duration: 1.5,
            ease: "sine.out",
            scrollTrigger: {
                trigger: container,
                start: `top ${startPercentage}%`,
                end: `top ${endPercentage}%`,
                scrub: 0.8,
            },
        }
    );
}

/**
 * Flip card animation
 */
function flipAnimation(
    element: HTMLElement,
    container: HTMLElement,
    stepNumber: number
) {
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;

    gsap.fromTo(
        element,
        {
            opacity: 0,
            rotationX: 90,
            scale: 0.5,
        },
        {
            opacity: 1,
            rotationX: 0,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: container,
                start: `top ${startPercentage}%`,
                end: `top ${endPercentage}%`,
                scrub: 0.6,
            },
        }
    );
}

/**
 * Bounce effect animation
 */
function bounceAnimation(
    element: HTMLElement,
    container: HTMLElement,
    stepNumber: number
) {
    const startPercentage = 60 + stepNumber * 15;
    const endPercentage = 40 + stepNumber * 15;

    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 120,
            scale: 0.7,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: container,
                start: `top ${startPercentage}%`,
                end: `top ${endPercentage}%`,
                scrub: 0.6,
            },
        }
    );
}

/**
 * Get animation function based on preset
 */
function getAnimationFunction(
    preset: AnimationPreset
): (element: HTMLElement, container: HTMLElement, stepNumber: number) => void {
    switch (preset) {
        case AnimationPreset.ROTATESTACK:
            return rotateStackAnimation;
        case AnimationPreset.PARALLAX:
            return parallaxAnimation;
        case AnimationPreset.FLIP:
            return flipAnimation;
        case AnimationPreset.BOUNCE:
            return bounceAnimation;
        case AnimationPreset.CLASSIC:
        default:
            return classicAnimation;
    }
}

/**
 * Create advanced scroll stack animation with preset support
 */
export function createAdvancedScrollStackAnimation({
    element,
    containerElement,
    stepNumber,
    totalSteps,
    glowElement,
    preset = AnimationPreset.CLASSIC,
    customEasing = "power3.out",
    customDuration = 1,
}: AdvancedScrollStackConfig): () => void {
    const animationFn = getAnimationFunction(preset);
    animationFn(element, containerElement, stepNumber);

    // Animate glow if provided
    if (glowElement) {
        const startPercentage = 60 + stepNumber * 15;
        const endPercentage = 40 + stepNumber * 15;

        gsap.fromTo(
            glowElement,
            {
                opacity: 0.4,
                filter: "blur(20px)",
            },
            {
                opacity: 0.9,
                filter: "blur(30px)",
                duration: customDuration,
                ease: customEasing,
                scrollTrigger: {
                    trigger: containerElement,
                    start: `top ${startPercentage}%`,
                    end: `top ${endPercentage}%`,
                    scrub: 0.6,
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
