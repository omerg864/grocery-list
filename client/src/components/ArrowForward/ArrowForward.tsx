import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Fragment } from "react";
import i18n from "i18next";


interface ArrowForwardProps {
  size?: string;
  color?: string;
}
function ArrowForward(props: ArrowForwardProps) {

  const direction = i18n.dir(i18n.language);

  return (
    <Fragment>
      {direction === 'rtl' ? <IoIosArrowBack color={props.color} size={props.size} /> : 
      <IoIosArrowForward color={props.color} size={props.size} />}
    </Fragment>
  )
}

export default ArrowForward