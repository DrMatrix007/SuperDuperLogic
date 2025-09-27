import React from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Step } from "@/lib/step";

export interface StepNodeData extends Record<string, unknown> {
    step: Step;
    label?: string;
}

export interface StepEdgeData extends Record<string, unknown> {
    index: number,
    label?: string;
}


export function StepNodeComponent({ data }: NodeProps<Node<StepNodeData>>) {
    const step = data.step;
    const label = data.label || "Step";

    const descriptors = step.nextSteps();

    return (
        <div
            style={{
                padding: 10,
                border: "1px solid #777",
                borderRadius: 5,
                backgroundColor: "#222",
                color: "white",
                minWidth: 150,
                textAlign: "center",
                position: "relative",
            }}
        >
            <h1>{data.step.name}</h1>
            <p>{data.step.id()}</p>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ background: "#555" }}
            />

            {/* Dynamic output handles */}
            {descriptors.map((_, index) => (
                <Handle
                    key={index}
                    type="source"
                    position={Position.Right}
                    id={`handle-${data.step.id()}-${index.toString()}`} // handle id = index
                    style={{
                        top: `${(index + 1) * (100 / (descriptors.length + 1))}%`,
                        background: "#4caf50",
                    }}
                />
            ))}
        </div>
    );
}
