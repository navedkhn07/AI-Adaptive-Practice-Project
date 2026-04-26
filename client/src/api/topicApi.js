import api from "./client";

export const getTopics = async () => {
  const { data } = await api.get("/topics");
  return data;
};

export const addTopic = async (payload) => {
  const { data } = await api.post("/topics", payload);
  return data;
};

export const removeTopic = async (id) => {
  const { data } = await api.delete(`/topics/${id}`);
  return data;
};
