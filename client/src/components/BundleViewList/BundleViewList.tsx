import { CardActionArea, Typography } from '@mui/material';
import Bundle from '../../interface/BundleInterface';
import SwipeItem from '../SwipeItem/SwipeItem';
import { FaTrash } from 'react-icons/fa';
import ImagesList from '../ImagesList/ImagesList';
import './BundleViewList.css';
import Cookies from 'universal-cookie';
import { motion } from 'framer-motion';
import useWindowDimensions from '../../hooks/useWindowDimensions';

interface BundleViewListProps {
	bundle: Bundle;
	open: string | null;
	setOpen: (id: string | null) => void;
	delete?: boolean;
	onSwipeRight?: (id: string) => void;
	onItemClick?: (id: string) => void;
	index: number;
}

function BundleViewList(props: BundleViewListProps) {
	const leftButton = (): React.ReactNode => {
		return (
			<div className="swipe-content">
				<FaTrash size={'1.5rem'} color="white" />
			</div>
		);
	};
	const cookies = new Cookies();

	const user = cookies.get('user');
	const fullSwipe = user && user.fullSwipe ? true : false;
	const dimensions = useWindowDimensions();

	let leftButtonChild;

	if (props.onSwipeRight) {
		leftButtonChild = leftButton();
	}

	return (
		<motion.div
			initial={{ x: dimensions.width + 200 + props.index * 80 }}
			animate={{ x: 0 }}
			transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
		>
			<SwipeItem
				fullSwipe={fullSwipe}
				open={props.open}
				setOpen={props.setOpen}
				threshold={0.1}
				onSwipedRight={
					props.onSwipeRight
						? () => props.onSwipeRight!(props.bundle._id)
						: undefined
				}
				id={props.bundle._id}
				leftBtnOpenWidth={80}
				animateDivClass={'item-div'}
				leftBtnClass="swipe-left-btn"
				leftBtnChildren={leftButtonChild}
				mainItemClick={() => props.onItemClick!(props.bundle._id)}
			>
				<CardActionArea className="item-container">
					<div style={{ minHeight: '5rem' }} className="bundle-view">
						<Typography variant="h6">
							{props.bundle.title}
						</Typography>
						<ImagesList
							images={props.bundle.items
								.map((item) =>
									item.img ? item.img : '/item.png'
								)
								.slice(0, 6)}
						/>
					</div>
				</CardActionArea>
			</SwipeItem>
		</motion.div>
	);
}

export default BundleViewList;
