'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface Vehicle3DViewerProps {
    modelUrl?: string | null;
    category: string | null;
    exteriorColor: string;
    interiorColor: string;
    previewMode?: boolean;
}

function Loader() {
    const { progress } = useProgress();
    return <Html center><div className="text-white bg-black/50 px-4 py-2 rounded font-sans tracking-wider text-sm">Loading Model: {progress.toFixed(0)}%</div></Html>;
}

function Model({ url, exteriorColor }: { url: string; exteriorColor: string }) {
    const { scene } = useGLTF(url);

    // Map exteriorColor string from UI to Hex
    const colorHex = useMemo(() => {
        const c = exteriorColor.toLowerCase();
        if (c.includes('red') || c.includes('ross')) return '#8b0000';
        if (c.includes('black') || c.includes('nero')) return '#111111';
        if (c.includes('blue') || c.includes('blu')) return '#00205b';
        if (c.includes('grey') || c.includes('grigio')) return '#555555';
        return '#f5f5f5'; // white/default
    }, [exteriorColor]);

    useEffect(() => {
        if (!scene) return;

        let bodyMaterials: THREE.MeshStandardMaterial[] = [];

        // First pass: Cast/receive shadows on ALL meshes
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });

        // Try to identify by explicit material name first
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material;
                if (mat) {
                    const materialArray = Array.isArray(mat) ? mat : [mat];
                    materialArray.forEach(m => {
                        const name = (m.name || '').toLowerCase();
                        if (name.includes('body') || name.includes('paint') || name.includes('carpaint') || name.includes('bodycolor') || name.includes('exterior')) {
                            const newMat = new THREE.MeshStandardMaterial({
                                color: new THREE.Color(colorHex),
                                roughness: 0.1,
                                metalness: 0.5
                            });
                            mesh.material = newMat;
                            bodyMaterials.push(newMat);
                        }
                    });
                }
            }
        });

        // Fallback: If no specifically named material was found...
        // Use an aggressive brute-force exclusion heuristic. Paint EVERYTHING that doesn't explicitly match a known "non-paint" car part.
        if (bodyMaterials.length === 0) {
            scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const mat = mesh.material;
                    let matName = '';
                    if (mat && !Array.isArray(mat)) matName = mat.name?.toLowerCase() || '';
                    if (Array.isArray(mat) && mat.length > 0) matName = mat[0].name?.toLowerCase() || '';

                    const objName = mesh.name?.toLowerCase() || '';

                    // A strict exclusion list.
                    const exclude = ['glass', 'window', 'tire', 'wheel', 'light', 'grill', 'chrome', 'rubber', 'brake', 'rim', 'engine', 'seat', 'steering', 'dash', 'mirror', 'interior', 'logo', 'badge', 'licence', 'exhaust', 'caliper', 'disc', 'suspension', 'plate', 'under'];
                    const shouldExclude = exclude.some(kw => matName.includes(kw) || objName.includes(kw));

                    // Only paint meshes that don't match excluded parts, even if the material/object name is empty.
                    if (!shouldExclude) {
                        const newMat = new THREE.MeshStandardMaterial({
                            color: new THREE.Color(colorHex),
                            roughness: 0.1,
                            metalness: 0.5
                        });
                        mesh.material = newMat;
                        bodyMaterials.push(newMat);
                    }
                }
            });
        }
    }, [scene, colorHex]);

    // Calculate center and normalize scale
    const { center, scale, miny } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        return { center, scale, miny: box.min.y };
    }, [scene]);

    return (
        <group position={[-center.x * scale, -miny * scale - 1, -center.z * scale]} scale={scale}>
            <primitive object={scene} />
        </group>
    );
}

export default function Vehicle3DViewer({
    modelUrl,
    category,
    exteriorColor,
    interiorColor,
    previewMode = false,
}: Vehicle3DViewerProps) {
    const isInterior = category === 'interior';

    if (isInterior) {
        return (
            <div className="w-full h-full relative flex items-center justify-center bg-[#111] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1600&q=80"
                    alt="Interior"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

                <div className="relative z-10 text-center px-4 max-w-lg">
                    <h2 className="text-white text-2xl md:text-3xl font-display tracking-widest uppercase mb-4">
                        Interior Customization
                    </h2>
                    <p className="text-maserati-accent text-sm md:text-base tracking-widest uppercase mb-2">
                        {interiorColor || 'Standard'} Finish
                    </p>
                    <p className="text-white/60 text-xs tracking-wider uppercase">
                        3D Interior previews are currently in development.<br />Please refer to the configuration details.
                    </p>
                </div>
            </div>
        );
    }

    const url = modelUrl || '/cars/glbimages/tata_nano.glb'; // Fallback so page doesn't crash

    return (
        <div className={`w-full h-full relative ${previewMode ? 'pointer-events-none' : 'cursor-ew-resize'}`}>
            <Canvas shadows camera={{ position: previewMode ? [3, 1.5, 5] : [4, 2, 6], fov: 45 }} style={{ background: 'transparent' }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={0.5}
                    shadow-camera-far={25}
                    shadow-bias={-0.001}
                />

                {/* Fake invisible ground for shadows only */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <shadowMaterial opacity={0.3} />
                </mesh>

                <ErrorBoundary fallback={
                    <Html center>
                        <div className="text-center bg-black/80 px-4 py-3 rounded text-white font-sans max-w-[200px]">
                            <p className="text-sm">Model failed to load.</p>
                            <p className="text-xs text-white/50 mt-1">There was an error decoding textures inside the GLB file.</p>
                        </div>
                    </Html>
                }>
                    <Suspense fallback={<Loader />}>
                        <Model url={url} exteriorColor={exteriorColor} />
                    </Suspense>
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                    </Suspense>
                </ErrorBoundary>

                <OrbitControls
                    enableZoom={!previewMode}
                    enablePan={!previewMode}
                    enableRotate={!previewMode}
                    autoRotate={previewMode}
                    autoRotateSpeed={1.5}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={3}
                    maxDistance={15}
                    maxPolarAngle={Math.PI / 2 + 0.05}
                    target={[0, 0, 0]}
                />
            </Canvas>

            {!previewMode && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-maserati-navy/60 dark:text-white/60 text-xs tracking-widest uppercase z-20 pointer-events-none opacity-50 animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    <span>Drag to Rotate</span>
                </div>
            )}
        </div>
    );
}
