export type TaskData = {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed" | "Archived";
    priority: "Low" | "Medium" | "High";
}

function Task() {
    return (
        <div>
            <h1>Task</h1>
        </div>
    )
}

export default Task