export type SubTask = { id?: number; title: string; order_index?: number; };
export type Routine = {
  id?: number;
  day_of_week: number; // 0..6 (0=Seg ... 6=Dom)
  time_str: string;    // "HH:MM"
  title: string;
  notes?: string | null;
  subtasks: SubTask[];
};

export type CalendarEvent = {
  id?: number;
  date: string; // "YYYY-MM-DD"
  title: string;
  description?: string | null;
  repeat_yearly: boolean;
};
