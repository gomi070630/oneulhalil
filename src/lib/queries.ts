import { queryOptions } from "@tanstack/react-query";
import { listCategories } from "./categories.functions";
import { listTasks } from "./tasks.functions";
import { listRoutines } from "./routines.functions";

export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: () => listCategories() });

export const tasksQuery = () =>
  queryOptions({ queryKey: ["tasks"], queryFn: () => listTasks() });

export const routinesQuery = () =>
  queryOptions({ queryKey: ["routines"], queryFn: () => listRoutines() });
