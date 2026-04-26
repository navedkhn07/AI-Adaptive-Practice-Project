import api from "./client";

export const startSession = async (payload) => {
  const { data } = await api.post("/sessions/start", payload);
  return data;
};

export const submitSingleAnswer = async (payload) => {
  const { data } = await api.post("/sessions/answer", payload);
  return data;
};

export const submitSession = async (payload) => {
  const { data } = await api.post("/sessions/submit", payload);
  return data;
};

export const getSessionHistory = async (studentId) => {
  const { data } = await api.get(`/sessions/history/${studentId}`);
  return data;
};
