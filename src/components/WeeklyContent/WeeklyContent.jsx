import axios from "axios";
import { useState, useEffect } from "react";
import EditWeeklyContent from "./EditWeeklyContent";

function WeeklyContent() {
  const [week, setWeek] = useState([]);
  const [editingWeek, setEditingWeek] = useState(null);

  const fetchWeek = () => {
    axios.get("/api/week")
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
      await axios.delete(`/api/week/${weekId}`);
      setWeek(week.filter((w) => w.id !== weekId));
      alert("Week deleted successfully!");
    } catch (error) {
      console.error("Error deleting week:", error);
      alert("Failed to delete week.");
    }
  };

  const handleAddWeek = async (newWeekContent) => {
    try {
      const response = await axios.post("/api/week/add", newWeekContent);
      setWeek([response.data, ...week]);
      alert("Week added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding week:", error);
      alert("Failed to add week.");
      return false;
    }
  };

  const handleUpdateWeek = async (updatedData) => {
    try {
      const response = await axios.put(`/api/week/${editingWeek.id}`, updatedData);
      setWeek(week.map((w) => (w.id === editingWeek.id ? response.data : w)));
      setEditingWeek(null);
      alert("Week updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating week:", error);
      alert("Failed to update week.");
      return false;
    }
  };

  useEffect(() => {
    fetchWeek();
  }, []);

  return (
    <div className="WeeklyContent">
      {editingWeek ? (
        <EditWeeklyContent
          weekData={editingWeek}
          onSave={handleUpdateWeek}
          onCancel={() => setEditingWeek(null)}
        />
      ) : (
        <>
          <h1>Add Weekly Content</h1>
          <EditWeeklyContent
            onSave={handleAddWeek}
            onCancel={() => { }}
          />
        </>
      )}

      {/* Weekly Content Library */}
      <table>
        <thead>
          <tr>
            <th>Quarter Title</th> {/*changed from Title*/}
            <th>Week</th>
            <th>Theme</th>
            <th>Details</th>
            <th>Focus</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {week.map((row) => (
            <tr key={row.id}>
              <td>{row.quarter_title}</td>  {/* Changed from title */}
              <td>{row.week}</td>             {/* New field */}
              <td>{row.theme}</td>
              <td>{row.content}</td>
              <td>{row.focus}</td>
              <td>{new Date(row.updated_at).toLocaleString()}</td>
              <td>
                <button onClick={() => setEditingWeek(row)}>Edit</button>
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