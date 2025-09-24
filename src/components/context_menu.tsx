"use client";

import React, { ReactNode } from "react";
import { ContextMenuState } from "./use_context_menu";

interface ContextMenuProps {
    data: ContextMenuState | null;
    onClose: ()=>void;
    children: ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    data,
    children,
    onClose: close
}) => {
    return data && (

        <div
            style={{
                position: "fixed",
                top: data?. y,
                left: data?.x,
                background: "#333",
                color: "#fff",
                border: `1px solid ${"#555"}`,
                borderRadius: 4,
                padding: "4px",
                zIndex: 1000,
                minWidth: 150,
            }}
            onMouseLeave={close}
        >
            {children}
        </div>
    );
};
