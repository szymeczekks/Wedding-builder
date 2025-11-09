import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PanelLayout from './components/layout/PanelLayout';
import LayoutBuilderPage from './features/layoutBuilder';
import WebsitesPage from './features/websites';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWebsiteStore } from './store/useWebsiteStore';

function App() {
	const setWebsiteId = useWebsiteStore((state) => state.setWebsiteId);

	/* napisać hooka */
	const initWebsiteId = () => {
		const websiteId = localStorage.getItem('websiteId');

		if (!websiteId) {
			const newId = uuidv4();
			localStorage.setItem('websiteId', newId);
			return newId;
		}

		return websiteId;
	};

	useEffect(() => {
		const websiteId = initWebsiteId();
		setWebsiteId(websiteId);
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/panel' element={<PanelLayout />}>
					<Route index path='/panel/websites' element={<WebsitesPage />} />
					<Route path='/panel/websites/edit/:id' element={<LayoutBuilderPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
export default App;
