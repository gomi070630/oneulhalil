import { createContext, useContext, useEffect, useState } from "react";

export type Category = {
  id: string;
  name: string;
  color: string;
  is_default: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  due_date: string;
  estimated_minutes: number;
  progress: number;
  checklist?: { id: string; text: string; completed: boolean }[];
  completed: boolean;
  created_at: string;
};

export type Routine = {
  id: string;
  title: string;
  category_id: string | null;
  repeat_type: "daily" | "weekday" | "weekend" | "custom";
  repeat_days: number[];
  start_time: string | null;
  active: boolean;
  completed_dates: string[];
  created_at: string;
};

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const today = new Date();

const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "국어", color: "#fda4af", is_default: true },
  { id: "cat-2", name: "수학", color: "#93c5fd", is_default: true },
  { id: "cat-3", name: "영어", color: "#fde047", is_default: true },
  { id: "cat-4", name: "과학", color: "#fdba74", is_default: true },
  { id: "cat-5", name: "사회", color: "#86efac", is_default: true },
  { id: "cat-6", name: "역사", color: "#fca5a5", is_default: true },
  { id: "cat-7", name: "체육", color: "#c4b5fd", is_default: true },
  { id: "cat-8", name: "미술", color: "#67e8f9", is_default: true },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "수학 수행평가 준비",
    description: "삼각함수 단원 정리 및 연습문제 풀이",
    category_id: "cat-2",
    due_date: toISO(new Date(today.getFullYear(), today.getMonth(), 10)),
    estimated_minutes: 180,
    progress: 40,
    checklist: [],
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "영어 단어 시험",
    description: "3학년 1학기 1~5과 단어 암기",
    category_id: "cat-3",
    due_date: toISO(new Date(today.getFullYear(), today.getMonth(), 7)),
    estimated_minutes: 120,
    progress: 0,
    checklist: [],
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "과학 실험 보고서",
    description: "화학 반응 실험 결과 정리 및 분석",
    category_id: "cat-4",
    due_date: toISO(new Date(today.getFullYear(), today.getMonth(), 12)),
    estimated_minutes: 240,
    progress: 20,
    checklist: [],
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "역사 독후감 제출",
    description: "조선시대 문화 관련 독후감 800자",
    category_id: "cat-6",
    due_date: toISO(new Date(today.getFullYear(), today.getMonth(), 15)),
    estimated_minutes: 90,
    progress: 0,
    checklist: [],
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "사회 조사 발표 준비",
    description: "지역 환경 문제 조사 및 PPT 제작",
    category_id: "cat-5",
    due_date: toISO(new Date(today.getFullYear(), today.getMonth(), 9)),
    estimated_minutes: 300,
    progress: 60,
    checklist: [],
    completed: false,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_ROUTINES: Routine[] = [
  {
    id: "routine-1",
    title: "영단어 50개 암기",
    category_id: "cat-3",
    repeat_type: "daily",
    repeat_days: [],
    start_time: "07:00",
    active: true,
    completed_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "routine-2",
    title: "수학 문제 풀이",
    category_id: "cat-2",
    repeat_type: "weekday",
    repeat_days: [],
    start_time: "18:00",
    active: true,
    completed_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "routine-3",
    title: "독서 30분",
    category_id: "cat-1",
    repeat_type: "daily",
    repeat_days: [],
    start_time: "21:00",
    active: true,
    completed_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "routine-4",
    title: "과학 복습",
    category_id: "cat-4",
    repeat_type: "custom",
    repeat_days: [2, 4, 6],
    start_time: "19:30",
    active: true,
    completed_dates: [],
    created_at: new Date().toISOString(),
  },
];

type Store = {
  categories: Category[];
  tasks: Task[];
  routines: Routine[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
};

const MockContext = createContext<Store | null>(null);

const STORAGE_PREFIX = "student-ai-planner:mock:";
const CATEGORIES_KEY = STORAGE_PREFIX + "categories";
const TASKS_KEY = STORAGE_PREFIX + "tasks";
const ROUTINES_KEY = STORAGE_PREFIX + "routines";

function isLocalStorageAvailable() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isLocalStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    // If parsing fails, fall back to defaults
    // eslint-disable-next-line no-console
    console.error("Failed to load from localStorage:", key, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to save to localStorage:", key, e);
  }
}

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(CATEGORIES_KEY, INITIAL_CATEGORIES)
  );

  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>(TASKS_KEY, INITIAL_TASKS)
  );

  const [routines, setRoutines] = useState<Routine[]>(() =>
    loadFromStorage<Routine[]>(ROUTINES_KEY, INITIAL_ROUTINES)
  );

  // Persist categories when they change
  useEffect(() => {
    saveToStorage(CATEGORIES_KEY, categories);
  }, [categories]);

  // Persist tasks when they change
  useEffect(() => {
    saveToStorage(TASKS_KEY, tasks);
  }, [tasks]);

  // Persist routines when they change
  useEffect(() => {
    saveToStorage(ROUTINES_KEY, routines);
  }, [routines]);

  return (
    <MockContext.Provider
      value={{ categories, tasks, routines, setCategories, setTasks, setRoutines }}
    >
      {children}
    </MockContext.Provider>
  );
}

export function useMockStore() {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error("useMockStore must be used within MockProvider");
  return ctx;
}
