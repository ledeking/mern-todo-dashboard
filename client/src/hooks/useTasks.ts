import { useTaskStore } from "@/store/useTaskStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Task } from "@/store/useTaskStore";

export function useTasks() {
  const { setTasks, addTask, updateTask, deleteTask, filters } = useTaskStore();

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch tasks");
      throw error;
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await api.post("/tasks", taskData);
      addTask(response.data);
      toast.success("Task created successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create task");
      throw error;
    }
  };

  const updateTaskById = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      updateTask(id, response.data);
      toast.success("Task updated successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update task");
      throw error;
    }
  };

  const deleteTaskById = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      deleteTask(id);
      toast.success("Task deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete task");
      throw error;
    }
  };

  const getTaskById = async (id: string) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch task");
      throw error;
    }
  };

  return {
    fetchTasks,
    createTask,
    updateTaskById,
    deleteTaskById,
    getTaskById,
  };
}
