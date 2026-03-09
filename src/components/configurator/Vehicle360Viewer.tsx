'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface Vehicle360ViewerProps {
    modelId: string;
    category: string | null;
    exteriorColor: string;
    interiorColor: string;
}

export default function Vehicle360Viewer({
    modelId,
    category,
    exteriorColor,
    interiorColor,
}: Vehicle360ViewerProps) {
    const [currentFrame, setCurrentFrame] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [preloaded, setPreloaded] = useState(false);
    const dragStartX = useRef(0);
    const frameAtDragStart = useRef(1);

    const TOTAL_FRAMES = 36;
    const DRAG_SENSITIVITY = 10; // Pixels per frame change

    // Determine color folders based on Option Name
    const getExtFolder = () => {
        const ext = exteriorColor.toLowerCase();
        if (ext.includes('red') || ext.includes('ross')) return 'red';
        if (ext.includes('black') || ext.includes('nero')) return 'black';
        if (ext.includes('blue') || ext.includes('blu')) return 'blue';
        if (ext.includes('grey') || ext.includes('grigio')) return 'grey';
        return 'white'; // default
    };

    const getIntFolder = () => {
        const int = interiorColor.toLowerCase();
        if (int.includes('red') || int.includes('rosso')) return 'red';
        if (int.includes('tan') || int.includes('cuoio')) return 'tan';
        return 'black'; // default
    };

    // Normalize model ID to folder name
    const folderModel = useMemo(() => {
        if (modelId.includes('levante')) return 'levante';
        if (modelId.includes('grecale')) return 'grecale';
        if (modelId.includes('mc20')) return 'mc20';
        return 'ghibli';
    }, [modelId]);

    const extFolder = getExtFolder();
    const intFolder = getIntFolder();
    const isInterior = category === 'interior';

    // Current Image path 
    const currentImagePath = isInterior
        ? `/cars/${folderModel}/interior/${intFolder}/01.svg`
        : `/cars/${folderModel}/exterior/${extFolder}/${currentFrame.toString().padStart(2, '0')}.svg`;

    // Preload all 36 frames for smooth scrubbing when exterior changes
    useEffect(() => {
        if (isInterior) return;

        setPreloaded(false);
        const images: HTMLImageElement[] = [];
        let loaded = 0;

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/cars/${folderModel}/exterior/${extFolder}/${i.toString().padStart(2, '0')}.svg`;
            img.onload = () => {
                loaded++;
                if (loaded === TOTAL_FRAMES) setPreloaded(true);
            };
            // Fallback just in case some fail to load so we don't hang forever
            img.onerror = () => {
                loaded++;
                if (loaded === TOTAL_FRAMES) setPreloaded(true);
            };
            images.push(img);
        }
    }, [folderModel, extFolder, isInterior]);

    // Handle Dragging
    const handleDragStart = useCallback((clientX: number) => {
        if (isInterior) return;
        setIsDragging(true);
        dragStartX.current = clientX;
        frameAtDragStart.current = currentFrame;
    }, [currentFrame, isInterior]);

    const handleDragMove = useCallback((clientX: number) => {
        if (!isDragging || isInterior) return;

        const deltaX = clientX - dragStartX.current;
        const framesToMove = Math.floor(deltaX / DRAG_SENSITIVITY);

        // Calculate new frame with wrap-around logic
        let newFrame = frameAtDragStart.current - framesToMove; // Subtracted so drag right rotates left visually

        // Wrap frame between 1 and 36
        while (newFrame < 1) newFrame += TOTAL_FRAMES;
        while (newFrame > TOTAL_FRAMES) newFrame -= TOTAL_FRAMES;

        setCurrentFrame(newFrame);
    }, [isDragging, isInterior]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            className="w-full h-full relative flex items-center justify-center select-none"
            onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX); }}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
        >
            {/* Background Studio Light Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            {!preloaded && !isInterior && (
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur z-20">
                    Loading Rotation ⏳
                </div>
            )}

            {!isInterior && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-maserati-navy/50 dark:text-white/50 text-xs tracking-widest uppercase z-20 pointer-events-none opacity-50 animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    <span>Drag to Rotate</span>
                </div>
            )}

            <div className="relative w-full max-w-5xl aspect-[16/9] cursor-ew-resize">
                <img
                    src={currentImagePath}
                    alt="Current Vehicle Configuration"
                    className="absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl transition-opacity duration-300 pointer-events-none"
                    draggable={false}
                />
            </div>
        </div>
    );
}
