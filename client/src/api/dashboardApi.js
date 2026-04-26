import api from "./client";

export const getStudentDashboard = async (id) => {
  const { data } = await api.get(`/dashboard/student/${id}`);
  return data;
};

export const getTeacherDashboard = async () => {
  const { data } = await api.get("/dashboard/teacher");
  return data;
};
