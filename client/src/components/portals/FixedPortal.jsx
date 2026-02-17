import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function FixedPortal({ onRequestClose, children }) {
    const portalRef = useRef(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.body.style.paddingRight = `0px`;
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        function handlePointerDown(event) {
            const portalEl = portalRef.current;

            if (!portalEl) return;

            const target = event.target;

            const clickedInsidePortal = portalEl.contains(target);

            if (!clickedInsidePortal) {
                onRequestClose();
            }
        }

        document.addEventListener('pointerdown', handlePointerDown, true);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
        };
    }, [onRequestClose]);

    return createPortal(
        <div className='flex items-center justify-center fixed inset-0 bg-main-transparent'>
            <div className={`p-4 min-w-auto max-w-[90%] w-2xl h-fit max-h-[90%] overflow-y-auto bg-white rounded-md shadow-md shadow-(color:--color-main-transparent)`} ref={portalRef} >
                {children}
            </div>
        </div>,
        document.body
    )
}