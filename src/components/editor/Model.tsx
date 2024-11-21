import { useGLTF } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { useEffect } from 'react';
import { Box3 } from 'three';

interface ModelProps {
    url: string;
    [key: string]: any;
    returnBoxCallback?: (padding: Vector3) => void;
}
//may be need remove old scene
export function Model({ url, setPaddingCallback, ...props }: ModelProps) {
    const gltf = useGLTF(url);
    const clonedScene = gltf.scene.clone(); // for multiple same objects
    useEffect(() => {
        const box = new Box3().setFromObject(clonedScene); // get bounding box of the scene
        if (setPaddingCallback)
            setPaddingCallback(box)
    }, []);


    return <primitive {...props} object={clonedScene} />;
};