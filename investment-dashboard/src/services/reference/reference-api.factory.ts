import { api } from "@/utils/fetch.utils";
import type {
  CreateReferenceRequestDto,
  UpdateReferenceLabelRequestDto,
} from "@investments/shared";

/** CRUD générique pour un référentiel exposé par l'API sous `url`. */
export const createReferenceApi = <TResponse>(url: string) => ({
  getAll: () => api<TResponse[]>("GET", url),
  create: (payload: CreateReferenceRequestDto) =>
    api<TResponse>("POST", url, payload),
  update: (id: number, payload: UpdateReferenceLabelRequestDto) =>
    api<TResponse>("PATCH", `${url}/${id}`, payload),
  remove: (id: number) => api<void>("DELETE", `${url}/${id}`),
});
