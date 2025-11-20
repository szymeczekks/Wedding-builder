import { useLayoutStore } from "../store/useLayoutStore";
import Draggable from "../../../components/dragAndDrop/Draggable";
import Buttton from "../../../components/ui/Button";

export default function WidgetsPanel() {
	const widgets = useLayoutStore((state) => state.widgets);

	return (
		<ul className="bg-slate-50 p-2 rounded-xl flex flex-col gap-1">
			{widgets.map(widget => {
				return (
					<Draggable id={widget._id} data={{ type: 'toolbox', widgetType: widget.type }} key={widget._id}>
						<div className="px-2 py-1 bg-rose-50 rounded-md text-rose-700 text-sm hover:bg-rose-100 transition duration-300 ease-in-out">
							<p>
								{widget.name}
							</p>
						</div>
					</Draggable>
				)
			})}
			<hr className="mt-auto mb-2 text-rose-700"/>
			<li>
				<Buttton onClick={() => {console.log('click')}}>
					Ustawienia widgetów
				</Buttton>
			</li>
		</ul>
	)
	
}
