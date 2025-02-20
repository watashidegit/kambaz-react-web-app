import { FaPlus} from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
export default function ModuleControlButtons() {
  return (
    <div className="float-end">
      <span className="me-2">
        <GreenCheckmark />
      </span>
      <FaPlus className="fs-5 me-2" />
      <IoEllipsisVertical className="fs-4" />
    </div> );}