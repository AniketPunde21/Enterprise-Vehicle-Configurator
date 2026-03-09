'use client';

import { useState, useEffect } from 'react';

interface VehicleImageViewerProps {
    modelId: string;
    category: string | null;
    exteriorColor: string;
    interiorColor: string;
}

export default function VehicleImageViewer({
    modelId,
    category,
    exteriorColor,
    interiorColor,
}: VehicleImageViewerProps) {
    const [currentImage, setCurrentImage] = useState<string>('');
    const [prevImage, setPrevImage] = useState<string>('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Determine the image path based on selections
    const getImagePath = () => {
        const folder = modelId === 'levante' ? 'levante' : 'ghibli';

        if (category === 'interior') {
            const introStr = interiorColor.toLowerCase();
            if (introStr.includes('red') || introStr.includes('corallo')) {
                return `/images/cars/${folder}/interior-red.png`;
            }
            return `/images/cars/${folder}/interior-black.png`;
        }

        // Exterior or other steps
        const extStr = exteriorColor.toLowerCase();
        if (extStr.includes('red') || extStr.includes('ross')) {
            return `/images/cars/${folder}/red-exterior.png`;
        }
        if (extStr.includes('black') || extStr.includes('nero')) {
            return `/images/cars/${folder}/black-exterior.png`;
        }
        return `/images/cars/${folder}/white-exterior.png`;
    };

    useEffect(() => {
        const newImage = getImagePath();
        if (newImage !== currentImage) {
            setPrevImage(currentImage);
            setCurrentImage(newImage);
            setIsTransitioning(true);

            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 600); // Match CSS transition duration

            return () => clearTimeout(timer);
        }
    }, [category, exteriorColor, interiorColor, modelId]);

    return (
        <div className="w-full h-full relative flex items-center justify-center p-8 lg:p-16">
            {/* Background Studio Light Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="relative w-full max-w-5xl aspect-[16/9]">
                {/* Previous Image (Fading out) */}
                {prevImage && (
                    <img
                        src={prevImage}
                        alt="Previous Vehicle Configuration"
                        className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-0'
                            }`}
                    />
                )}

                {/* Current Image (Fading in) */}
                <img
                    src={currentImage || getImagePath()}
                    alt="Current Vehicle Configuration"
                    className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                />
            </div>
        </div>
    );
}
