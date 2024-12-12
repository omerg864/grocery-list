import { ThemeProvider, useTheme } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import listTheme from '../../themes/listTheme';
import { del, get } from '../../utils/apiRequest';
import { addDays } from '../../utils/functions';
import UsersList from '../UsersList/UsersList';
import User from '../../interface/UserInterface';
import { toast } from 'react-toastify';

interface SharingProps {
	setTab: (tab: number) => void;
	setIsLoading: (loading: boolean) => void;
	user: {
		f_name: string;
		l_name: string;
		email: string;
		avatar?: string;
		sharingToken: string;
		sharedWith: User[];
	};
	setUser: (user: {
		f_name: string;
		l_name: string;
		email: string;
		avatar?: string;
		sharingToken: string;
		sharedWith: User[];
	}) => void;
}
const Sharing = (props: SharingProps) => {
	const { t } = useTranslation('translation', { keyPrefix: 'Profile' });

	const cookies = new Cookies();

	const outerTheme = useTheme();

	const createNewShareToken = async () => {
		props.setIsLoading(true);
		await get(
			'/api/user/sharing-token',
			(data) => {
				props.setUser({
					...props.user,
					sharingToken: data.token,
				});
				const date30 = addDays(new Date(), 30);
				cookies.set(
					'user',
					JSON.stringify({
						...props.user,
						sharingToken: data.token,
					}),
					{ path: '/', secure: true, expires: date30 }
				);
			},
			{
				authorization: `Bearer ${cookies.get('userToken')}`,
			}
		);
		props.setIsLoading(false);
	};

	const addUser = () => {
		if (navigator.share) {
			navigator.share({
				title: t('shareTitle'),
				text: t('shareText'),
				url: `${import.meta.env.VITE_HOST_URL}/share/items/${
					props.user.sharingToken
				}`,
			});
		} else {
			toast.info(t('linkCopied'));
			navigator.clipboard.writeText(
				`${import.meta.env.VITE_HOST_URL}/share/items/${
					props.user.sharingToken
				}`
			);
		}
	};

	const deleteUser = async (id: string) => {
		props.setIsLoading(true);
		await del(
			`/api/user/share/${id}`,
			(_: any) => {
				props.setUser({
					...props.user,
					sharedWith: props.user.sharedWith.filter(
						(user) => user._id !== id
					),
				});
				const date30 = addDays(new Date(), 30);
				cookies.set(
					'user',
					JSON.stringify({
						...props.user,
						sharedWith: props.user.sharedWith.filter(
							(user) => user._id !== id
						),
					}),
					{ path: '/', secure: true, expires: date30 }
				);
				toast.success(t('stoppedSharing'));
			},
			{
				authorization: `Bearer ${cookies.get('userToken')}`,
			}
		);
		props.setIsLoading(false);
	};

	return (
		<Fragment>
			<ThemeProvider theme={listTheme(outerTheme)}>
				<UsersList
					users={props.user.sharedWith}
					onAdd={addUser}
					onDelete={deleteUser}
					onReset={createNewShareToken}
					owner={true}
				/>
			</ThemeProvider>
		</Fragment>
	);
};

export default Sharing;
