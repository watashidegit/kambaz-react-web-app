import { Button, ListGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({todo}: { todo: { id: string; title: string }}) 
    {
    const dispatch = useDispatch();
    return (
        <ListGroup.Item key={todo.id} className="d-flex gap-3">
            <span style={{ width: "150px" }}>{todo.title}</span>
            <Button onClick={() => dispatch(deleteTodo(todo.id))}
                id="wd-delete-todo-click" className="btn btn-danger"> Delete </Button>
            <Button onClick={() => dispatch(setTodo(todo))}
                id="wd-set-todo-click" className="btn btn-primary"> Edit </Button>
        </ListGroup.Item>);
    }  