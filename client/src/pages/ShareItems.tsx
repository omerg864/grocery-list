import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../utils/apiRequest';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import Loading from '../components/Loading/Loading';
import Header from '../components/Header/Header';
import { Avatar, IconButton } from '@mui/material';
import GlassButton from '../components/GlassButton/GlassButton';
import { IoMdAdd } from 'react-icons/io';
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { itemsDataAtom } from '../recoil/atoms';

const ShareItems = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'SharingItems' });

	const [_, setItems] = useRecoilState(itemsDataAtom);

	const { token } = useParams<{ token: string }>();

	const cookies = new Cookies();

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const [user, setUser] = useState<{
		f_name: string;
		l_name: string;
		email: string;
		avatar?: string;
	}>({
		f_name: '',
		l_name: '',
		email: '',
		avatar: '',
	});

	const getUserDataByToken = async () => {
		setIsLoading(true);
		await get(
			`/api/user/sharing-token/${token}`,
			(data) => {
				setUser(data.user);
			},
			{
				authorization: `Bearer ${cookies.get('userToken')}`,
			}
		);
		setIsLoading(false);
	};

	const shareItems = async () => {
		setIsLoading(true);
		await post(
			`/api/user/share/${token}`,
			{},
			(data) => {
				toast.success(t('itemsShared'));
				setItems({
					items: [],
					categories: [],
					updated: new Date(),
				});
				navigate('/profile');
			},
			{
				authorization: `Bearer ${cookies.get('userToken')}`,
			}
		);
		setIsLoading(false);
	};

	useEffect(() => {
		getUserDataByToken();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<main>
			<Header title={t('shareItems')} onBack={() => navigate('/')} />
			<form
				className="list-form"
				style={{ position: 'relative', paddingTop: '5.5rem' }}
                onSubmit={shareItems}
			>
				<div className="item-display-img-container">
					{user.avatar ? (
						<motion.img
							animate={{ scale: [0, 1] }}
							transition={{ delay: 0.8 }}
							className="item-display-img"
							src={user.avatar}
							alt={user.f_name}
						/>
					) : (
						<Avatar sx={{ width: 50, height: 50 }}>
							{user.f_name[0] + user.l_name[0]}
						</Avatar>
					)}
				</div>
				<p>{t('shareItemsText')}</p>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
					}}
				>
					<div>
						<h3>
							{user.f_name} {user.l_name}
						</h3>
						<p>{user.email}</p>
					</div>
				</div>
				<GlassButton
					endIcon={<IoMdAdd size={'1.5rem'} color="white" />}
					text={t('accept')}
					style={{ width: '100%', color: 'white' }}
					type="submit"
				/>
			</form>
		</main>
	);
};

export default ShareItems;
