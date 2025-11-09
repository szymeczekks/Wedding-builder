import { Outlet } from "react-router-dom";

export default function PanelLayout() {
	return (
		<div className='flex'>
			<aside className='w-64 p-4 border-r'>menu</aside>
			<main className='flex-1 p-6'><Outlet/></main>
		</div>
	);
}
