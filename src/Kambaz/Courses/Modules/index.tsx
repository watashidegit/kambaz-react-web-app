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
    const [moduleName, setModuleName] = useState(""); // for adding modules local state variable
    // Uses useSelector to extract the modules array from the Redux store.
    const { modules } = useSelector((state: any) => state.modulesReducer);

    // extract from redux to determine user roles
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    // Determine the user's role
    // const isStudent = currentUser?.role === "STUDENT";
    const isFaculty = currentUser?.role === "FACULTY";
    
    // apply update and save
    const updateModuleHandler = async (module: any) => {
      await moduleClient.updateModule(module);
      dispatch(updateModule(module));
    };

    // delete module
    const deleteModuleHandler = async (moduleId: string) => {
      await moduleClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    };

    // create module for course 
    const addModuleHandler = async () => {
      const newModule = await courseClient.createModuleForCourse(cid!, {
        name: moduleName,
        course: cid,
      });
      dispatch(addModule(newModule));
      setModuleName("");
    };
    
    // Fetch modules for the current course from the server and dispatch them to the Redux store
    const fetchModulesForCourse = async () => {
      const modules = await courseClient.findModulesForCourse(cid!);
      dispatch(setModules(modules));
    };
    
    // load modules
    useEffect(() => {
      fetchModulesForCourse();
    }, [cid]);
    
    return (
      <div>
         {/* Module Controls for Faculty Only -- add */}
        {isFaculty &&
          <ModulesControls 
            addModule={addModuleHandler}
            moduleName={moduleName} 
            setModuleName={setModuleName} 
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
                      updateModuleHandler({ ...module, name: e.target.value }) }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateModuleHandler({...module, editing: false});
                      }
                    }}
                    defaultValue={module.name}/>
              )}         
              {/* Module Control for Faculty Only -- edit /delete */}
              {isFaculty &&     
              <ModuleControlButtons moduleId={module._id}
                deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
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
  