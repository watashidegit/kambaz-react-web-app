import { FaPlus, FaSearch } from "react-icons/fa";
import { Button, FormControl, InputGroup } from "react-bootstrap";
export default function AssignmentsControls() {
 return (
   <div id="wd-assignments-controls" className="d-flex align-items-center justify-content-between mb-4 ">
      <InputGroup className="position-relative" style={{ width: "500px" }}>
        <InputGroup.Text >
          <FaSearch />
        </InputGroup.Text>
        <FormControl placeholder="Search..."  />
      </InputGroup>
      <Button variant="light" size="lg" className="me-1 float-end" id="wd-add-module-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
       Group
     </Button>
     <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
       Assignment
     </Button>


   </div>
);}