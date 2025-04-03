import axios from "axios";
import { useState, useEffect } from "react";
import EditWeeklyContent from "./EditWeeklyContent";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  Container
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

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
    if (!window.confirm("Are you sure you want to delete this week?")) return;
    
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {editingWeek ? (
        <EditWeeklyContent
          weekData={editingWeek}
          onSave={handleUpdateWeek}
          onCancel={() => setEditingWeek(null)}
        />
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Add Weekly Content
          </Typography>
          <EditWeeklyContent 
            onSave={handleAddWeek}
            onCancel={() => {}} 
          />
        </>
      )}

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Weekly Content Library
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="weekly content table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quarter Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Week</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Theme</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Details</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Focus</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Updated</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {week.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.quarter_title}</TableCell>
                <TableCell>{row.week}</TableCell>
                <TableCell>{row.theme}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{row.content}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{row.focus}</TableCell>
                <TableCell>
                  {new Date(row.updated_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => setEditingWeek(row)}
                    aria-label="edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => deleteWeek(row.id)}
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default WeeklyContent;