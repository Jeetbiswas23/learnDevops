import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "/api/tasks";

const formatDate = (date) => {
  if (!date) return "Just now";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load tasks");
        setTasks(await response.json());
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((task) => !task.completed);
    if (filter === "completed") return tasks.filter((task) => task.completed);
    return tasks;
  }, [filter, tasks]);

  const addTask = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!response.ok) throw new Error("Could not create task");
      const task = await response.json();
      setTasks((currentTasks) => [task, ...currentTasks]);
      setTitle("");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) throw new Error("Could not update task");
      const updatedTask = await response.json();
      setTasks((currentTasks) => currentTasks.map((item) => item._id === updatedTask._id ? updatedTask : item));
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const saveEdit = async (task) => {
    if (!editingTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });
      if (!response.ok) throw new Error("Could not update task");
      const updatedTask = await response.json();
      setTasks((currentTasks) => currentTasks.map((item) => item._id === updatedTask._id ? updatedTask : item));
      setEditingId(null);
    } catch (editError) {
      setError(editError.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete task");
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="eyebrow"><span className="status-dot" /> Task workspace</div>
        <h1>Make room for<br /><em>good work.</em></h1>
        <p className="hero-copy">A calm place to capture the next thing, keep momentum, and see what is already done.</p>
        <div className="stats" aria-label="Task summary">
          <div><strong>{tasks.length}</strong><span>Total tasks</span></div>
          <div><strong>{completedCount}</strong><span>Completed</span></div>
          <div><strong>{tasks.length - completedCount}</strong><span>In progress</span></div>
        </div>
      </section>

      <section className="workspace">
        <form className="add-task" onSubmit={addTask}>
          <span className="plus">+</span>
          <input aria-label="New task title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs your attention?" />
          <button type="submit" disabled={saving || !title.trim()}>{saving ? "Adding..." : "Add task"}</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            {["all", "active", "completed"].map((item) => (
              <button key={item} type="button" className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <span className="task-count">{visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"}</span>
        </div>

        {error && <div className="error" role="alert">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error">x</button></div>}

        <div className="task-list">
          {loading && <div className="empty-state"><span className="loader" />Loading your tasks...</div>}
          {!loading && visibleTasks.length === 0 && <div className="empty-state"><span className="empty-icon">✓</span><strong>{filter === "all" ? "Your list is clear" : `No ${filter} tasks`}</strong><span>Start by adding something worth finishing.</span></div>}
          {visibleTasks.map((task, index) => (
            <article className={task.completed ? "task completed" : "task"} key={task._id} style={{ "--delay": `${index * 55}ms` }}>
              <button type="button" className="check" onClick={() => toggleTask(task)} aria-label={task.completed ? "Mark task active" : "Mark task complete"}>{task.completed ? "✓" : ""}</button>
              {editingId === task._id ? (
                <input className="edit-input" value={editingTitle} autoFocus onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveEdit(task)} onBlur={() => saveEdit(task)} aria-label="Edit task title" />
              ) : (
                <button type="button" className="task-title" onDoubleClick={() => { setEditingId(task._id); setEditingTitle(task.title); }}>{task.title}</button>
              )}
              <time dateTime={task.createdAt}>{formatDate(task.createdAt)}</time>
              <button type="button" className="delete" onClick={() => deleteTask(task._id)} aria-label={`Delete ${task.title}`}>x</button>
            </article>
          ))}
        </div>
        <p className="hint">Double-click a task name to edit it.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
