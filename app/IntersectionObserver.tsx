import React, { useEffect, useRef } from 'react';

interface IntersectionObserverProps {
  targetRef: React.RefObject<HTMLElement>;
  animationClass: string;
  delay: number;
  children?: React.ReactNode;
}

const IntersectionObserverComponent: React.FC<IntersectionObserverProps> = ({
  targetRef,
  animationClass,
  delay,
  children,
}) => {
  const lastAddedClassRef = useRef<string | null>(null);

  useEffect(() => {
    console.log(animationClass);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (lastAddedClassRef.current) {
              targetRef.current?.classList.remove(lastAddedClassRef.current);
            }

            targetRef.current?.classList.add(animationClass);

            lastAddedClassRef.current = animationClass;
          }, delay);
        }
      },
      { threshold: 1 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [targetRef, animationClass, delay]);

  return <>{children}</>;
};

export default IntersectionObserverComponent;
