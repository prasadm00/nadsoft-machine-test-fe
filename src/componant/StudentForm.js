import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const StudentForm = ({ onSubmit, fetchStudents, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    date_of_birth: initialData?.date_of_birth || '',
    marks: initialData?.marks || [],
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      email: initialData?.email || '',
      date_of_birth: initialData?.date_of_birth || '',
      marks: initialData?.marks || [],
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMarkChange = (index, e) => {
    const { name, value } = e.target;

    if (name === 'marks') {
      const numericValue = parseInt(value);
      if (numericValue < 0 || numericValue > 100) {
        Swal.fire('Error', 'Marks must be between 0 and 100.', 'error');
        return;
      }
    }

    const newMarks = [...formData.marks];
    newMarks[index] = { ...newMarks[index], [name]: value };
    setFormData({ ...formData, marks: newMarks });
  };

  const handleAddMark = () => {
    setFormData({
      ...formData,
      marks: [...formData.marks, { subject: '', marks: '' }],
    });
  };

  const handleRemoveMark = (index) => {
    const newMarks = formData.marks.filter((_, i) => i !== index);
    setFormData({ ...formData, marks: newMarks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      Swal.fire('Success', 'Operation completed successfully!', 'success');
      await fetchStudents();
      window.location.reload();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name *
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email *
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="date_of_birth" className="form-label">
          Date of Birth *
        </label>
        <input
          type="date"
          className="form-control"
          id="date_of_birth"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      {/* Marks Section */}
      <div className="mb-3">
        <label htmlFor="marks" className="form-label">
          Marks
        </label>
        {formData.marks.map((mark, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Subject"
              name="subject"
              value={mark.subject}
              onChange={(e) => handleMarkChange(index, e)}
              required
            />
            <input
              type="number"
              className="form-control ms-2"
              placeholder="Marks"
              name="marks"
              value={mark.marks}
              min={0}
              max={100}
              onChange={(e) => handleMarkChange(index, e)}
              required
            />
            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={() => handleRemoveMark(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddMark}
        >
          Add Marks
        </button>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default StudentForm;
