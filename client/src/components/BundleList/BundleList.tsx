import { useState } from "react";
import Bundle from "../../interface/BundleInterface";
import BundleViewList from "../BundleViewList/BundleViewList";
import './BundleList.css';


interface BundleListProps {
  bundles: Bundle[];
  onSwipeRight?: (id: string) => void;
  onItemClick?: (id: string) => void;
}

function BundleList(props: BundleListProps) {

  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="bundle-list">
      {props.bundles.map(bundle => (
        <BundleViewList onItemClick={props.onItemClick} onSwipeRight={props.onSwipeRight} open={open} setOpen={setOpen} key={bundle._id} bundle={bundle} />
      ))}
    </div>
  )
}

export default BundleList