import { create } from "zustand";

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Comment {
  text: string;
  author: {
    id: string;
    name: string;
    avatarColor: string;
  };
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "inprogress" | "done";
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  owner: {
    id: string;
    name: string;
    email: string;
    avatarColor: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  filters: {
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskState["filters"]>) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filters: {
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () =>
    set({
      filters: {
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    }),
}));
