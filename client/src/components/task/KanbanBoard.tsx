import { useTaskStore } from "@/store/useTaskStore";
import { useTasks } from "@/hooks/useTasks";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { SortableTaskCard } from "./SortableTaskCard";
import { useState } from "react";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
] as const;

export function KanbanBoard() {
  const { tasks, updateTask } = useTaskStore();
  const { updateTaskById } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    updateTask(taskId, { status: newStatus as any });

    // Update on server
    try {
      await updateTaskById(taskId, { status: newStatus });
    } catch (error) {
      // Revert on error
      updateTask(taskId, { status: task.status });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} id={column.id} title={column.title}>
            <SortableContext
              items={getTasksByStatus(column.id).map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {getTasksByStatus(column.id).map((task) => (
                  <SortableTaskCard key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <SortableTaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
