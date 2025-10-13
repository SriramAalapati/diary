import React, { useEffect, useState } from "react";
import apiCaller from "/src/utils/apiCaller";
import Layout from "../../layout/Layout";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // State to hold the task object being edited. null for adding a new task.
  const [taskToEdit, setTaskToEdit] = useState(null); 
  
  // NOTE: This should come from a global state/context in a real app
  const userId = 1;

  // --- Core Data Fetching Function ---
  const getTasks = async () => {
    try {
      // API call expects userId in query params
      const response = await apiCaller(`/tasks/getTasks?userId=${userId}`);
      if (response.status === "Success") {
        setTasks(response.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // --- CRUD Handlers ---

  const handleEdit = (task) => {
    // Set the task data in state and open the modal
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      // API call expects {id} in the body for the backend deleteTask function
      const payload = { id: taskId };
      const response = await apiCaller("/tasks/deleteTask", payload, "DELETE");

      if (response.status === "Success") {
        alert("Task Deleted Successfully!");
        // Refresh the list after successful deletion
        getTasks();
      } else {
        alert(response.message || "Failed to delete task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Error deleting task. Check console.");
    }
  };
  
  // --- Modal Management ---

  const handleModalClose = () => {
    setShowModal(false);
    setTaskToEdit(null); // Clear the edit state
    getTasks(); // Refresh the task list after any modal action (add or update)
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    getTasks();
  }, [userId]);

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0 border-b-2 border-indigo-500 pb-1 inline-block">
            Task Dashboard 🚀
          </h1>
          <button
            onClick={() => {
                setTaskToEdit(null); // Ensure we're in 'Add' mode
                setShowModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-medium px-5 py-2 rounded-full text-sm shadow-md flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add New Task
          </button>
        </div>

        {/* Metrics Section (Unchanged) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard name="Total Tasks" value={tasks.length} icon="list" />
          <MetricCard
            name="High Priority"
            value={tasks.filter((t) => t.priority > 7).length}
            icon="arrow-up"
            color="red"
          />
          <MetricCard
            name="Medium Priority"
            value={tasks.filter((t) => t.priority >= 4 && t.priority <= 7).length}
            icon="minus"
            color="yellow"
          />
          <MetricCard
            name="Low Priority"
            value={tasks.filter((t) => t.priority < 4).length}
            icon="arrow-down"
            color="green"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {["No", "Task", "Priority", "Action"].map((col, i) => (
                  <th key={i} className="px-5 py-3 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-500 font-medium text-sm"
                  >
                    🎉 All caught up! No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task, i) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150"
                  >
                    <td className="px-5 py-3 text-gray-700 w-12 text-sm">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-medium text-sm">
                      {task.task}
                    </td>
                    <td className="px-5 py-3 w-32">
                        <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-5 py-3 w-28">
                      <div className="flex space-x-2">
                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => handleEdit(task)} // Pass the task object for editing
                          title="Edit Task"
                          className="text-blue-500 hover:text-blue-700 p-1 transition-colors rounded-full hover:bg-blue-100"
                        >
                          <i className="fa-solid fa-pen text-sm"></i>
                        </button>
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(task.id)} // Pass the task ID for deletion
                          title="Delete Task"
                          className="text-red-500 hover:text-red-700 p-1 transition-colors rounded-full hover:bg-red-100"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Pass relevant props for Add/Edit mode */}
        {showModal && (
          <TaskModal 
            onClose={handleModalClose} 
            initialData={taskToEdit} // Pass existing data for editing
            userId={userId}
          />
        )}
      </div>
    </Layout>
  );
};

// ===================================
// Helper Components (Keep these definitions external or in separate files)
// ===================================

// --- PRIORITY BADGE ---
function PriorityBadge({ priority }) {
    let colorClass;
    let text;
    if (priority > 7) {
        colorClass = "bg-red-100 text-red-700";
        text = `High (${priority})`;
    } else if (priority >= 4) {
        colorClass = "bg-yellow-100 text-yellow-700";
        text = `Medium (${priority})`;
    } else {
        colorClass = "bg-green-100 text-green-700";
        text = `Low (${priority})`;
    }

    return (
        <span
            className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${colorClass}`}
        >
            {text}
        </span>
    );
}

// --- METRIC CARD ---
function MetricCard({ name, icon, value, color = "indigo" }) {
    const iconClasses = {
        list: "fa-solid fa-list-ul",
        "arrow-up": "fa-solid fa-fire",
        "arrow-down": "fa-solid fa-seedling",
        minus: "fa-solid fa-clipboard-check",
    };

    const colorMap = {
        indigo: "bg-indigo-500",
        red: "bg-red-500",
        yellow: "bg-yellow-500",
        green: "bg-green-500",
    };

    return (
        <div className="bg-white p-5 flex items-start space-x-4 border border-gray-200 rounded-xl transition duration-300 hover:shadow-lg">
            <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${colorMap[color]}`}>
                <i className={`${iconClasses[icon]} text-white text-xl`} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-0.5">{name}</p>
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
            </div>
        </div>
    );
}


// --- TASK MODAL (Updated for Add/Edit) ---
function TaskModal({ onClose, initialData, userId }) {
  const isEditMode = !!initialData; // Determine if we are editing or adding

  const [formData, setFormData] = useState(
    initialData || { task: "", priority: 9 }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) : value,
    }));
  }

  async function handleSubmit() {
    if (!formData.task.trim()) {
        alert("Task description cannot be empty.");
        return;
    }

    setIsSubmitting(true);
    
    // Payload structure depends on Add vs. Update
    let payload = {
        task: formData.task,
        priority: formData.priority,
    };
    let url, method, successMessage;

    if (isEditMode) {
      // Backend expects {id, task, priority} for updateTask
      url = "/tasks/updateTask";
      method = "PUT"; 
      payload = { ...payload, id: initialData.id };
      successMessage = "Task Updated Successfully!";
    } else {
      // Backend expects {task, userId, priority} for addTask
      url = "/tasks/addTask";
      method = "POST";
      payload = { ...payload, userId: userId };
      successMessage = "Task Added Successfully!";
    }

    try {
      const response = await apiCaller(url, payload, method);
      
      if (response.status === "Success") {
        alert(successMessage);
        onClose(); // Close modal and refresh parent data
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'add'} task.`);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} task:`, err);
      alert(`Error ${isEditMode ? 'updating' : 'adding'} task: ${err.message || 'Check console.'}`);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
          {isEditMode ? "Edit Task" : "Add New Task"} 📝
        </h1>

        <div className="mb-4">
            <label htmlFor="task" className="block mb-1 text-sm font-medium text-gray-700">
                Task Description
            </label>
            <textarea
              id="task"
              className="border border-gray-300 w-full p-3 rounded-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
              rows={4}
              placeholder="E.g., Finalize Q3 budget report..."
              name="task"
              value={formData.task}
              onChange={handleChange}
              disabled={isSubmitting}
            />
        </div>

        <div className="mb-6">
            <label htmlFor="priority" className="block mb-1 text-sm font-medium text-gray-700">
              Priority (10 = Highest)
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition"
              disabled={isSubmitting}
            >
              {[...Array(10).keys()]
                .map((i) => 10 - i)
                .map((num) => (
                  <option value={num} key={num}>
                    {num} - {num > 7 ? 'High' : num >= 4 ? 'Medium' : 'Low'}
                  </option>
                ))}
            </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
              <i className="fa-solid fa-check mr-2"></i>
          )}
          {isSubmitting ? 
             (isEditMode ? "Updating Task..." : "Adding Task...") 
             : 
             (isEditMode ? "Confirm Update Task" : "Confirm Add Task")
          }
        </button>
      </div>
    </div>
  );
}

export default Tasks;