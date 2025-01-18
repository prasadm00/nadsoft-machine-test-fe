import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const getStudents = async (page, limit) => {
  const response = await axios.get(`${API_BASE_URL}/students`, {
    params: { page, limit },
  });
  return response.data;
};

export const createStudent = async (data) => {
  return await axios.post(`${API_BASE_URL}/students`, data);
};

export const updateStudent = async (id, data) => {
  return await axios.patch(`${API_BASE_URL}/students/${id}`, data);
};

export const deleteStudent = async (id) => {
  return await axios.delete(`${API_BASE_URL}/students/${id}`);
};

export const getStudentById = async (data) => {
  return await axios.get(`${API_BASE_URL}/students/${data.id}`);
};
