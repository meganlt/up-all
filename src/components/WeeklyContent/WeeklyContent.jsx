import axios from "axios";
import { useState, useEffect } from "react";

function WeeklyContent() {
  const [week, setWeek] = useState([]);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState("");
  const [editingId, setEditingId] = useState(null); // Track the id of the content being edited


  const fetchWeek = () => {
    axios
      .get("/api/week") 
      .then((response) => {
        if (Array.isArray(response.data)) {
          setWeek(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setWeek([]);
        }
      })
      .catch((err) => {
        console.error("ERROR fetching week:", err);
        alert("ERROR in fetchWeek: " + err.message);
      });
  };


  const deleteWeek = async (weekId) => {
    try {
    const response = await axios.delete(`/api/week/${weekId}`);

      setWeek(week.filter((w) => w.id !== weekId)); 
      alert("Week deleted successfully!");
    } catch (error) {
      console.error("Error deleting week:", error);
      alert("Failed to delete week.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWeekContent = { title, theme, content, focus };

    try {
      let response;
      if (editingId) {
        response = await axios.put(`/api/week/${editingId}`, newWeekContent); 
        setWeek(week.map((w) => (w.id === editingId ? response.data : w))); 
        alert("Week updated successfully!");
      } else {
        response = await axios.post("/api/week/add", newWeekContent);
        setWeek([response.data, ...week]); 
        alert("Week added successfully!");
      }

      // Reset form fields
      setTitle("");
      setTheme("");
      setContent("");
      setFocus("");
      setEditingId(null); // Clear the editing state
    } catch (error) {
      console.error("Error adding/updating week:", error);
      alert("Failed to add or update week.");
    }
  };

  const updateWeek = (weekId) => {
    const weekToEdit = week.find((w) => w.id === weekId);
    if (weekToEdit) {
      setEditingId(weekId); 
      setTitle(weekToEdit.title);
      setTheme(weekToEdit.theme);
      setContent(weekToEdit.content);
      setFocus(weekToEdit.focus);
    }
  };

  useEffect(() => {
    fetchWeek();
  }, []);

  return (
    <div className="WeeklyContent">
      <h1>{editingId ? "Edit" : "Add"} Weekly Content</h1>

      {/* Add New or Edit Weekly Content Form */}
      <form onSubmit={handleSubmit} className="add-week-form">
        <label>Internal Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Theme:</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
        />

        <label>Manager Weekly Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <label>This Week's Focus Content:</label>
        <textarea
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          required
        />

        <button type="submit">{editingId ? "Update Week" : "Add Week"}</button>
      </form>

      {/* Weekly Content Library */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Theme</th>
            <th>Details</th>
            <th>Focus</th>
            <th>Last Updated</th>
            <th>Actions</th> {/* Added actions column for edit and delete */}
          </tr>
        </thead>
        <tbody>
          {week.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{row.theme}</td>
              <td>{row.content}</td>
              <td>{row.focus}</td>
              <td>{new Date(row.updated_at).toLocaleString()}</td>
              <td>
                <button onClick={() => updateWeek(row.id)}>Edit</button>
                <button onClick={() => deleteWeek(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyContent;