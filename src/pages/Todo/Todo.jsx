import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./Todo.module.css";

const Todo = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );

  const [userTodos, setUserTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState({
    id: uuidv4(),
    title: "",
    deadline: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    isCompleted: false,
  });
  const [previousTodo, setPreviousTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("loggedInUser")) {
      navigate("/login");
    }

    const todoData = JSON.parse(localStorage.getItem("todoData")) || {};
    const localUserTodos = todoData[currentUser.email] || [];
    setUserTodos(localUserTodos);
  }, []);

  // const updateTodo = () => {
  //   if (currentTodo.title.trim() === "" || currentTodo.deadline.trim() === "")
  //     return;

  //   let updatedTodos;
  //   const todoData = JSON.parse(localStorage.getItem("todoData"));

  //   if (isEditing) {
  //     updatedTodos = userTodos.map((todo) =>
  //       todo.id === currentTodo.id
  //         ? {
  //             ...todo,
  //             title: currentTodo.title,
  //             deadline: currentTodo.deadline,
  //           }
  //         : todo
  //     );
  //     setIsEditing(false);
  //   } else {
  //     updatedTodos = [...userTodos, currentTodo];
  //   }

  //   localStorage.setItem("todoData", JSON.stringify(todoData));
  //   setUserTodos(updatedTodos);
  //   todoData[currentUser.email] = updatedTodos;

  //   setCurrentTodo({
  //     id: uuidv4(),
  //     title: "",
  //     deadline: "",
  //     createdAt: new Date().toISOString(),
  //     completedAt: null,
  //     isCompleted: false,
  //   });
  //   setPreviousTodo(null);
  // };

  const updateTodo = () => {
    if (currentTodo.title.trim() === "" || currentTodo.deadline.trim() === "")
      return;

    const todoData = JSON.parse(localStorage.getItem("todoData")) || {};
    let updatedTodos;

    if (isEditing) {
      // Update the specific todo
      updatedTodos = userTodos.map((todo) =>
        todo.id === currentTodo.id
          ? {
              ...todo,
              title: currentTodo.title,
              deadline: currentTodo.deadline,
            }
          : todo
      );
      setIsEditing(false);
    } else {
      // Add new todo
      updatedTodos = [...userTodos, currentTodo];
    }

    // Update the todoData for the current user
    todoData[currentUser.email] = updatedTodos;

    // Save updated todos in localStorage
    localStorage.setItem("todoData", JSON.stringify(todoData));

    // Update the state
    setUserTodos(updatedTodos);
    setCurrentTodo({
      id: uuidv4(),
      title: "",
      deadline: "",
      createdAt: new Date().toISOString(),
      completedAt: null,
      isCompleted: false,
    });
    setPreviousTodo(null);
  };

  const editTodo = (id) => {
    const todoToEdit = userTodos.find((todo) => todo.id === id);
    setPreviousTodo({ ...todoToEdit });
    setCurrentTodo(todoToEdit);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (previousTodo) {
      setCurrentTodo(previousTodo);
      setPreviousTodo(null);
    }
    setIsEditing(false);
  };

  const deleteTodo = (id) => {
    const updatedTodos = userTodos.filter((todo) => todo.id !== id);
    const todoData = JSON.parse(localStorage.getItem("todoData"));
    todoData[currentUser.email] = updatedTodos;
    localStorage.setItem("todoData", JSON.stringify(todoData));
    setUserTodos(updatedTodos);
  };

  const markTodoDone = (id) => {
    const updatedTodos = userTodos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          }
        : todo
    );

    const todoData = JSON.parse(localStorage.getItem("todoData"));
    todoData[currentUser.email] = updatedTodos;
    localStorage.setItem("todoData", JSON.stringify(todoData));
    setUserTodos(updatedTodos);
  };

  const categorizeTasks = () => {
    const now = new Date();
    const pending = [];
    const completedOnTime = [];
    const delayed = [];

    userTodos.forEach((todo) => {
      if (!todo.isCompleted) {
        pending.push(todo);
      } else {
        const deadline = new Date(todo.deadline);
        const completedAt = new Date(todo.completedAt);
        if (completedAt <= deadline) {
          completedOnTime.push(todo);
        } else {
          delayed.push(todo);
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
          {isEditing && (
            <button
              onClick={cancelEdit}
              style={{ marginLeft: "10px" }}
              className={styles.btn1}
            >
              Undo
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "50px",
        }}
      >
        <div className={styles.tasks}>
          <h2 className={styles.heading}>Pending Tasks</h2>
          {pending.map((todo) => (
            <div key={todo.id}>
              <div className={styles.tasks1}>
                <p className={styles.miniTitle}>{todo.title}</p>
                <p className={styles.container}>
                  Deadline: {new Date(todo.deadline).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => markTodoDone(todo.id)}
                className={styles.btn3}
              >
                Mark as Done
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className={styles.btn4}
              >
                Delete
              </button>
              <button onClick={() => editTodo(todo.id)} className={styles.btn2}>
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className={styles.tasks}>
          <h2 className={styles.heading}>Completed On Time</h2>
          {completedOnTime.map((todo) => (
            <div key={todo.id}>
              <p className={styles.miniTitle}>{todo.title}</p>
              <p className={styles.container}>
                Completed At: {new Date(todo.completedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.tasks}>
          <h2 className={styles.heading}>Delayed Tasks</h2>
          {delayed.map((todo) => (
            <div key={todo.id}>
              <p className={styles.miniTitle}>{todo.title}</p>
              <div className={styles.miniContainer}>
                <p className={styles.container}>
                  Completed At: {new Date(todo.completedAt).toLocaleString()}
                </p>
                <p className={styles.container}>
                  Deadline: {new Date(todo.deadline).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
