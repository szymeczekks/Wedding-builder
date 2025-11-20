import Droppable from "../../../components/dragAndDrop/Droppable";
import SortableItem from "../../../components/dragAndDrop/SortableItem";
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useLayoutStore } from "../store/useLayoutStore";
import WidgetRenderer from "./WidgetRenderer";
import { DragOverlay } from "@dnd-kit/core";
import addElementBefore from "../../../utils/addElementBefore";

export default function Canvas() {
    const widgets = useLayoutStore(state => state.widgetsLayout);
    const placeholder = useLayoutStore(state => state.placeholder);
    const overlay = useLayoutStore(state => state.overlay);
    const items = placeholder ? addElementBefore(widgets, placeholder, placeholder.position) : widgets;

    return (
        <>
            <Droppable>
                <SortableContext items={items.map(w => w.id)} strategy={rectSortingStrategy}>
                    <div className="w-100 h-100">
                        {items.map( widget => 
                            <SortableItem key={widget.id} id={widget.id} data={{type: widget.type}}>
                                <WidgetRenderer type={widget.type} />
                            </SortableItem>
                        )}
                    </div>
                </SortableContext>
            </Droppable>
            <DragOverlay>
                {overlay ? <WidgetRenderer type={overlay} /> : null}
            </DragOverlay>
        </>

    )
}