import React, { useEffect, useState } from 'react';
import StudentForm from './componant/StudentForm';
import StudentList from './componant/StudentList';
import {
  createStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from './services/api';
function App() {
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleSubmit = async (data) => {
    if (editingStudent) {
      return updateStudent(editingStudent.id, data).then(() => {
        setEditingStudent(null);
        fetchStudents();
      });
    }
    return createStudent(data).then(() => fetchStudents());
  };

  const handleEdit = async (studentId) => {
    try {
      const response = await getStudentById(studentId);
      response.data.date_of_birth = response.data.date_of_birth.split('T')[0];
      setEditingStudent(response.data);
    } catch (error) {
      console.error('Failed to fetch student for editing:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Nadsoft Machine Test</h1>
      <StudentForm
        onSubmit={handleSubmit}
        fetchStudents={fetchStudents}
        initialData={editingStudent || {}}
      />
      <StudentList
        students={students}
        onEdit={handleEdit}
        fetchStudents={fetchStudents}
      />
    </div>
  );
}

export default App;
