import { useGLTF } from '@react-three/drei';
import { BoxGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial, Object3D, Scene } from 'three';
import { useEffect, useRef, useState } from 'react';
import { Model } from './Model';

interface DeskConfiguratorProps {
    config: {
        width: number;
        depth: number;
        height: number;
        material: string;
        legType: string;
    };
}

function getAllChildren(object: Object3D) {
    const morphTargets: any[] = [];

    object.traverse((child) => {
        if (child instanceof Mesh && child.geometry.morphAttributes && child.morphTargetInfluences) {
            const expressions = child.morphTargetInfluences ? [child] : [];
            morphTargets.push(...expressions);
        }
    });
    return morphTargets;
}

async function getMaterial(obj: Object3D) {
    return await new Promise<Material>((resolve, reject) => {
        obj.traverse((child) => {
            if (child instanceof Mesh && child.material) {
                resolve(child.material);
            }
        });
    });
}

export function DeskConfigurator({ config }: DeskConfiguratorProps) {

    const [modelUrl, setModelUrl] = useState(`./${config.legType}.glb`);
    const legModel = useGLTF(`./leg.glb`).scene;
    const legModel2 = legModel.clone(true);

    const [material, setMaterial] = useState<MeshStandardMaterial>(new MeshStandardMaterial({ color: 0x333333 }));

    const materialModel = useGLTF(`./${config.material}.glb`).scene;

    const geometryTable = new BoxGeometry(0.3, 0.02, 1.2) as BufferGeometry;
    geometryTable.morphAttributes = {
        position: [new BoxGeometry(1.2, 0.02, 1.2).getAttribute('position'), new BoxGeometry(0.3, 0.02, 2.4).getAttribute('position')],  // Adding the morph target to the geometry's position attribute
    };

    const tableRef = useRef<Mesh>(new Mesh(geometryTable));

    const legsMorphs: Mesh[] = [];
    legsMorphs.push(...getAllChildren(legModel));
    legsMorphs.push(...getAllChildren(legModel2));

    function normalize(value: number, min: number, max: number): number {
        if (min === max) {
            throw new Error('Min and max values must be different.');
        }
        return (value - min) / (max - min);
    }

    useEffect(() => {
        setModelUrl(`./${config.legType}.glb`)

        legsMorphs.forEach((morph: Mesh) => {
            morph.morphTargetInfluences = [
                normalize(config.depth, 300, 900),
                normalize(config.height, 500, 1200),
            ];
            morph.position.x = (300 - config.depth) / 1000;
        });

        tableRef.current.morphTargetInfluences =
            [normalize(config.depth, 300, 750), // 750 because model max is greates than 900 table
            normalize(config.width, 1200, 2400)];

        tableRef.current.position.y = config.height / 1000 - 0.005;

        getMaterial(materialModel).then((material) => {
            setMaterial(material as MeshStandardMaterial);
        });
    }, [config]);

    const tempPadding = 0.02; //hardcore padding for set support legs 

    return (
        <group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <mesh ref={tableRef} geometry={geometryTable} material={material} />
            <group>
                <primitive object={legModel} position={[0, 0, (-config.width / 2000) + tempPadding]} />
                <primitive scale={[1, 1, -1]} object={legModel2} position={[0, 0, (config.width / 2000) - tempPadding]} />
            </group>
            <group>
                <Model position={[(-config.depth / 2000) + tempPadding, 0, (config.width / 2000) - tempPadding]} url={modelUrl} />
                <Model position={[(-config.depth / 2000) + tempPadding, 0, (-config.width / 2000) + tempPadding]} url={modelUrl} />
                <Model position={[(config.depth / 2000) - tempPadding, 0, (config.width / 2000) - tempPadding]} url={modelUrl} />
                <Model position={[(config.depth / 2000) - tempPadding, 0, (-config.width / 2000) + tempPadding]} url={modelUrl} />
            </group>
        </group >
    );
};

