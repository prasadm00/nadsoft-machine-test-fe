import React, { useEffect, useState } from 'react';
import { getStudents, deleteStudent } from '../services/api';
import Swal from 'sweetalert2';

const StudentList = ({ onEdit }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await getStudents(page, 5);
      setStudents(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to fetch students.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStudent(id);
          Swal.fire('Deleted!', 'Student has been deleted.', 'success');
          setPage(1);
          fetchStudents()
        } catch (error) {
          Swal.fire(
            'Error',
            error.message || 'Failed to delete student.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading students...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID (Last 5 Digits)</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students?.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id.slice(-5)}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{calculateAge(student.date_of_birth)}</td>
                    <td>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => onEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-3 d-flex justify-content-between">
            <div className="d-flex">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="btn btn-secondary me-2"
              >
                First
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-secondary"
              >
                Previous
              </button>
            </div>
            <div className="d-flex align-items-center">
              <span>
                Page {page} of {totalPages}
              </span>
            </div>
            <div className="d-flex">
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                className="btn btn-secondary me-2"
              >
                Next
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(totalPages)}
                className="btn btn-secondary"
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
