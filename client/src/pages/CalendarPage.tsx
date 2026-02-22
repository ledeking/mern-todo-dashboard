import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTaskStore } from "@/store/useTaskStore";
import { useTasks } from "@/hooks/useTasks";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router";

const localizer = momentLocalizer(moment);

export function CalendarPage() {
  const { tasks } = useTaskStore();
  const { fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate!),
      end: new Date(task.dueDate!),
      resource: task,
    }));

  const handleSelectEvent = (event: any) => {
    navigate(`/tasks/${event.id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="h-[600px] bg-card rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
