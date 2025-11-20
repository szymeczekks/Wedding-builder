import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PanelLayout from './components/layout/PanelLayout';
import LayoutBuilderPage from './project/layoutBuilder';
import { useSession } from './hooks/useSession';
import { Projects } from './projects';

function App() {
	const sessionId = useSession();

	if (!sessionId) return null;

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/projects' element={<Projects/>}/>
				<Route path='/project' element={<PanelLayout />}>
					<Route path='/project/website/:id' element={<LayoutBuilderPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
export default App;
