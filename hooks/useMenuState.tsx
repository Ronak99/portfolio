"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MenuView = "nav" | "works";

type MenuStateContextValue = {
  isOpen: boolean;
  isClosing: boolean;
  view: MenuView;
  setIsOpen: (open: boolean) => void;
  setIsClosing: (closing: boolean) => void;
  setView: (view: MenuView) => void;
};

const MenuStateContext = createContext<MenuStateContextValue | null>(null);

export function MenuStateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [view, setView] = useState<MenuView>("nav");

  const value = useMemo(
    () => ({ isOpen, isClosing, view, setIsOpen, setIsClosing, setView }),
    [isOpen, isClosing, view]
  );

  return (
    <MenuStateContext.Provider value={value}>
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  const ctx = useContext(MenuStateContext);
  if (!ctx) {
    throw new Error("useMenuState must be used within MenuStateProvider");
  }
  return ctx;
}
