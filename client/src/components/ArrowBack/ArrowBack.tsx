import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Fragment } from "react";
import i18n from "i18next";


interface ArrowBackProps {
  size?: string;
  color?: string;
}
function ArrowBack(props: ArrowBackProps) {

  const direction = i18n.dir(i18n.language);

  return (
    <Fragment>
      {direction === 'rtl' ? <IoIosArrowForward color={props.color} size={props.size} /> : 
      <IoIosArrowBack color={props.color} size={props.size} />}
    </Fragment>
  )
}

export default ArrowBack