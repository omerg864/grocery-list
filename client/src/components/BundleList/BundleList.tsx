import { useState } from "react";
import Bundle from "../../interface/BundleInterface";
import BundleViewList from "../BundleViewList/BundleViewList";
import './BundleList.css';
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";


interface BundleListProps {
  bundles: Bundle[];
  onSwipeRight?: (id: string) => void;
  onItemClick?: (id: string) => void;
}

function BundleList(props: BundleListProps) {

  const [open, setOpen] = useState<string | null>(null);
  const { t } = useTranslation('translation', { keyPrefix: 'Generic' });

  return (
    <div className="bundle-list">

      {props.bundles.length === 0 ? <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 
        <img alt="No bundles" style={{width: '60%'}} src="/shopping-cart-icon.png" />
        <Typography variant="h5">{t('noBundles')}</Typography>
        </div> : props.bundles.map(bundle => (
        <BundleViewList onItemClick={props.onItemClick} onSwipeRight={props.onSwipeRight} open={open} setOpen={setOpen} key={bundle._id} bundle={bundle} />
      ))}
    </div>
  )
}

export default BundleList