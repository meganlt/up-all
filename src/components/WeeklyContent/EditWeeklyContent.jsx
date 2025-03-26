import { useState, useEffect } from "react";

function EditWeeklyContent({ 
  weekData, 
  onSave, 
  onCancel,
  initialFormData = {
    title: '',
    theme: '',
    content: '',
    focus: ''
  }
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (weekData) {
      setFormData({
        title: weekData.title,
        theme: weekData.theme,
        content: weekData.content,
        focus: weekData.focus
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
    <div className="edit-weekly-content">
      <h1>Edit Weekly Content</h1>
      
      <form onSubmit={handleSubmit}>
        <label>Internal Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Theme:</label>
        <input
          type="text"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          required
        />

        <label>Manager Weekly Content:</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <label>This Week's Focus Content:</label>
        <textarea
          name="focus"
          value={formData.focus}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditWeeklyContent;