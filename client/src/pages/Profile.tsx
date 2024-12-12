import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useEffect, useState } from 'react';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ThemeProvider,
	useTheme,
} from '@mui/material';
import { CgProfile } from 'react-icons/cg';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GiSettingsKnobs } from 'react-icons/gi';
import listTheme from '../themes/listTheme';
import PersonalDetails from '../components/PersonalDetails/PersonalDetails';
import PasswordChange from '../components/PasswordChange/PasswordChange';
import Preferences from '../components/Preferences/Preferences';
import Loading from '../components/Loading/Loading';
import { CiLogout } from 'react-icons/ci';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { get } from '../utils/apiRequest';
import PreferencesInterface from '../interface/PreferencesInterface';
import { motion } from 'framer-motion';
import Sharing from '../components/Sharing/Sharing';
import { IoIosShare } from 'react-icons/io';
import User from '../interface/UserInterface';

interface ProfileProps {
	setIsAuthenticated: (isAuthenticated: boolean) => void;
}
function Profile(props: ProfileProps) {
	const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<{
		f_name: string;
		l_name: string;
		email: string;
		avatar?: string;
		sharingToken: string;
		sharedWith: User[];
	}>({
		f_name: '',
		l_name: '',
		email: '',
		avatar: '',
		sharingToken: '',
		sharedWith: [],
	});
	const [preferences, setPreferences] = useState<PreferencesInterface>({
		fullSwipe: false,
		language: 'en',
	});
	const [tab, setTab] = useState(0);
	const cookies = new Cookies();
	const navigate = useNavigate();

	const outerTheme = useTheme();

	const logout = () => {
		cookies.remove('userToken');
		cookies.remove('user');
		props.setIsAuthenticated(false);
		navigate('/login');
	};

	const title = () => {
		switch (tab) {
			case 1:
				return t('personalDetails');
			case 2:
				return t('password');
			case 3:
				return t('preferences');
			case 4:
				return t('sharing');
			default:
				return t('profile');
		}
	};

	const backClick = () => {
		setTab(0);
	};

	let back = {};
	if (tab !== 0) {
		back = { onBack: backClick };
	}

	const getUser = async () => {
		setIsLoading(true);
		await get(
			'/api/user/',
			(data) => {
				setUser(data.user);
				setPreferences(data.preferences);
			},
			{
				authorization: `Bearer ${cookies.get('userToken')}`,
			}
		);
		setIsLoading(false);
	};

	useEffect(() => {
		getUser();
	}, []);

	const tabs = [
		{ title: t('personalDetails'), icon: <CgProfile color="white" /> },
		{ title: t('password'), icon: <RiLockPasswordLine color="white" /> },
		{ title: t('preferences'), icon: <GiSettingsKnobs color="white" /> },
		{ title: t('sharing'), icon: <IoIosShare color="white" /> },
	];

	if (isLoading) {
		return <Loading />;
	}

	return (
		<main>
			<Header
				title={title()}
				{...back}
				buttonTitle={t('logout')}
				endIcon={<CiLogout size={'1.5rem'} color="black" />}
				buttonClick={logout}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
				className="list-form"
			>
				<ThemeProvider theme={listTheme(outerTheme)}>
					{tab === 0 && (
						<List>
							{tabs.map((tab, index) => (
								<ListItem
									disablePadding
									key={index}
									onClick={() => setTab(index + 1)}
								>
									<ListItemButton>
										<ListItemIcon>{tab.icon}</ListItemIcon>
										<ListItemText primary={tab.title} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					)}
					{tab === 1 && (
						<PersonalDetails
							setUser={setUser}
							user={user}
							setTab={setTab}
							setIsLoading={setIsLoading}
						/>
					)}
					{tab === 2 && (
						<PasswordChange
							setTab={setTab}
							setIsLoading={setIsLoading}
						/>
					)}
					{tab === 3 && (
						<Preferences
							preferences={preferences}
							setPreferences={setPreferences}
							setTab={setTab}
							setIsLoading={setIsLoading}
						/>
					)}
					{tab === 4 && (
						<Sharing
							user={user}
							setUser={setUser}
							setTab={setTab}
							setIsLoading={setIsLoading}
						/>
					)}
				</ThemeProvider>
			</motion.div>
		</main>
	);
}

export default Profile;
