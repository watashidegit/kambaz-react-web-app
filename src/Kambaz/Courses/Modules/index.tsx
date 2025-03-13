import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import "../../styles.css";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router";
import { useState } from "react";
import LessonControlButtons from "./LessonControlButtons";
import { FormControl } from "react-bootstrap";
import { ModuleType } from "./types";

interface ModulesProps {
  modules?: ModuleType[];
  setModules?: (modules: ModuleType[]) => void;
}

export default function Modules({ modules: propModules, setModules }: ModulesProps = {}) {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules: reduxModules } = useSelector((state: any) => state.modulesReducer);
    const modulesToUse = propModules || reduxModules;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
      <div>
         {/* Show Module Controls for Faculty Only */}
        {currentUser.role === "FACULTY" &&
          <ModulesControls setModuleName={setModuleName} moduleName={moduleName} 
          addModule={() => {
            dispatch(addModule({ name: moduleName, course: cid }));
            if (setModules && propModules) {
              const newModule = {
                  _id: Date.now().toString(),
                  name: moduleName,
                  course: cid || ""
              };
              setModules([...propModules, newModule]);
            }
            setModuleName("");
        }}/>}
        <br /><br /><br /><br />
        <ul id="wd-modules" className="list-group rounded-0">
        {modulesToUse
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
          <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              { module.editing && (
                <FormControl className="w-50 d-inline-block"
                    onChange={(e) => 
                      dispatch(
                        updateModule({ ...module, name: e.target.value }))
                      }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(updateModule({ ...module, editing: false }));
                      }
                    }}
                    defaultValue={module.name}/>
              )}         
              {/* Show Module Control Buttons for Faculty Only */}
              {currentUser.role === "FACULTY" &&     
              <ModuleControlButtons moduleId={module._id}
                deleteModule={(moduleId) => {dispatch(deleteModule(moduleId));
                }}
                editModule={(moduleId) => dispatch(editModule(moduleId))}/>}
            </div>
            {module.lessons && (
              <ul className="wd-lessons list-group rounded-0">
                {module.lessons.map((lesson: any) => (
                  <li className="wd-lesson list-group-item p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                  </li>
                ))}</ul>)}</li>))}</ul>
      </div>
  );}
  