import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FadeUpAnimationConfig {
    element: HTMLElement;
    delay?: number;
    duration?: number;
    stagger?: number;
    offset?: string;
}

/**
 * Create a fade-up animation for elements triggered on scroll
 * Elements fade in and slide up smoothly as they come into view
 */
export function createFadeUpAnimation({
    element,
    delay = 0,
    duration = 0.8,
    stagger = 0.1,
    offset = "top 80%",
}: FadeUpAnimationConfig): () => void {
    // Find all direct child elements to animate
    const children = Array.from(element.children) as HTMLElement[];

    if (children.length === 0) {
        // Animate the element itself if no children
        gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 40,
            },
            {
                opacity: 1,
                y: 0,
                duration,
                ease: "power2.out",
                delay,
                scrollTrigger: {
                    trigger: element,
                    start: offset,
                    end: "top 60%",
                    toggleActions: "play none none none",
                    markers: false,
                },
            }
        );
    } else {
        // Animate children with stagger effect
        gsap.fromTo(
            children,
            {
                opacity: 0,
                y: 40,
            },
            {
                opacity: 1,
                y: 0,
                duration,
                ease: "power2.out",
                delay,
                stagger,
                scrollTrigger: {
                    trigger: element,
                    start: offset,
                    end: "top 60%",
                    toggleActions: "play none none none",
                    markers: false,
                },
            }
        );
    }

    // Return cleanup function
    return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.vars.trigger === element) {
                trigger.kill();
            }
        });
        gsap.killTweensOf(element);
        gsap.killTweensOf(children);
    };
}

/**
 * Batch create fade-up animations for multiple sections
 */
export function createBatchFadeUpAnimations(
    selectors: string[],
    config?: Partial<FadeUpAnimationConfig>
): (() => void)[] {
    const cleanups: (() => void)[] = [];

    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        elements.forEach((element) => {
            const cleanup = createFadeUpAnimation({
                element,
                ...config,
            });
            cleanups.push(cleanup);
        });
    });

    return cleanups;
}

/**
 * Kill all fade-up animations
 */
export function killAllFadeUpAnimations(): void {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf("*");
}
