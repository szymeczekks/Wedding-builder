import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PanelLayout from './components/layout/PanelLayout';
import LayoutBuilderPage from './project/layoutBuilder';
import { useSession } from './hooks/useSession';
import { Projects } from './projects';
import { Summary } from './project/summary';
import { Guests } from './project/guests';

function App() {
	const sessionId = useSession();

	if (!sessionId) return null;

	return (
		<div className='max-w-[1920px] mx-auto p-2 text-main font-main'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/projects' element={<Projects/>}/>
					<Route path='/project' element={<Projects/>}/>
					<Route path='/project/:id' element={<PanelLayout />}>
						<Route index element={<Summary/>}/>
						<Route path='/project/:id/summary' element={<Summary/>}/>
						<Route path='/project/:id/guests' element={<Guests/>}/>
						<Route path='/project/:id/website/:id' element={<LayoutBuilderPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
export default App;
