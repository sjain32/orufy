import api from "./api";

export const getAdminProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const togglePublishProduct = async (id) => {
  const res = await api.patch(`/products/${id}/toggle-publish`);
  return res.data;
};
