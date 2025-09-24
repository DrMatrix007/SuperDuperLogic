import { useState, MouseEvent } from "react";

export interface ContextMenuState {
  x: number;
  y: number;
  data?: any; // optional, can store edgeId, nodeId, etc.
}
export function useContextMenu<T = any>() {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const openContextMenu = (e: MouseEvent, data?: T) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, data });
    e.stopPropagation();
  };

  const closeContextMenu = () => setMenu(null);

  return {
    menu,
    openContextMenu,
    closeContextMenu,
  };
}
