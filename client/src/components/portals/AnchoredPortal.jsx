import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function AnchoredPortal({ anchorRef, onRequestClose, children }) {
    const [anchorRects, setAnchorRects] = useState(null);
    const portalRef = useRef(null);


    useEffect(() => {
        function updatePosition() {
            if (!anchorRef.current) return;
            setAnchorRects(anchorRef.current.getBoundingClientRect());
        }

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, { passive: true });

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [anchorRef, onRequestClose]);

    useEffect(() => {
        function handlePointerDown(event) {
            const portalEl = portalRef.current;
            const anchorEl = anchorRef.current;

            if (!portalEl || !anchorEl) return;

            const target = event.target;

            const clickedInsidePortal = portalEl.contains(target);
            const clickedOnAnchor = anchorEl.contains(target);

            if (!clickedInsidePortal && !clickedOnAnchor) {
                onRequestClose();
            }
        }

        document.addEventListener('pointerdown', handlePointerDown, true);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
        };
    }, [onRequestClose, anchorRef]);

    if (!anchorRects) return null;

    return createPortal(
        <div className={`p-2 bg-white absolute -translate-x-[50%] rounded-md shadow-md shadow-(color:--color-main-transparent) border-2 border-special`} style={{
            top: anchorRects.top + window.scrollY + anchorRects.height + 5,
            left: anchorRects.left + (anchorRects.width / 2),
        }} ref={portalRef} >
            {children}
        </div>,
        document.body
    )
}