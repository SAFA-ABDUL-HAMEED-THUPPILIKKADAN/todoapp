import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Todo.module.css";

const Todo = () => {
  const navigate = useNavigate();
  const [userTodos, setUserTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    deadline: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    isCompleted: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("loggedInUser");
    // if (!token || !user) {
    //   navigate("/login");
    //   return;
    // }
    setUsername(user);
    fetchTodos(token);
  }, []);

  const fetchTodos = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setUserTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const updateTodo = async () => {
    if (!currentTodo.title.trim() || !currentTodo.deadline.trim()) return;
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:8000/update/${currentTodo.id}`
        : "http://localhost:8000/create";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentTodo),
      });
      if (!response.ok) throw new Error("Failed to save todo");
      fetchTodos(token);
      cancelEdit();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      fetchTodos(token);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const markTodoDone = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: true,
          completedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      fetchTodos(token);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const categorizeTasks = () => {
    const now = new Date();
    const pending = [];
    const completedOnTime = [];
    const delayed = [];

    userTodos.forEach((todo) => {
      const deadline = new Date(todo.deadline);

      if (!todo.isCompleted) {
        if (deadline < now) {
          delayed.push(todo); // Task not completed and deadline has passed
        } else {
          pending.push(todo); // Task not completed but still within deadline
        }
      } else {
        const completedAt = new Date(todo.completedAt);

        if (completedAt <= deadline) {
          completedOnTime.push(todo); // Task was completed before or exactly at the deadline
        } else if (!todo.completedAt) {
          delayed.push(todo); // Edge case: completedAt is null
        } else if (deadline < now) {
          completedOnTime.push(todo); // ✅ FIX: Previously delayed task, now marked as done!
        } else {
          delayed.push(todo); // Completed after the deadline
        }
      }
    });

    return { pending, completedOnTime, delayed };
  };

  const { pending, completedOnTime, delayed } = categorizeTasks();

  return (
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.todo}>My Todos</h1>
        <h3>Logged in as: {username}</h3>
        <div>
          <input
            type="text"
            placeholder="Task Title"
            value={currentTodo.title}
            onChange={(e) =>
              setCurrentTodo({ ...currentTodo, title: e.target.value })
            }
            className={styles.title}
          />
          <input
            type="datetime-local"
            value={currentTodo.deadline}
            onChange={(e) =>
              setCurrentTodo({ ...currentTodo, deadline: e.target.value })
            }
            className={styles.title}
          />
          <button onClick={updateTodo} className={styles.btn1}>
            {isEditing ? "Update Todo" : "Add Todo"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}
            className={styles.btn5}
          >
            Logout
          </button>
        </div>
      </div>
      <div className={styles.tasksContainer}>
        <TaskList
          title="Pending Tasks"
          tasks={pending}
          onMarkDone={markTodoDone}
          onDelete={deleteTodo}
        />
        <TaskList title="Completed On Time" tasks={completedOnTime} />
        <TaskList
          title="Delayed Tasks"
          tasks={delayed}
          onMarkDone={markTodoDone}
        />
      </div>
    </>
  );
};

const TaskList = ({ title, tasks, onMarkDone, onDelete }) => (
  <div className={styles.tasks}>
    <h2 className={styles.heading}>{title}</h2>
    {tasks.map((todo) => (
      <div key={todo.id}>
        <p className={styles.miniTitle}>{todo.title}</p>
        <p className={styles.container}>
          Deadline: {new Date(todo.deadline).toLocaleString()}
        </p>
        {onMarkDone && (
          <button onClick={() => onMarkDone(todo.id)} className={styles.btn3}>
            Mark as Done
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(todo.id)} className={styles.btn4}>
            Delete
          </button>
        )}
      </div>
    ))}
  </div>
);

export default Todo;
