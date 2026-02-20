import { Router, Response } from "express";
import { Task } from "../models/Task.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all tasks
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const query: any = { owner: req.userId };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const tasks = await Task.find(query)
      .sort(sort)
      .populate("owner", "name email avatarColor")
      .populate("comments.author", "name avatarColor");

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get single task
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.userId,
    })
      .populate("owner", "name email avatarColor")
      .populate("comments.author", "name avatarColor");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Create task
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, status, tags, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || "medium",
      status: status || "todo",
      tags: tags || [],
      subtasks: subtasks || [],
      owner: req.userId,
    });

    await task.populate("owner", "name email avatarColor");

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Update task
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, status, tags, subtasks, comments } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(tags && { tags }),
        ...(subtasks && { subtasks }),
        ...(comments && { comments }),
      },
      { new: true, runValidators: true }
    )
      .populate("owner", "name email avatarColor")
      .populate("comments.author", "name avatarColor");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Delete task
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Bulk update status
router.patch("/status", async (req: AuthRequest, res: Response) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || !status) {
      return res.status(400).json({ error: "taskIds array and status are required" });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds }, owner: req.userId },
      { status }
    );

    res.json({ message: `${result.modifiedCount} tasks updated` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export { router as taskRoutes };
