import { FC } from "react";
import { SVGICON } from "../../global/global";
import SvgIcon from "../svg-icons/svg-icons";
import { IModalProps } from "./modal-interface";
import "./modal.scss";

const StartModal: FC<IModalProps> = (props: IModalProps) => {
  const { handleClose } = props;
  const showHideClassName = props.show
    ? "overlay display-flex"
    : "overlay display-none";

  return (
    <div className={showHideClassName}>
      <div className="content">
        <header>
          <SvgIcon
            fill="var(--color-tone-8)"
            d={SVGICON.CLOSE}
            handleClick={handleClose}
          />
          <div className="modal-title">BFHL Health Wordle</div>
        </header>
        <div className="content-container">{props.children}</div>
      </div>
    </div>
  );
};
export default StartModal;
