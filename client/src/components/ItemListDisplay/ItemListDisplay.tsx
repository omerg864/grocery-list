import { CardActionArea, Typography } from '@mui/material';
import Item from '../../interface/ItemInterface';
import ListItem from '../../interface/ListItemInterface';
import { useTranslation } from 'react-i18next';

interface ItemListDisplayProps {
	item: Item | ListItem;
}

function ItemListDisplay(props: ItemListDisplayProps) {
	const { t } = useTranslation('translation', { keyPrefix: 'ItemsList' });

	return (
		<CardActionArea className="item-container">
			<div className="item-view">
				{props.item.imageMemo ? (
					props.item.imageMemo
				) : (
					<img
						className="item-img"
						src={props.item.img ? props.item.img : '/item.png'}
						alt={props.item.name}
					/>
				)}
				<div className="item-details">
					<Typography
						sx={{ margin: 0, fontWeight: 700 }}
						variant="h6"
					>
						{props.item.name}
					</Typography>
					<Typography
						sx={{ minHeight: '1.245rem' }}
						variant="caption"
					>
						{props.item.description}
					</Typography>
					{props.item.unit &&
						props.item.unit !== 'no' &&
						(props.item as ListItem).amount && (
							<Typography
								sx={{ margin: 0, fontWeight: 700 }}
								variant="h6"
							>
								{(props.item as ListItem).amount}{' '}
								{t(props.item.unit)}
							</Typography>
						)}
				</div>
			</div>
		</CardActionArea>
	);
}

export default ItemListDisplay;
