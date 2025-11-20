import { useLayoutStore } from './store/useLayoutStore';
import { useWidgets } from './hooks/useWidgets';
import { DndContext } from '@dnd-kit/core';

import WidgetsPanel from './components/WidgetsPanel';
import Canvas from './components/Canvas';
import { v4 as uuidv4 } from 'uuid';

import addElementBefore from '../../utils/addElementBefore';

export default function LayoutBuilderPage() {
	const { loading, error } = useWidgets();
	const widgetsLayout = useLayoutStore((state) => state.widgetsLayout);
	const setWidgetsLayout = useLayoutStore((state) => state.setWidgetsLayout);
	const placeholder = useLayoutStore((state) => state.placeholder);
	const setPlaceholder = useLayoutStore((state) => state.setPlaceholder);
	const setOverlay = useLayoutStore((state) => state.setOverlay);
	const clearPlaceholder = useLayoutStore((state) => state.clearPlaceholder);

	if (loading) return <p>Ładowanie widgetów...</p>;
	if (error) return <p>Błąd podczas ładowania widgetów.</p>;

	return (
		<DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart}>
			<div className='flex'>
				<WidgetsPanel />
				<Canvas />
			</div>
		</DndContext>
	);

	function handleDragStart({ active }) {
		if (active.data.current.type !== 'toolbox') {
			setOverlay(active.data.current.type);
		}
	}

	function handleDragOver({ active, over }) {
		if (placeholder && !over) {
			return clearPlaceholder();
		}
		if (!over) return;
		if (active.data.current.type === 'toolbox' && (!placeholder || placeholder.position !== over.id) && over.id !== "virtual") {
			clearPlaceholder();
			return setPlaceholder(active.data.current.widgetType + ' placeholder', over.id);
		}
	}

	function handleDragEnd({ over, active }) {
		setOverlay(null);
		if (!over) return;
		const activeData = active.data.current;
		let newLayout = null;
		if (activeData.type === 'toolbox') {
			const beforeId = placeholder ? placeholder.position : 'droppable';
			newLayout = addElementBefore(widgetsLayout, { type: activeData.widgetType, id: uuidv4() }, beforeId);
		}
		if (activeData.type !== 'toolbox' && over.id !== 'droppable') {
			const activeWidget = widgetsLayout.find(w => w.id === active.id);
			const beforeWidgetId = over.id;
			newLayout = addElementBefore(widgetsLayout, activeWidget, beforeWidgetId);
		}
		if (newLayout) setWidgetsLayout(newLayout);
		if (placeholder) clearPlaceholder();
	}
}
