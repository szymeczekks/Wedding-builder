import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function FixedPortal({ onRequestClose, children }) {
    const portalRef = useRef(null);

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
        <div className='flex items-center justify-center absolute inset-0 bg-main-transparent'>
            <div className={`p-4 w-fit max-w-[90%] h-fit max-h-[90%] bg-white rounded-md shadow-md shadow-(color:--color-main-transparent)`} ref={portalRef} >
                {children}
            </div>
        </div>,
        document.body
    )
}