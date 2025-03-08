import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState(""); // state for task input
  const [filter, setFilter] = useState("all"); // state for filter
  const [editingTaskId, setEditingTaskId] = useState(null); // state for editing task
  const [editText, setEditText] = useState(""); // state for editing text
  const [deletingTaskId, setDeletingTaskId] = useState(null); // Track task being deleted

  // Load tasks from local storage when program starts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to localStorage
    }
  }, [tasks]);

  // Function to add task
  const addTask = () => {
    if (taskInput.trim() !== "") {
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      setTasks([...tasks, newTask]);
      setTaskInput("");
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task with animation
  const deleteTask = (id) => {
    // Set deleting state
    setDeletingTaskId(id);
    
    // Delay to match the animation
    setTimeout(() => {
      // Remove task from the tasks array
      const updatedTasks = tasks.filter((task) => task.id !== id);
  
      // Update the tasks state with the remaining tasks
      setTasks(updatedTasks);
  
      // Save the updated tasks to localStorage
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  
      // Reset the deleting state
      setDeletingTaskId(null);
    }, 300); // Delay to match fade-out animation time
  };

  // Function to clear all completed tasks
  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Function to filter tasks
  const getFilteredTasks = () => {
    if (filter === "active") return tasks.filter((task) => !task.completed);
    if (filter === "completed") return tasks.filter((task) => task.completed);
    return tasks;
  };

  // Function to enable edit mode
  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditText(text);
  };

  //function to save edited task
  const saveTask = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editText } : task))
    );
    setEditingTaskId(null);
    setEditText("");
  };

  //Function to cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="app-container">
      <h1>Task Manager</h1>

      {/* Task Input Form */}
      <div className="task-form">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filter Buttons */}
      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active-filter" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter === "active" ? "active-filter" : ""}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active-filter" : ""}
        >
          Completed
        </button>
      </div>

      {/* Clear Completed Tasks Button */}
      <button
        onClick={clearCompletedTasks}
        className="clear-completed"
        disabled={tasks.every((task) => !task.completed)}
      >
        Clear Completed Tasks
      </button>

      {/* Display tasks based on filter */}
      <ul className="task-list">
        {getFilteredTasks().map((task, index) => (
          <li
            key={task.id}
            className={`${task.completed ? "completed" : ""} 
                  ${deletingTaskId === task.id ? "deleted" : ""}`}
          >
            <div className={`task-item-container`}>
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    onClick={() => saveTask(task.id)}
                    className="edit-button"
                  >
                    Save
                  </button>
                  <button onClick={cancelEditing} className="edit-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    onClick={() => toggleTaskCompletion(task.id)}
                    style={{
                      cursor: "pointer",
                      color: task.completed ? "gray" : "black",
                    }}
                  >
                    {task.completed ? "✅ " : "⬜"}
                    {task.text}
                  </span>
                  <div className="task-buttons">
                    <button
                      onClick={() => startEditing(task.id, task.text)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
