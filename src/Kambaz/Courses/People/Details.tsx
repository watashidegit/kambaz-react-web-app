import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as client from "../../Account/client";
import { FormControl } from "react-bootstrap";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState(""); // edit users's name
  const [email, setEmail] = useState(""); // edit users's email
  const [username, setUsername] = useState(""); 
  const [role, setRole] = useState("")
  const [editing, setEditing] = useState(false); // editing state
  const navigate = useNavigate();

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName, email, username, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    //navigate(-1);
  };
  
  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  }

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email);
    setRole(user.role);
    setUsername(user.username);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" /> </button>
      <div className="text-center mt-2"> <FaUserCircle className="text-secondary me-2 fs-1" /> </div><hr />
      
      { /* update input field */ }
      <div>
        {!editing && (
          <FaPencil onClick={() => setEditing(true)}
              className="float-end fs-5 mt-2 wd-edit" /> )}
        {editing && (
          <FaCheck onClick={() => saveUser()}
              className="float-end fs-5 mt-2 me-2 wd-save" /> )}
        
        {/* name field */}
        {!editing && (
          <div className="wd-name text-danger fs-4"
               onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}</div>)}
        {user && editing && (
          <div className="mb-2">
          <b>Name:</b>
          <FormControl
            className="w-50 d-inline-block ms-2 wd-edit-name"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            </div>)}
        
        {/* username field */}
        {!editing && (
            <div className="wd-username">
                <b>Username: </b>
                <span >{user.username}</span> <br />
            </div>
        )}
        {user && editing && (
            <div className="mb-2">
                <b>Username:</b>
                <FormControl
                  className="w-50 d-inline-block ms-2 wd-edit-username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
            />
          </div>)}

        {/* email field */}
        {!editing && (
            <div className="wd-email">
                <b>Email: </b>
                <span >{user.email}</span> <br />
            </div>
        )}
        {user && editing && (
            <div className="mb-2">
            <b>Email:</b>
            <FormControl
              className="w-50 d-inline-block ms-2 wd-edit-email"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
              </div>)}

        {/* role dropdown */}
        {!editing && (
            <div className="wd-roles">
                <b>Roles: </b> 
                <span>{user.role}</span> <br />
            </div>
        )}
        {user && editing && (
            <div className="mb-2">
            <b>Role:</b>
            <select
              className="w-50 ms-2 wd-edit-role form-select d-inline-block"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Students</option>
              <option value="TA">Assistants</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>
        )}
      </div>

      <b>Login ID:</b>        <span className="wd-login-id">      {user.loginId}      </span> <br />
      <b>Section:</b>         <span className="wd-section">       {user.section}      </span> <br />
      <b>Total Activity:</b>  <span className="wd-total-activity">{user.totalActivity}</span> 
      
      {/* delete and cancel button */}
      <hr />
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete" > Delete </button>
      <button onClick={() => navigate(-1)}
              className="btn btn-secondary float-start float-end me-2 wd-cancel" > Cancel </button>
    
    </div> 
  ); }

