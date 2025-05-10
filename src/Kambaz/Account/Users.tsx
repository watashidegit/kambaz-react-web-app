import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PeopleTable from "../Courses/People/Table";
import * as client from "./client";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

export default function Users() {

    const [users, setUsers] = useState<any[]>([]);
    const [role, setRole] = useState("");
    const [ ,setName] = useState("");
    const { uid } = useParams();

    const createUser = async () => {
        const user = await client.createUser({
          firstName: "New",
          lastName: `User${users.length + 1}`,
          username: `newuser${Date.now()}`,
          password: "password123",
          email: `email${users.length + 1}@neu.edu`,
          section: "S101",
          role: "STUDENT",
        });
        setUsers([...users, user]);
    };
    
    // filter users by partial name 
    const filterUsersByName = async (name: string) => {
        setName(name);
        if (name) {
          const users = await client.findUsersByPartialName(name);
          setUsers(users);
        } else {
          fetchUsers();
        }
    };    

    // filter users by role updates state
    const filterUsersByRole = async (role: string) => {
        setRole(role);
        if (role) {
          const users = await client.findUsersByRole(role);
          setUsers(users);
        } else {
          fetchUsers();
        }
    };    

    // fetches all users from the backend and updates state
    const fetchUsers = async () => {
        const users = await client.findAllUsers();
        setUsers(users);
    };

    // useEffect runs fetchUsers() every time uid changes in the URL
    useEffect(() => {
    fetchUsers();
    }, [uid]);

return (
    <div>
        <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
            <FaPlus className="me-2 mb-1" />
            Users
        </button>
        <FormControl onChange={(e) => filterUsersByName(e.target.value)} placeholder="Search people"
            className="float-start w-25 me-2 wd-filter-by-name" />
        <select value={role} onChange={(e) =>filterUsersByRole(e.target.value)}
              className="form-select float-start w-25 wd-select-role" >
            <option value="">All Roles</option>    <option value="STUDENT">Students</option>
            <option value="TA">Assistants</option> <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrators</option>
        </select>
        <PeopleTable users={users} />
    </div>
);}

