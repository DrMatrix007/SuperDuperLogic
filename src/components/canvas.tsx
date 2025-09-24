"use client";

import React, { useState, useRef } from "react";
import { Step } from "@/structs/step";
import { PrimitiveStep } from "@/structs/primitve_step";
import { Side } from "@/structs/side";
import { StepDescriptorData } from "@/structs/step_descriptor";
import { ContextMenu } from "./context_menu";
import { useContextMenu } from "./use_context_menu";

interface NodeData {
  step: Step;
  x: number;
  y: number;
}

interface EdgeData {
  id: string;
  fromNode: string;
  fromSide: Side;
  toNode: string;
  toSide: Side;
}

interface StepFlowProps {
  steps: Step[];
  darkMode?: boolean;
}

export default function Canvas({ steps: initialSteps, darkMode = true }: StepFlowProps) {
  const [nodes, setNodes] = useState<NodeData[]>(() =>
    initialSteps.map((s, i) => ({ step: s, x: 100 + i * 150, y: 100 + i * 100 }))
  );
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [draggingNode, setDraggingNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [creatingEdge, setCreatingEdge] = useState<{ fromNode: string; fromSide: Side; x: number; y: number } | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const nodeMenu = useContextMenu();
  const edgeMenu = useContextMenu<string>();

  const onMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find((n) => n.step.id() === nodeId);
    if (!node) return;
    setDraggingNode({ id: nodeId, offsetX: e.clientX - node.x, offsetY: e.clientY - node.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes((prev) =>
        prev.map((n) =>
          n.step.id() === draggingNode.id
            ? { ...n, x: e.clientX - draggingNode.offsetX, y: e.clientY - draggingNode.offsetY }
            : n
        )
      );
    }
    if (creatingEdge) {
      setCreatingEdge({ ...creatingEdge, x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = () => {
    setDraggingNode(null);
    setCreatingEdge(null);
  };

  const startEdge = (fromNode: string, fromSide: Side) => {
    setCreatingEdge({ fromNode, fromSide, x: 0, y: 0 });
  };

  const completeEdge = (toNode: string, toSide: Side) => {
    if (!creatingEdge) return;
    const fromNodeObj = nodes.find((n) => n.step.id() === creatingEdge.fromNode);
    const toNodeObj = nodes.find((n) => n.step.id() === toNode);
    if (!fromNodeObj || !toNodeObj) return;

    const descriptor = fromNodeObj.step.nextSteps().find((d) => d.data === null);
    if (!descriptor) return;

    const data: StepDescriptorData = {
      next_id: toNodeObj.step.id(),
      side_from: creatingEdge.fromSide,
      side_to: toSide,
    };
    descriptor.set(data);

    setEdges((prev) => [
      ...prev,
      {
        id: `${fromNodeObj.step.id()}-${creatingEdge.fromSide}-${toNodeObj.step.id()}-${toSide}`,
        fromNode: fromNodeObj.step.id(),
        fromSide: creatingEdge.fromSide,
        toNode: toNodeObj.step.id(),
        toSide,
      },
    ]);

    setCreatingEdge(null);
  };

  const removeEdge = (edgeId: string) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    const fromNode = nodes.find((n) => n.step.id() === edge.fromNode);
    if (fromNode) {
      const descriptor = fromNode.step.nextSteps().find(
        (d) =>
          d.data &&
          d.data.next_id === edge.toNode &&
          d.data.side_from === edge.fromSide &&
          d.data.side_to === edge.toSide
      );
      if (descriptor) descriptor.set(null);
    }

    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  const getSidePosition = (node: NodeData, side: Side) => {
    const nodeEl = nodeRefs.current[node.step.id()];
    if (!nodeEl) return { x: node.x + 75, y: node.y + 25 };
    const rect = nodeEl.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    switch (side) {
      case "top": return { x: node.x + width / 2, y: node.y };
      case "bottom": return { x: node.x + width / 2, y: node.y + height };
      case "left": return { x: node.x, y: node.y + height / 2 };
      case "right": return { x: node.x + width, y: node.y + height / 2 };
    }
  };

  const addPrimitiveStep = () => {
    if (!nodeMenu.menu) return;
    const newStep = new PrimitiveStep();
    setNodes((prev) => [
      ...prev,
      { step: newStep, x: nodeMenu.menu!.x - 75, y: nodeMenu.menu!.y - 25 },
    ]);
    nodeMenu.closeContextMenu();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => nodeMenu.openContextMenu(e)}
      className={`w-full h-full relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-100"} ${draggingNode ? "cursor-grabbing" : "cursor-default"}`}
    >
      {/* Edges */}
      <svg className="absolute w-full h-full">
        {edges.map((e) => {
          const fromNode = nodes.find((n) => n.step.id() === e.fromNode);
          const toNode = nodes.find((n) => n.step.id() === e.toNode);
          if (!fromNode || !toNode) return null;
          const fromPos = getSidePosition(fromNode, e.fromSide);
          const toPos = getSidePosition(toNode, e.toSide);
          const isHovered = hoveredEdgeId === e.id;

          return (
            <g
              key={e.id}
              onMouseEnter={() => setHoveredEdgeId(e.id)}
              onMouseLeave={() => setHoveredEdgeId(null)}
              onContextMenu={(evt) => edgeMenu.openContextMenu(evt, e.id)}
            >
              <line
                x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                stroke="transparent" strokeWidth={10} className="cursor-pointer"
              />
              <line
                x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                stroke={isHovered ? "#f00" : darkMode ? "#0af" : "#007"} strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        })}

        {creatingEdge && (() => {
          const fromNode = nodes.find((n) => n.step.id() === creatingEdge.fromNode);
          if (!fromNode) return null;
          const fromPos = getSidePosition(fromNode, creatingEdge.fromSide);
          return (
            <line
              x1={fromPos.x} y1={fromPos.y} x2={creatingEdge.x} y2={creatingEdge.y}
              stroke="#0af" strokeWidth={2} strokeDasharray="5,5"
            />
          );
        })()}

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={darkMode ? "#0af" : "#007"} />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const fromUsed = node.step.nextSteps().some((d) => d.data !== null);
        const toUsed = edges.some((e) => e.toNode === node.step.id());

        return (
          <div
            key={node.step.id()}
            ref={(el) => (nodeRefs.current[node.step.id()] = el)}
            style={{ top: node.y, left: node.x }}
            className={`p-10 absolute flex flex-col items-center justify-center rounded-md shadow-md select-none ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} cursor-grab`}
            onMouseDown={(e) => onMouseDownNode(e, node.step.id())}
          >
            <p>{node.step.id()}</p>
            <p>{node.step.nextSteps()[0].data?.next_id}</p>

            {/* From handles: hide if already used */}
            {(!fromUsed) && (["top", "bottom", "left", "right"] as Side[]).map((side) => {
              const positionClasses = {
                top: "absolute -top-2 left-1/2 -translate-x-1/2",
                bottom: "absolute -bottom-2 left-1/2 -translate-x-1/2",
                left: "absolute -left-2 top-1/2 -translate-y-1/2",
                right: "absolute -right-2 top-1/2 -translate-y-1/2",
              };
              return (
                <div
                  key={side}
                  className={`w-5 h-5 bg-blue-500 rounded-full cursor-crosshair ${positionClasses[side]}`}
                  onMouseDown={(e) => { e.stopPropagation(); startEdge(node.step.id(), side); }}
                  onMouseUp={(e) => { e.stopPropagation(); if (creatingEdge) completeEdge(node.step.id(), side); }}
                />
              );
            })}

            {/* To handle: always show, only one */}
            {!toUsed && (
              <div
                className="w-5 h-5 bg-green-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (creatingEdge) completeEdge(node.step.id(), "top");
                }}
              />
            )}
          </div>
        );
      })}

      {/* Node Context Menu */}
      {nodeMenu.menu && (
        <ContextMenu data={nodeMenu.menu} onClose={nodeMenu.closeContextMenu}>
          <div
            className="p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => {
              addPrimitiveStep();
              nodeMenu.closeContextMenu();
            }}
          >
            Add PrimitiveStep
          </div>
        </ContextMenu>
      )}

      {/* Edge Context Menu */}
      {edgeMenu.menu && (
        <ContextMenu data={edgeMenu.menu} onClose={edgeMenu.closeContextMenu}>
          <div
            className="p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => {
              edgeMenu.closeContextMenu();
              removeEdge(edgeMenu.menu!.data!);
            }}
          >
            Delete Edge
          </div>
        </ContextMenu>
      )}
    </div>
  );
}
