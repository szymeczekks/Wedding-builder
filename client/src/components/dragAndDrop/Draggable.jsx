import {useDraggable} from '@dnd-kit/core';

export default function Draggable({ children, id, data }) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
        data: {...data}
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <li ref={setNodeRef} style={style} {...listeners} {...attributes} className='cursor-grab'>
            {children}
        </li>
    );
}