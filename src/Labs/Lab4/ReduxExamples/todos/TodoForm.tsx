import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm()
{
    const { todo } = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    return (
        <ListGroup.Item className="d-flex gap-3">
            <FormControl 
                defaultValue={todo.title}
                onChange={ (e) => dispatch(setTodo({ ...todo, title: e.target.value }))} 
                style={{ width: "150px" }}/>
            <Button onClick={() => dispatch(updateTodo(todo))}
                id="wd-add-todo-click" className="btn text-black"
                style={{ backgroundColor: "#f4c03e", border: "none" }}> update </Button>
            <Button onClick={() => dispatch(addTodo(todo))}
                id="wd-add-todo-click" className="btn text-white"
                style={{ backgroundColor: "#4c8c62", border: "none" }} > Add </Button>       
        </ListGroup.Item>
    );
}