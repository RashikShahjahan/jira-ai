import { useState } from "react";
import Task, { TaskData } from "./Task";

function TaskManager() {
    const [tasks, setTasks] = useState<TaskData[]>([
        { id: "1", title: "Task 1", description: "Description of task 1 jkj", status: "Pending", priority: "Low" },
        { id: "2", title: "Task 2", description: "Description 2", status: "In Progress", priority: "Medium" },
        { id: "3", title: "Task 3", description: "Description 3", status: "Completed", priority: "High" },
    ]);
    return (
        <div className="flex flex-col w-1/2 h-screen p-4 border-r">
            <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
            <div className="flex-grow overflow-y-auto">
                {tasks.map((task) => (
                    <Task key={task.id} title={task.title} description={task.description} status={task.status} priority={task.priority} />
                ))}
            </div>
        </div>
    )
}

export default TaskManager
