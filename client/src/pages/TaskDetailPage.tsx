import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTasks } from "@/hooks/useTasks";
import { useTaskStore } from "@/store/useTaskStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Trash2, Check, X } from "lucide-react";
import { isOverdue } from "@/lib/utils";
import { TaskForm } from "@/components/task/TaskForm";

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTaskById, deleteTaskById } = useTasks();
  const { tasks } = useTaskStore();
  const [task, setTask] = useState(tasks.find((t) => t._id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (id && !task) {
      getTaskById(id).then(setTask);
    }
  }, [id, task, getTaskById]);

  if (!task) {
    return <div className="p-8">Loading...</div>;
  }

  const overdue = isOverdue(task.dueDate, task.status);

  const handleUpdate = async (updates: any) => {
    const updated = await updateTaskById(task._id, updates);
    setTask(updated);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskById(task._id);
      navigate("/tasks");
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    const updatedComments = [
      ...task.comments,
      {
        text: comment,
        author: task.owner,
        createdAt: new Date().toISOString(),
      },
    ];
    await handleUpdate({ comments: updatedComments });
    setComment("");
  };

  const handleToggleSubtask = async (index: number) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    await handleUpdate({ subtasks: updatedSubtasks });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tasks")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold flex-1">{task.title}</h1>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="pt-6">
            <TaskForm
              initialData={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {task.description || "No description"}
                </p>
              </CardContent>
            </Card>

            {task.subtasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subtasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    >
                      <button
                        onClick={() => handleToggleSubtask(index)}
                        className="flex-shrink-0"
                      >
                        {subtask.completed ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={
                          subtask.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button onClick={handleAddComment}>Add</Button>
                </div>
                <div className="space-y-3">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge>{task.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <Badge variant="outline">{task.priority}</Badge>
                </div>
                {task.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <p className={overdue ? "text-red-500 font-semibold" : ""}>
                      {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
                {task.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
