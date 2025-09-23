'use client'
import React, { useState, useRef, useEffect } from "react";
import { Step, Id, generateID } from "@/structs/step";
import { PrimitiveStep } from "@/structs/primitve_step";

interface StepPosition {
    x: number;
    y: number;
}

interface StepNodeProps {
    step: Step;
    position: StepPosition;
    onMove: (id: Id, pos: StepPosition) => void;
    steps: Step[];
    updateDescriptor: (sourceId: Id, descIdx: number, targetId: Id | null) => void;
}

const StepNode: React.FC<StepNodeProps> = ({ step, position, onMove, steps, updateDescriptor }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const onMouseMove = (e: MouseEvent) => {
        if (dragging) {
            onMove(step.id(), { x: e.clientX - offset.x, y: e.clientY - offset.y });
        }
    };

    const onMouseUp = () => setDragging(false);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    });

    return (
        <div
            ref={nodeRef}
            onMouseDown={onMouseDown}
            className={`
                absolute cursor-move 
                bg-gradient-to-br from-purple-400 to-pink-400 
                text-white font-semibold 
                rounded-xl shadow-2xl p-4 min-w-[160px] 
                transition-transform duration-200
                ${dragging ? "scale-105 shadow-3xl" : "hover:scale-105 hover:shadow-3xl"}
            `}
            style={{ left: position.x, top: position.y }}
        >
            <div className="text-lg mb-2">Step {step.id()}</div>
            {step.nextSteps().map((desc, idx) => (
                <div key={idx} className="mt-2">
                    <label className="text-sm flex items-center gap-1">
                        {desc.description} →
                        <select
                            className="ml-1 border border-gray-200 rounded px-1 text-black"
                            value={desc.next ?? ""}
                            onChange={(e) =>
                                updateDescriptor(step.id(), idx, e.target.value || null)
                            }
                        >
                            <option value="">None</option>
                            {steps
                                .filter((s) => s.id() !== step.id())
                                .map((s) => (
                                    <option key={s.id()} value={s.id()}>
                                        Step {s.id()}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
            ))}
        </div>
    );
};

interface CanvasProps {
    steps: Step[];
}

export const Canvas: React.FC<CanvasProps> = ({ steps: initialSteps }) => {
    const [steps, setSteps] = useState<Step[]>(initialSteps);

    const [positions, setPositions] = useState<Record<Id, StepPosition>>(
        () =>
            initialSteps.reduce((acc, step, idx) => {
                acc[step.id()] = { x: 100 + idx * 200, y: 100 + idx * 150 };
                return acc;
            }, {} as Record<Id, StepPosition>)
    );

    const updateDescriptor = (sourceId: Id, descIdx: number, targetId: Id | null) => {
        const step = steps.find((s) => s.id() === sourceId);
        if (!step) return;
        step.nextSteps()[descIdx].set(targetId);
        setSteps([...steps]); // Trigger re-render
    };

    const moveNode = (id: Id, pos: StepPosition) => {
        setPositions((prev) => ({ ...prev, [id]: pos }));
    };

    const addStep = () => {
        const newStep: Step = new PrimitiveStep(null);
        setSteps([...steps, newStep]);
        setPositions((prev) => ({
            ...prev,
            [newStep.id()]: { x: 100, y: 100 },
        }));
    };

    return (
        <div className="p-4">
            <button
                onClick={addStep}
                className="mb-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-colors"
            >
                Add Step
            </button>
            <div className="relative w-full h-[80vh] border border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="10"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                        </marker>
                    </defs>
                    {steps.map((step) =>
                        step.nextSteps().map((desc, idx) => {
                            if (!desc.next || !positions[desc.next]) return null;

                            const start = positions[step.id()];
                            const end = positions[desc.next];

                            const deltaX = end.x - start.x;
                            const deltaY = end.y - start.y;

                            // Dynamic control points
                            const controlX1 = start.x + deltaX * 0.5;
                            const controlY1 = start.y;
                            const controlX2 = start.x + deltaX * 0.5;
                            const controlY2 = end.y;

                            const pathD = `M ${start.x + 80} ${start.y + 40} C ${controlX1 + 80} ${controlY1 + 40}, ${controlX2 + 80} ${controlY2 + 40}, ${end.x + 80} ${end.y + 40}`;

                            return (
                                <path
                                    key={`${step.id()}-${idx}`}
                                    d={pathD}
                                    fill="none"
                                    stroke="#4B5563"
                                    strokeWidth={2}
                                    markerEnd="url(#arrowhead)"
                                    className="transition-all duration-50"
                                />
                            );
                        })
                    )}
                </svg>

                {steps.map((step) => (
                    <StepNode
                        key={step.id()}
                        step={step}
                        position={positions[step.id()]}
                        onMove={moveNode}
                        steps={steps}
                        updateDescriptor={updateDescriptor}
                    />
                ))}
            </div>
        </div>
    );
};

export default Canvas;
