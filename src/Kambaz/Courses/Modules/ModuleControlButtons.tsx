import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaPlus} from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
export default function ModuleControlButtons(
  { moduleId, deleteModule, editModule }: 
  { moduleId: string; deleteModule: (moduleId: string) => void; 
    editModule: (moduleId: string) => void } ) {
  return (
    <div className="float-end">
      <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
      <FaTrash className="text-danger me-3 mb-1" onClick={() => deleteModule(moduleId)}/>
      <span className="me-2">
        <GreenCheckmark />
      </span>
      <FaPlus className="fs-5 me-2" />
      <IoEllipsisVertical className="fs-4" />
    </div> );}