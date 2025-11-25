import { useEffect, useRef } from "react";
import { createFadeUpAnimation, FadeUpAnimationConfig } from "@/lib/fadeUpAnimation";

/**
 * Custom hook for applying fade-up animations to elements
 * Usage: const ref = useFadeUpAnimation();
 *        <div ref={ref}>Content</div>
 */
export function useFadeUpAnimation(config?: Partial<FadeUpAnimationConfig>) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const cleanup = createFadeUpAnimation({
            element: ref.current,
            duration: 0.8,
            stagger: 0.1,
            offset: "top 80%",
            ...config,
        });

        return cleanup;
    }, [config]);

    return ref;
}
