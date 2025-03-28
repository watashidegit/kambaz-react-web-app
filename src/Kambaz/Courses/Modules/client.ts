import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

// delete module
export const deleteModule = async (moduleId: string) => {
    const response = await axios.delete(`${MODULES_API}/${moduleId}`);
    return response.data; 
};

// apply update to the module by id
export const updateModule = async (module: any) => {
    const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
    return data;
};
  