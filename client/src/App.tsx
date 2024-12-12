import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import List from './pages/List.tsx';
import NavBar from './components/NavBar/NavBar.tsx';
import { useEffect, useState } from 'react';
import Lists from './pages/Lists.tsx';
import NewList from './pages/NewList.tsx';
import Profile from './pages/Profile.tsx';
import Items from './pages/Items.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Selection from './pages/Selection.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Bundles from './pages/Bundles.tsx';
import ItemDisplay from './pages/ItemDisplay.tsx';
import ItemEdit from './pages/ItemEdit.tsx';
import ItemNew from './pages/ItemNew.tsx';
import BundleEdit from './pages/BundleEdit.tsx';
import BundleNew from './pages/BundleNew.tsx';
import BundleDisplay from './pages/BundleDisplay.tsx';
import JoinList from './pages/JoinList.tsx';
import ShareBundle from './pages/ShareBundle.tsx';
import ShareItem from './pages/ShareItem.tsx';
import BundleSelect from './pages/BundleSelect.tsx';
import ItemSelect from './pages/ItemSelect.tsx';
import BundleAdd from './pages/BundleAdd.tsx';
import ItemAdd from './pages/ItemAdd.tsx';
import ListsDeleted from './pages/ListsDeleted.tsx';
import ListReceipts from './pages/ListReceipts.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';
import VerifyEmailResend from './pages/VerifyEmailResend.tsx';
import UserRestrictedRoute from './components/UserRestrictedRoute/UserRestrictedRoute.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Cookies from 'universal-cookie';
import i18n from 'i18next';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import Page404 from './pages/Page404.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ListsVariance from './pages/ListsVariance.tsx';
import ListsArchived from './pages/ListsArchived.tsx';
import ShareItems from './pages/ShareItems.tsx';

function App() {
	const getSelectedTab = () => {
		const path = window.location.pathname.split('/')[1];
		switch (path) {
			case '':
				return 0;
			case 'lists':
				return 0;
			case 'bundles':
				return 2;
			case 'profile':
				return 3;
			case 'items':
				return 1;
			default:
				return 4;
		}
	};
	const cookies = new Cookies();

	const [selectedTab, setSelectedTab] = useState<number>(getSelectedTab());
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [direction, setDirection] = useState<'rtl' | 'ltr'>('ltr');

	if (cookies.get('userToken') && !isAuthenticated) {
		setIsAuthenticated(true);
	}

	i18n.on('languageChanged', (lng) => {
		setDirection(i18n.dir(lng));
	});

	const rtlCache = createCache({
		key: 'muirtl',
		stylisPlugins: [prefixer, rtlPlugin],
	});

	const ltrCache = createCache({
		key: 'mui',
	});

	useEffect(() => {
		setSelectedTab(getSelectedTab());
	}, [window.location.pathname]);

	return (
		<>
			<ToastContainer theme="colored" />
			<CacheProvider value={direction === 'rtl' ? rtlCache : ltrCache}>
				<GoogleOAuthProvider
					clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
				>
					<Router>
						<Routes>
							{/* lists routes */}
							<Route
								path="/"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<Lists />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/variance"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ListsVariance />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/new"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<NewList />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/deleted"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ListsDeleted />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/archived"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ListsArchived />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<List />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/receipts"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ListReceipts />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/item/:item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemDisplay />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/item/:item/edit"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemEdit />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/select"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<Selection />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/select/bundle"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<BundleSelect />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/select/item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemSelect />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/add/item/:item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/new/item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemNew />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/add/bundle/:bundleId"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<BundleAdd />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/lists/:id/add/bundle/:bundle/item/:item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemDisplay />
									</ProtectedRoute>
								}
							/>
							{/* items routes */}
							<Route
								path="/items"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<Items />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/items/new"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemNew />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/items/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemDisplay />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/items/:id/edit"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemEdit />
									</ProtectedRoute>
								}
							/>
							{/* bundles routes */}
							<Route
								path="/bundles"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<Bundles />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/new"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<BundleNew />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/new/items"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemSelect />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<BundleDisplay />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/:id/edit"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<BundleEdit />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/:id/edit/items"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemSelect />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/:id/edit/item/:item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemDisplay />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/bundles/:id/item/:item"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ItemDisplay />
									</ProtectedRoute>
								}
							/>
							{/* share routes */}
							<Route
								path="/join/:token"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<JoinList />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/share/bundle/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ShareBundle />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/share/item/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ShareItem />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/share/listitem/:id"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ShareItem />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/share/items/:token"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<ShareItems />
									</ProtectedRoute>
								}
							/>
							{/* profile routes */}
							<Route
								path="/profile"
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
									>
										<Profile
											setIsAuthenticated={
												setIsAuthenticated
											}
										/>
									</ProtectedRoute>
								}
							/>
							{/* authentication routes */}
							<Route
								path="/login"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<Login
											setIsAuthenticated={
												setIsAuthenticated
											}
										/>{' '}
									</UserRestrictedRoute>
								}
							/>
							<Route
								path="/register"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<Register />{' '}
									</UserRestrictedRoute>
								}
							/>
							<Route
								path="/forgot-password"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<ForgotPassword />{' '}
									</UserRestrictedRoute>
								}
							/>
							<Route
								path="/reset-password/:token"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<ResetPassword />{' '}
									</UserRestrictedRoute>
								}
							/>
							<Route
								path="/verify/send"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<VerifyEmailResend />{' '}
									</UserRestrictedRoute>
								}
							/>
							<Route
								path="/verify/:token"
								element={
									<UserRestrictedRoute
										isAuthenticated={isAuthenticated}
									>
										<VerifyEmail />
									</UserRestrictedRoute>
								}
							/>
							<Route path="*" element={<Page404 />} />
						</Routes>
						<NavBar
							setSelectedTab={setSelectedTab}
							selectedTab={selectedTab}
						/>
					</Router>
				</GoogleOAuthProvider>
			</CacheProvider>
		</>
	);
}

export default App;
