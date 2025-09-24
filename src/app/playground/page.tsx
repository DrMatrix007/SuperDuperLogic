'use client'

import Canvas from '@/components/canvas'
import { PrimitiveStep } from '@/structs/primitve_step';


export default function Playground() {
    return <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas steps={[]}></Canvas>
    </div>
}