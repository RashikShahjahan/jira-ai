import { useState } from "react";
import Task, { TaskData } from "./Task";

function TaskManager() {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    return (
        <div>
            <h1>Task Manager</h1>
            {tasks.map((task) => (
                <Task key={task.id} title={task.title} description={task.description} status={task.status} priority={task.priority} />
            ))}
        </div>
    )
}

export default TaskManager
