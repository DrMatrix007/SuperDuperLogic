"use client";

import React, { useState, useCallback } from "react";
import {
    ReactFlow,
    addEdge,
    Background,
    Controls,
    Edge,
    Node,
    Connection,
    MiniMap,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { PrimitiveStep } from "@/structs/primitve_step";
import { Step } from "@/structs/step";

export default function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Function to add a new step/node
    const addStep = useCallback(() => {
        const newNode: Node = {
            id: (nodes.length + 1).toString(), // unique id
            type: 'default',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: `Step ${nodes.length + 1}` },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <button onClick={addStep} className="mb-4 p-2 bg-blue-500 text-white rounded">
                Add Step
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(connection: Connection) =>
                    setEdges((eds) => addEdge(connection, eds))
                }
                fitView
                colorMode="dark"
            >
                <MiniMap nodeBorderRadius={10} />
                <Controls />
                <Background gap={16} />
            </ReactFlow>
        </div>
    );
}
