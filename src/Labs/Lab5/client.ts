import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${REMOTE_SERVER}/lab5/welcome`);
  return response.data;
};

/* Working with Assignment */
const ASSIGNMENT_API = `${REMOTE_SERVER}/lab5/assignment`;

// fetch assignment
export const fetchAssignment = async () => {
    const response = await axios.get(`${ASSIGNMENT_API}`);
    return response.data;
};

// update assignment title
export const updateTitle = async (title: string) => {
    const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
    return response.data;
};

/* Working with Arrays*/
const TODOS_API = `${REMOTE_SERVER}/lab5/todos`;

// Fetch the array
export const fetchTodos = async () => {
    const response = await axios.get(TODOS_API);
    return response.data;
};

// delete data with get
export const removeTodo = async (todo: any) => {
    const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
    return response.data;
};

// delete data with delete
export const deleteTodo = async (todo: any) => {
    const response = await axios.delete(`${TODOS_API}/$${todo.id}`);
    return response.data;
}
  
// create new data using get
export const createTodo = async () => {
    const response = await axios.get(`${TODOS_API}/create`);
    return response.data;
}

// create new date using post
export const postTodo = async (todo: any) => {
    const response = await axios.post(`${TODOS_API}`, todo);
    return response.data;
}
  
