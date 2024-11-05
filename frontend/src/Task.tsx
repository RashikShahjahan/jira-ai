export type TaskData = {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed" | "Archived";
    priority: "LOW" | "MEDIUM" | "HIGH";
}

function Task({ title, description, status, priority }: TaskData) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "bg-red-100 text-red-800";
            case "MEDIUM": return "bg-yellow-100 text-yellow-800";
            case "LOW": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Archived": return "bg-gray-100 text-gray-800";
            default: return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(priority)}`}>
                    {priority}
                </span>
            </div>
            
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default Task