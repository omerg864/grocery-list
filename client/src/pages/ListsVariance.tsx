import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ThemeProvider,
	useTheme,
} from '@mui/material';
import { MdOutlineAutoDelete } from 'react-icons/md';
import { IoIosArchive } from 'react-icons/io';
import listTheme from '../themes/listTheme';
import { motion } from 'framer-motion';

const ListsVariance = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'Lists' });
	const navigate = useNavigate();

	const outerTheme = useTheme();

	const goToDeleted = () => {
		navigate('/lists/deleted');
	};

	const goToArchived = () => {
		navigate('/lists/archived');
	};

	const back = () => {
		navigate('/');
	};

	const pages = [
		{
			title: t('deleted'),
			goTo: goToDeleted,
			icon: <MdOutlineAutoDelete />,
		},
		{ title: t('archived'), goTo: goToArchived, icon: <IoIosArchive /> },
	];

	return (
		<main>
			<Header title={t('variance')} onBack={back} />
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
				className="list-form"
				style={{ gap: 0 }}
			>
				<ThemeProvider theme={listTheme(outerTheme)}>
					{pages.map((page, index) => (
						<ListItem
							disablePadding
							key={index}
							onClick={page.goTo}
						>
							<ListItemButton>
								<ListItemIcon>{page.icon}</ListItemIcon>
								<ListItemText primary={page.title} />
							</ListItemButton>
						</ListItem>
					))}
				</ThemeProvider>
			</motion.div>
		</main>
	);
};

export default ListsVariance;
