import { addModule, editModule, updateModule, deleteModule, setModules } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import "../../styles.css";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import LessonControlButtons from "./LessonControlButtons";
import { FormControl } from "react-bootstrap";
import * as courseClient from "../client";
import * as moduleClient from "../Modules/client";
// import { MdEmail } from "react-icons/md";

export default function Modules() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    
    // apply update and save
    const saveModule = async (module: any) => {
      await moduleClient.updateModule(module);
      dispatch(updateModule(module));
    };

    // delete module
    const removeModule = async (moduleId: string) => {
      await moduleClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    };

    // create module for course 
    const createModuleForCourse = async () => {
      if (!cid) return;
      const newModule = { name: moduleName, course: cid };
      const module = await courseClient.createModuleForCourse(cid, newModule);
      dispatch(addModule(module));
    };
    
    // Fetch modules for the current course from the server and dispatch them to the Redux store
    const fetchModules = async () => {
      const modules = await courseClient.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    };
    
    // load modules
    useEffect(() => {
      fetchModules();
    }, []);

    // Uses useSelector to extract the modules array from the Redux store.
    const { modules } = useSelector((state: any) => state.modulesReducer);

    // for adding modules local state variable
    const [moduleName, setModuleName] = useState("");

    // extract from redux to determine user roles
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    // Determine the user's role
    // const isStudent = currentUser?.role === "STUDENT";
    const isFaculty = currentUser?.role === "FACULTY";
    
    return (
      <div>
         {/* Module Controls for Faculty Only -- add */}
        {isFaculty &&
          <ModulesControls 
            setModuleName={setModuleName} 
            moduleName={moduleName} 
            addModule={createModuleForCourse}
        />}
        <br /><br /><br /><br />

        <ul id="wd-modules" className="list-group rounded-0">
        {modules.map((module: any) => (
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
                        saveModule({...module, editing: false});
                      }
                    }}
                    defaultValue={module.name}/>
              )}         
              {/* Module Control for Faculty Only -- edit /delete */}
              {isFaculty &&     
              <ModuleControlButtons moduleId={module._id}
                deleteModule={(moduleId) => removeModule(moduleId)}
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
  