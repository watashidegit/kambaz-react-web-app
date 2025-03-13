import { FaPlus, FaSearch } from "react-icons/fa";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentsControls() {
 const { cid } = useParams();
 const { currentUser } = useSelector((state: any) => state.accountReducer); 
 const navigate = useNavigate();

 return (
   <div id="wd-assignments-controls" className="d-flex align-items-center justify-content-between mb-4 ">
      <InputGroup className="position-relative" style={{ width: "500px" }}>
        <InputGroup.Text >
          <FaSearch />
        </InputGroup.Text>
        <FormControl placeholder="Search..."  />
      </InputGroup>
      {/* group or add feature only available to faculty*/}
      {currentUser.role === "FACULTY" &&
      <>
        <Button variant="light" size="lg" className="me-1 float-end" id="wd-add-module-btn">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </Button>
        {/* Navigate to Editor when clicking this button */}
        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/Editor`)}>
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Assignment
        </Button>
     </>
     }
   </div>
);}