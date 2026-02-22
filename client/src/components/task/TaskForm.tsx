import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "inprogress", "done"]).default("todo"),
  tags: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      priority: "medium",
      status: "todo",
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    const tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    await onSubmit({ ...data, tags: tags.join(",") });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Task title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">
            {errors.title.message}
          </p>
        )}
      </div>
      <div>
        <Textarea
          placeholder="Description (optional)"
          {...register("description")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select {...register("priority")}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>
        <div>
          <Input
            type="date"
            placeholder="Due date"
            {...register("dueDate")}
          />
        </div>
      </div>
      <div>
        <Input
          placeholder="Tags (comma-separated)"
          {...register("tags")}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
