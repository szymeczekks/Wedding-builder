import { useDroppable } from '@dnd-kit/core';

export default function Droppable({children}) {
	const { isOver, setNodeRef } = useDroppable({
		id: 'droppable',
	});
	const style = {
		backgroundColor: isOver ? '#eee' : undefined,
	};

	return (
		<div ref={setNodeRef} style={{...style, transition: 'all .3s ease'}}>
			{children}
		</div>
	);
}
