"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

type DemoRole = "client" | "advisor";

interface DemoContextValue {
  isDemoMode: boolean;
  demoRole: DemoRole | null;
  enterClientDemo: () => void;
  enterAdminDemo: () => void;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextValue>({
  isDemoMode: false,
  demoRole: null,
  enterClientDemo: () => {},
  enterAdminDemo: () => {},
  exitDemo: () => {},
});

const COOKIE_NAME = "demo_mode";

function getCookieValue(): DemoRole | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;
  const val = match[1] as string;
  return val === "client" || val === "advisor" ? val : null;
}

function setCookie(role: DemoRole) {
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=86400; SameSite=Strict`;
}

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

let listeners: Array<() => void> = [];
let snapshot: DemoRole | null = null;

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  const current = getCookieValue();
  if (current !== snapshot) snapshot = current;
  return snapshot;
}

function getServerSnapshot() {
  return null;
}

function notifyListeners() {
  snapshot = getCookieValue();
  listeners.forEach((l) => l());
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const demoRole = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const enterClientDemo = useCallback(() => {
    setCookie("client");
    notifyListeners();
    router.push("/");
  }, [router]);

  const enterAdminDemo = useCallback(() => {
    setCookie("advisor");
    notifyListeners();
    router.push("/admin");
  }, [router]);

  const exitDemo = useCallback(() => {
    const wasRole = getCookieValue();
    clearCookie();
    notifyListeners();
    router.push(wasRole === "advisor" ? "/admin/login" : "/login");
  }, [router]);

  const value = useMemo<DemoContextValue>(
    () => ({
      isDemoMode: demoRole !== null,
      demoRole,
      enterClientDemo,
      enterAdminDemo,
      exitDemo,
    }),
    [demoRole, enterClientDemo, enterAdminDemo, exitDemo]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoMode() {
  return useContext(DemoContext);
}
