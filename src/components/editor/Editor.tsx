import { useEffect, useState } from "react";
import { DeskConfigurator } from "./DeskConfigurator";
import { Canvas } from "@react-three/fiber";
import { Scene } from "three";
import { OrbitControls } from "@react-three/drei";
import { debounce } from "lodash";


interface EditorProps {
    width?: number;
    depth?: number;
    height?: number;
    material?: string;
    legType?: string
    callback: (config: any) => void;
}
export function Editor({ width, depth, height, material, legType, callback }: EditorProps) {
    const [deskConfig, setDeskConfig] = useState({
        width: width || 1200,
        depth: depth || 300,
        height: height || 500,
        material: material || "top_ashwood_mat",
        legType: legType || 'prop_01',
    });

    const debouncedCallback = debounce(callback, 200);
    useEffect(() => {
        debouncedCallback(deskConfig);

        return () => {
            debouncedCallback.cancel();
        }

    }, [deskConfig]);


    const handleConfigChange = (newConfig: any) => {
        setDeskConfig(newConfig);
    };

    const scene = new Scene();

    return (
        <div className="w-screen h-screen flex" >
            <Canvas scene={scene} className='w-2/3 ' camera={{
                position: [1, 1, 1],
                fov: 75,
            }}>
                <DeskConfigurator config={deskConfig} />
                <OrbitControls />
            </Canvas>
            <div className="w-1/3 z-50">
                Материал вверха

                <div className="flex">
                    <button className="bg-[#c7b299] w-6 h-6 rounded-full" onClick={() => handleConfigChange({ ...deskConfig, material: "top_ashwood_mat" })}></button>
                    <button className="bg-[#cd7f32] w-6 h-6 rounded-full ml-2" onClick={() => handleConfigChange({ ...deskConfig, material: "top_cedar_mat" })}></button>
                    <button className="bg-[#1c1c1c] w-6 h-6 rounded-full ml-2" onClick={() => handleConfigChange({ ...deskConfig, material: "top_plastic_black_mat" })}></button>
                    <button className="bg-[#f0f0f0] w-6 h-6 rounded-full ml-2" onClick={() => handleConfigChange({ ...deskConfig, material: "top_plastic_white_mat" })}></button>
                    <button className="bg-[#773f1a] w-6 h-6 rounded-full ml-2" onClick={() => handleConfigChange({ ...deskConfig, material: "top_walnut_mat" })}></button>
                </div>
                <div className="mt-2">
                    Размеры
                    <div>
                        Ширина: {deskConfig.width}
                        <div>
                            <input
                                type="range"
                                min="1200"
                                max="2400"
                                step={1}
                                value={deskConfig.width}
                                onChange={(e) => handleConfigChange({ ...deskConfig, width: parseInt(e.target.value) })}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        Глубина: {deskConfig.depth}
                        <div>
                            <input
                                type="range"
                                min="300"
                                max="900"
                                step={1}
                                value={deskConfig.depth}
                                onChange={(e) => handleConfigChange({ ...deskConfig, depth: parseInt(e.target.value) })}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        Высота: {deskConfig.height}
                        <div>
                            <input
                                type="range"
                                min="500"
                                max="1200"
                                step={1}
                                value={deskConfig.height}
                                onChange={(e) => handleConfigChange({ ...deskConfig, height: parseInt(e.target.value) })}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    Опоры
                    <select value={deskConfig.legType} onChange={(e) => handleConfigChange({ ...deskConfig, legType: e.target.value })}>
                        <option value="prop_01">Опора 1</option>
                        <option value="prop_02">Опора 2</option>
                    </select>
                </div>
            </div>
        </div>
    );
};