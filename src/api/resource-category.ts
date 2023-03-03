import client from "./internal/httpClient";

export function resourceCategoryList(type: string) {
  return client.get("/backend/v1/resource-category/index", { type });
}

export function createResourceCategory() {
  return client.get("/backend/v1/resource-category/create", {});
}

export function storeResourceCategory(
  type: string,
  name: string,
  sort: number
) {
  return client.post("/backend/v1/resource-category/create", {
    type,
    name,
    sort,
  });
}

export function resourceCategory(id: number) {
  return client.get(`/backend/v1/resource-category/${id}`, {});
}

export function updateResourceCategory(
  id: number,
  type: string,
  name: string,
  sort: number
) {
  return client.post(`/backend/v1/resource-category/${id}`, {
    type,
    name,
    sort,
  });
}

export function destroyResourceCategory(id: number) {
  return client.destroy(`/backend/v1/resource-category/${id}`);
}