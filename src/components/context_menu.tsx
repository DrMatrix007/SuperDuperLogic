import React from "react";
import { useContextMenu } from "@/hooks/use_context_menu";

type ContextMenuProps = {
  menu: ReturnType<typeof useContextMenu<any>>;
  children: React.ReactNode;
};

export function ContextMenu({ menu, children }: ContextMenuProps) {
  if (!menu.state.visible) return null;

  return (
    <div
      className="absolute bg-gray-800 text-white rounded shadow-lg z-50"
      style={{
        top: menu.state.y,
        left: menu.state.x,
        minWidth: "140px",
      }}
    >
      {children}
    </div>
  );
}
