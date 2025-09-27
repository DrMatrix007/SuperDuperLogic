import { BaseEdge, Edge, EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath, Position } from "@xyflow/react";
import { StepEdgeData } from "./step_node_component";
import styles from './step_edge_component.module.css'

const DIFF_Y_TARGET = 75;

export function StepEdgeComponent({ id, sourceX, sourceY, targetX, targetY, label }: EdgeProps<Edge<StepEdgeData>>) {
    const diffY = sourceY - targetY;
    const diffYNorm = (diffY < 0 ? -1 : 1) * DIFF_Y_TARGET;
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        centerY: Math.abs(diffY) < DIFF_Y_TARGET ? (sourceY + targetY) / 2 + diffYNorm : undefined,
    });

    return <>
        <BaseEdge id={id} path={edgePath} className={styles.animatedEdge} label={label} />
    </>
}