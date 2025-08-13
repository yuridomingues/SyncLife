import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const listRoutinesByDay = (day_of_week: number) =>
  api.get(`/routines?day_of_week=${day_of_week}`).then(r => r.data);

export const createRoutine = (data: any) =>
  api.post(`/routines`, data).then(r => r.data);

export const updateRoutine = (id: number, data: any) =>
  api.put(`/routines/${id}`, data).then(r => r.data);

export const deleteRoutine = (id: number) =>
  api.delete(`/routines/${id}`);

export const createEvent = (data: any) =>
  api.post(`/calendar/events`, data).then(r => r.data);

export const eventsForYear = (year: number) =>
  api.get(`/calendar/events/year/${year}`).then(r => r.data);

export const cdiProjection = (payload: {
  principal: number; months: number; cdi_annual_rate: number; percent_of_cdi: number;
}) => api.post(`/finance/cdi-projection`, payload).then(r => r.data);

export default api;
