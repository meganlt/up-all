import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Grid
} from "@mui/material";

function EditWeeklyContent({
  weekData,
  onSave,
  onCancel,
  initialFormData = {
    quarter_title: '',
    week: '',
    theme: '',
    content: '',
    focus: ''
  }
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (weekData) {
      setFormData({
        quarter_title: weekData.quarter_title || '',
        week: weekData.week || '',
        theme: weekData.theme || '',
        content: weekData.content || '',
        focus: weekData.focus || ''
      });
    }
  }, [weekData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {weekData ? "Edit Weekly Content" : "Add New Weekly Content"}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quarter Title"
                name="quarter_title"
                value={formData.quarter_title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Week"
                name="week"
                value={formData.week}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Manager Weekly Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="This Week's Focus Content"
                name="focus"
                value={formData.focus}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ mt: 3, mb: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditWeeklyContent;