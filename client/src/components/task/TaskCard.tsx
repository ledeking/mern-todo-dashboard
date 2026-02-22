import { Task } from "@/store/useTaskStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { isOverdue } from "@/lib/utils";
import { useNavigate } from "react-router";
import { Calendar, Tag } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold flex-1">{task.title}</h3>
          <div
            className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
          />
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                overdue ? "text-red-500 font-semibold" : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM dd")}
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              {task.tags.length}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{task.status}</Badge>
          {task.subtasks.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {task.subtasks.filter((s) => s.completed).length}/
              {task.subtasks.length} subtasks
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
