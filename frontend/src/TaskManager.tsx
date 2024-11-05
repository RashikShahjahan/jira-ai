import { useState } from "react";
import Task, { TaskData } from "./Task";

function TaskManager() {
    const [tasks, setTasks] = useState<TaskData[]>([
        { id: "1", title: "Task 1", description: "Description 1", status: "Pending", priority: "Low" },
        { id: "2", title: "Task 2", description: "Description 2", status: "In Progress", priority: "Medium" },
        { id: "3", title: "Task 3", description: "Description 3", status: "Completed", priority: "High" },
    ]);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            {tasks.map((task) => (
                <Task key={task.id} title={task.title} description={task.description} status={task.status} priority={task.priority} />
            ))}
        </div>
    )
}

export default TaskManager
