import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/task/TaskForm";
import { Plus, Search } from "lucide-react";

export function TasksPage() {
  const { tasks, filters, setFilters } = useTaskStore();
  const { fetchTasks, createTask } = useTasks();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, filters]);

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    setShowCreateDialog(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={filters.status || ""}
          onChange={(e) => setFilters({ status: e.target.value || undefined })}
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </Select>
        <Select
          value={filters.priority || ""}
          onChange={(e) => setFilters({ priority: e.target.value || undefined })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Select
          value={filters.sortBy || "createdAt"}
          onChange={(e) => setFilters({ sortBy: e.target.value })}
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="title">Title</option>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No tasks found. Create one to get started!
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
