import { useState } from "react";
import { Form, FormControl } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export default function WorkingWithArrays() {
  const API = `${REMOTE_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos </a><hr/>
      
      <h4>Retrieving an Item from an Array by ID</h4>
      <div className="d-flex align-items-center">
        <FormControl id="wd-todo-id" className="me-2" style={{ width: "200pt" }}
            defaultValue={todo.id} onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
        <a id="wd-retrieve-todo-by-id" className="btn btn-primary" href={`${API}/${todo.id}`}>
            Get Todo by ID
        </a>
      </div><hr/>
      
      <h4>Filtering Array Items</h4>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary"
        href={`${API}?completed=true`}>
        Get Completed Todos
      </a>
      <hr/>
      
      <h4>Creating new Items in an Array</h4>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary"
        href={`${API}/create`}>
        Create Todo
      </a><hr/>
      
      <h4>Deleting from an Array</h4>
      <div className="d-flex align-items-center">
        <FormControl defaultValue={todo.id} className="me-2" 
            style={{ width: "200pt" }}
            onChange={(e) => 
            setTodo({ ...todo, id: e.target.value })}/>
        <a id="wd-retrieve-completed-todos" className="btn btn-primary me-2" 
            href={`${API}/${todo.id}/delete`}>
            Delete Todo with ID = {todo.id} </a>
      </div><hr/>
      
      <h3>Updating an Item in an Array</h3>
      <div className="d-flex align-items-center">
        <FormControl defaultValue={todo.id} className="me-2" style={{ width: "100pt" }}
            onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
        <FormControl defaultValue={todo.title} className="me-2" style={{ width: "200pt" }}
                onChange={(e) => setTodo({ ...todo, title: e.target.value }) }/>
        <a href={`${API}/${todo.id}/title/${todo.title}`} className="btn btn-primary float-end">
        Update Todo's Title</a>
      </div>
      <br />
      <div className="d-flex align-items-center">
        <FormControl 
            defaultValue={todo.id} 
            className="me-2" 
            style={{ width: "100pt" }}
            onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
        <Form.Check
            id="wd-complete-checkbox"
            checked={todo.completed}
            style={{ width: "20pt", height:"20pt" }}
            onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}/>
        <label htmlFor="wd-complete-checkbox" className="me-2">Completed</label>
        <a href={`${API}/${todo.id}/completed/${todo.completed}`} className="btn btn-primary">
        Update Todo's Completed Status</a>
      </div>
      <br />
      <div className="d-flex align-items-center">
        <FormControl 
            defaultValue={todo.id} 
            className="me-2" 
            style={{ width: "100pt" }}
            placeholder="Please enter new description..."
            onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
        <FormControl defaultValue={todo.description} className="me-2" style={{ width: "300pt" }}
                onChange={(e) => setTodo({ ...todo, description: e.target.value }) }/>
        <a href={`${API}/${todo.id}/description/${todo.description}`} className="btn btn-primary float-end">
        Update Todo's Description</a>
      </div>
    </div>
);}

