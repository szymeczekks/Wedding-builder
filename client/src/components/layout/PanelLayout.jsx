import { Outlet } from "react-router-dom";
import { NavLink, useParams } from "react-router";
import { useProject } from "../../project/shared/hooks/useProject";
import { NotFound } from "../../404/404";
import { Subheader } from "../ui/Subheader";
import { Header } from "../ui/Header";
import SummaryIcon from "../../assets/summary.svg?react";

const menuItems = [
	{
		type: 'categoryName',
		value: 'Ogólne'
	},
	{
		type: 'link',
		value: 'Podsumowanie',
		link: 'summary'
	},
	{
		type: 'link',
		value: 'Lista gości',
		link: 'guests'
	},
	{
		type: 'categoryName',
		value: 'Narzędzia'
	},
	{
		type: 'link',
		value: 'Strona internetowa',
		link: 'website'
	},
	
];

export default function PanelLayout() {
	let { id } = useParams();
	const { loading, error, data } = useProject(id);

	if (loading) return null;
	if (error) return <NotFound/>;

	return (
		<div className='flex gap-3'>
			<aside className=' p-2 bg-bg rounded-md border-bg-dark shadow-md shadow-(color:--color-main-transparent) transition-all h-fit sticky top-2 md:p-4'>
				<Header className="hidden md:block">{data.getProjectSummary.name}</Header>
				<ul>
					{menuItems.map(item => <li key={item.value}>
						{item.type === 'categoryName' && <Subheader className="hidden md:block">{item.value}</Subheader>}
						{item.type === 'link' && <NavLink to={item.link} className='flex gap-2 items-center group text-xs truncate mb-1 font-main-sans font-semibold p-2 rounded-md md:text-base hover:bg-main hover:text-bg w-full transition-all [.active]:bg-main [.active]:text-bg'><SummaryIcon className="fill-main w-7 h-7 group-[.active]:fill-bg group-[:hover]:fill-bg transition-all"/><span className="hidden md:block">{item.value}</span></NavLink>}
					</li>)}
				</ul>
			</aside>
			<main className='flex justify-center p-2 bg-bg rounded-md border-bg-dark shadow-md shadow-(color:--color-main-transparent) md:p-4 transition-all w-full'>
				<div className="max-w-6xl w-full">
					<Outlet/>
				</div>
			</main>
		</div>
	);
}
