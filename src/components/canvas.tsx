"use client";

import React, { useCallback, useEffect, useRef } from "react";
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
    ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ContextMenu } from "@/components/context_menu";
import { useContextMenu } from "@/hooks/use_context_menu";

// Import your step system
import { PrimitiveStep } from "@/lib/primitve_step";
import { Step, Id } from "@/lib/step";
import { IfElseStep } from "@/lib/if_else_step";
import { StepNodeComponent, StepEdgeData, StepNodeData } from "./step_node_component";
import { StepEdgeComponent } from "./step_edge_component";


const nodeTypes = {
    step: StepNodeComponent,
};
const edgeTypes = {
    step: StepEdgeComponent,
};

export default function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<StepNodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<StepEdgeData>>([]);
    const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance<Node<StepNodeData>, Edge<StepEdgeData>> | null>(null);

    console.log(nodes.map(a => a.data.step))
    const nodeMenu = useContextMenu<Node<StepNodeData>>();
    const edgeMenu = useContextMenu<Edge<StepEdgeData>>();
    const canvasMenu = useContextMenu<{ type: "canvas"; position: { x: number; y: number } }>();

    const addStepAt = <T extends Step>(StepClass: new () => T) => () => {
        if (!canvasMenu.state.target) return;

        const { position } = canvasMenu.state.target;
        const step = new StepClass();

        const newNode: Node<StepNodeData> = {
            id: "node-" + step.id(),
            type: "step",
            position,
            data: { step, label: `Step ${nodes.length + 1}` },
        };

        setNodes((nds) => [...nds, newNode]);
        canvasMenu.close();
    };
    const onConnect = (connection: Connection) => {
        if (!connection.source || !connection.target) return;

        const sourceStep = nodes.find(node => node.id === connection.source)?.data.step;
        const targetStep = nodes.find(node => node.id === connection.target)?.data.step;

        if (sourceStep && targetStep) {
            const descriptors = sourceStep.nextSteps();

            const index = Number.parseInt(connection.sourceHandle?.split("-")[2]!);
            const descriptor = descriptors[index];
            descriptor.set({
                next_id: targetStep.id(),
            });
            var newEdge: Edge<StepEdgeData> = {
                data: { index },
                id: `edge-${sourceStep.id()}-${targetStep.id()}-${index}`,
                ...connection,
                label: descriptor.description,
                type: "step"
            };
            setEdges((eds) => addEdge(newEdge, eds));
        }
    };




    const deleteNode = (node: Node<StepNodeData> | null) => {
        if (!node) { return; }

        setNodes((nds) => nds.filter((n) => n.id !== node.id));

        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));

        nodes.forEach((step) => {
            step.data.step.nextSteps().forEach((desc) => {
                if (desc.data?.next_id === node.id) {
                    desc.set(null);
                }
            });
        });
    };

    const deleteEdge = (edge: Edge<StepEdgeData> | null) => {
        if (!edge) { return; }

        const sourceStep = nodes.find(node => node.id === edge.source)?.data.step;
        if (sourceStep) {
            const descriptors = sourceStep.nextSteps();
            const index = edge.data?.index;
            console.log("dfjswlfjdksjfsd", descriptors)
            console.log(edge.data?.index);
            if (index !== undefined && descriptors[index]) {
                descriptors[index].set(null);
            }
        }

        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    };


    return (
        <div className="flex flex-col" style={{ height: "100%", width: "100%" }}>

            <ReactFlow<Node<StepNodeData>, Edge<StepEdgeData>>

                className="grow"
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={a => { console.log(a); a.map(a => deleteEdge(a)) }}
                onConnect={onConnect}
                onInit={setRfInstance}
                onNodeContextMenu={(e, node) => nodeMenu.open(e, node)}
                onEdgeContextMenu={(e, edge) => edgeMenu.open(e, edge)}
                onPaneContextMenu={(e) => {
                    e.preventDefault();
                    if (!rfInstance) return;
                    const flowPos = rfInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
                    canvasMenu.open(e, { type: "canvas", position: flowPos });
                }}
                colorMode="dark"
            >
                <MiniMap nodeBorderRadius={10} />
                <Controls />
                <Background />
            </ReactFlow>

            <ContextMenu menu={nodeMenu}>
                <button
                    onClick={() => deleteNode(nodeMenu.state.target)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                    Delete Node
                </button>
            </ContextMenu>

            <ContextMenu menu={edgeMenu}>
                <button
                    onClick={() => deleteEdge(edgeMenu.state.target)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                    Delete Edge
                </button>
            </ContextMenu>

            <ContextMenu menu={canvasMenu}>
                <button
                    onClick={addStepAt(PrimitiveStep)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                    Add Primitive Step Here
                </button>
                <button
                    onClick={addStepAt(IfElseStep)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                    Add If Else Here
                </button>
            </ContextMenu>
        </div>
    );
}
