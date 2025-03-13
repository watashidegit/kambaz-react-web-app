import Modules from "../Modules";
import CourseStatus from "./Status";
export default function Home({ modules, setModules }: { modules: any[]; setModules: (modules: any[]) => void }) {
  return (
      <div className="d-flex" id="wd-home">
          <div className="flex-fill me-3">
              <Modules modules={modules} setModules={setModules} />
          </div>
          <div className="d-none d-xl-block">
              <CourseStatus />
          </div>
      </div>
  );
}
