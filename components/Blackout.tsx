import { useEffect, useState } from 'react';
import styles from './Blvckout.module.css';

const Blvckout: React.FC = () => {
    const [isBlackout, setIsBlackout] = useState<boolean>(false);

    useEffect(() => {
        const handleMouseLeave = () => {
            setIsBlackout(true);
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(`.${styles.blvckout}`)) {
                setIsBlackout(false);
            }
        };

        const handleKeyup = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || e.key === '44') {
                setIsBlackout(true);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                setIsBlackout(true);
            }
        };

        const handleVolumeButton = (e: KeyboardEvent) => {
            if (e.code === 'VolumeDown' || e.code === 'VolumeUp' || e.code === 'VolumeMute') {
                setIsBlackout(true);
            }
        };

        const handleF12Key = (e: KeyboardEvent) => {
            if (e.key === 'F12') {
                setIsBlackout(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('click', handleClick);
        window.addEventListener('keyup', handleKeyup);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('keydown', handleVolumeButton);
        window.addEventListener('keydown', handleF12Key);

        document.body.oncontextmenu = () => false;

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('keyup', handleKeyup);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('keydown', handleVolumeButton);
            window.removeEventListener('keydown', handleF12Key);
        };

    }, []);

    return (
        <>
        {isBlackout && (
            <div className={isBlackout ? styles.blvckout : ''}>
            Click to continue...
        </div>
        )}
        </>
    );
};

export default Blvckout;
