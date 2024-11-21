import { Mesh } from "three";

interface LegsComponentProps {
    legModel: Mesh;
    position: number[];
    legModel2: Mesh;
    position2: number[];
}

export function LegsComponent({ legModel, legModel2, position, position2 }: LegsComponentProps) {

    return (
        <group>
            <primitive
                object={legModel}
                position={position}
            />
            <primitive
                scale={[1, 1, -1]}
                object={legModel2}
                position={position2}
            />
        </group>
    );
}
