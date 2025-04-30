'use client'

import { useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'

// Define a type for the OrbitControls module
type OrbitControlsType = {
  OrbitControls: new (camera: THREE.Camera, domElement: HTMLElement) => {
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    enablePan: boolean;
    rotateSpeed: number;
    minDistance: number;
    maxDistance: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    update: () => void;
    dispose: () => void;
  }
}

interface OrbsProps {
  totalImages?: number;
  totalItems?: number;
  baseWidth?: number;
  baseHeight?: number;
  sphereRadius?: number;
  backgroundColor?: string;
}

const Orbs = ({
    totalImages = 10,
    totalItems = 30,
    baseWidth = 1,
    baseHeight = 0.6,
    sphereRadius = 5,
    backgroundColor = '#FDF2F8',
}: OrbsProps) => {
    const orbRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loadingRef = useRef<boolean>(true);
    const renderErrorCountRef = useRef<number>(0);
    const imageFallbackMode = useRef<boolean>(false);

    useEffect(() => {
        // Set a timeout to prevent indefinite loading
        timeoutRef.current = setTimeout(() => {
            if (loadingRef.current) {
                setError("Loading 3D experience timed out. Please try refreshing the page.");
                loadingRef.current = false;
            }
        }, 15000); // 15 seconds timeout

        // Check if WebGL is supported
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            setError("WebGL is not supported by your browser. Please try a different browser.");
            return;
        }

        // Detect performance capabilities and adjust settings
        let adjustedTotalItems = totalItems;
        let adjustedSphereRadius = sphereRadius;
        let lowPerformanceMode = false;

        // Simple performance detection - reduce complexity for mobile devices or smaller screens
        if (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            adjustedTotalItems = Math.min(12, Math.floor(totalItems / 2));
            adjustedSphereRadius = Math.max(3, sphereRadius - 1);
            lowPerformanceMode = true;
        }

        // Import THREE.js dynamically to avoid server-side rendering issues
        import('three').then((THREE) => {
            // Use a simpler approach for OrbitControls that doesn't rely on the exact path
            import('three/examples/jsm/controls/OrbitControls.js').then((OrbitControlsModule: any) => {
                try {
                    const { OrbitControls } = OrbitControlsModule;
                    
                    if (!orbRef.current) return;
                    
                    // Clear any existing renderer
                    if (rendererRef.current && orbRef.current.contains(rendererRef.current.domElement)) {
                        orbRef.current.removeChild(rendererRef.current.domElement);
                        rendererRef.current.dispose();
                    }

                    // Make sure the container is empty
                    while (orbRef.current.firstChild) {
                        orbRef.current.removeChild(orbRef.current.firstChild);
                    }

                    const scene = new THREE.Scene();
                    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                    
                    // Try to use a simple renderer configuration first
                    let renderer;
                    try {
                        renderer = new THREE.WebGLRenderer({
                            antialias: false, // Disable antialiasing for better performance
                            alpha: true,
                            powerPreference: 'default',
                            precision: 'mediump', // Medium precision for balance of quality and compatibility
                        });
                    } catch (e) {
                        console.error("Failed to create renderer:", e);
                        setError("Failed to initialize 3D renderer. Your device may not support this feature.");
                        return;
                    }
                    
                    rendererRef.current = renderer;
                    
                    // Set the renderer size to match the container size
                    const containerWidth = orbRef.current.clientWidth;
                    const containerHeight = orbRef.current.clientHeight;
                    renderer.setSize(containerWidth, containerHeight);
                    renderer.setClearColor(parseInt(backgroundColor.replace('#', '0x'), 16), 0.9);
                    
                    // Use a lower pixel ratio for better performance
                    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
                    
                    // Disable some advanced features for better compatibility
                    renderer.shadowMap.enabled = false;
                    
                    // Use sRGB encoding if available
                    if (renderer.outputColorSpace) {
                        renderer.outputColorSpace = THREE.SRGBColorSpace;
                    }
                    
                    orbRef.current.appendChild(renderer.domElement);

                    const controls = new OrbitControls(camera, renderer.domElement);
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.1;
                    controls.enableZoom = true;
                    controls.enablePan = false;
                    controls.rotateSpeed = 0.5;
                    controls.minDistance = 4;
                    controls.maxDistance = 10;
                    
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.3;

                    const textureLoader = new THREE.TextureLoader();
                    let loadedCount = 0;
                    
                    // Generate paths for images
                    const getImagePaths = (): string[] => {
                        // These images are directly from the assets folder
                        const allPossibleImages = [
                            "/assets/1.jpg",
                            "/assets/2.jpg", 
                            "/assets/3.jpg",
                            "/assets/4.jpg",
                            "/assets/5.jpg",
                            "/assets/6.jpg",
                            "/assets/7.jpg",
                            "/assets/8.jpg",
                            "/assets/img1.jpg",
                            "/assets/img2.jpg",
                            "/assets/img3.jpg",
                            "/assets/img4.jpg",
                            "/assets/img5.jpg",
                            "/assets/img6.jpg",
                            "/assets/img7.jpg"
                        ];
                        
                        // If we have fewer images than totalImages, we'll repeat some
                        if (allPossibleImages.length >= totalImages) {
                            return allPossibleImages.slice(0, totalImages);
                        } else {
                            // Repeat images to reach totalImages
                            const result: string[] = [];
                            for (let i = 0; i < totalImages; i++) {
                                result.push(allPossibleImages[i % allPossibleImages.length]);
                            }
                            return result;
                        }
                    };

                    const imagePaths = getImagePaths();
                    
                    // Create a plane with an image texture
                    const createImagePlane = (phi: number, theta: number, imagePath: string) => {
                        const onLoad = (texture: any) => {
                            try {
                                // Optimize texture for WebGL
                                texture.generateMipmaps = false;
                                texture.minFilter = THREE.LinearFilter;
                                texture.magFilter = THREE.LinearFilter;
                                
                                // Set color encoding if available
                                if (texture.colorSpace) {
                                    texture.colorSpace = THREE.SRGBColorSpace;
                                }
                                
                                // Get image aspect ratio to size plane correctly
                                const imageAspect = texture.image.width / texture.image.height;
                                let width = baseWidth;
                                let height = baseHeight;
                                
                                if (imageAspect > 1) {
                                    width = baseWidth * imageAspect;
                                } else {
                                    height = baseHeight / imageAspect;
                                }
                                
                                const geometry = new THREE.PlaneGeometry(width, height);
                                const material = new THREE.MeshBasicMaterial({
                                    map: texture,
                                    side: THREE.DoubleSide,
                                    transparent: true,
                                    opacity: 0.95
                                });
                                
                                const mesh = new THREE.Mesh(geometry, material);
                                positionMesh(mesh, phi, theta);
                                scene.add(mesh);
                                
                                loadedCount++;
                                
                                // Start animation once all items are loaded
                                if (loadedCount >= adjustedTotalItems) {
                                    loadingRef.current = false;
                                    startAnimation();
                                }
                            } catch (e) {
                                console.error("Error creating textured mesh:", e);
                                createColoredPlane(phi, theta, 0xff69b4);
                            }
                        };
                        
                        const onError = () => {
                            console.warn(`Failed to load image: ${imagePath}`);
                            createColoredPlane(phi, theta, 0xff69b4);
                            
                            // If we're getting many image load errors, switch to fallback mode
                            if (!imageFallbackMode.current && loadedCount < adjustedTotalItems * 0.3) {
                                imageFallbackMode.current = true;
                                console.warn("Switching to fallback mode for all remaining images");
                            }
                        };
                        
                        // If we're in fallback mode, don't even try to load images
                        if (lowPerformanceMode || imageFallbackMode.current) {
                            createColoredPlane(phi, theta, 0xff69b4);
                            return;
                        }
                        
                        // Attempt to load the texture
                        try {
                            textureLoader.load(imagePath, onLoad, undefined, onError);
                        } catch (e) {
                            console.error("Error in texture loader:", e);
                            createColoredPlane(phi, theta, 0xff69b4);
                        }
                    };
                    
                    // Fallback to a simple colored plane
                    const createColoredPlane = (phi: number, theta: number, color: number) => {
                        const geometry = new THREE.PlaneGeometry(baseWidth, baseHeight);
                        const material = new THREE.MeshBasicMaterial({ 
                            color: color,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.9
                        });
                        
                        const mesh = new THREE.Mesh(geometry, material);
                        positionMesh(mesh, phi, theta);
                        scene.add(mesh);
                        
                        loadedCount++;
                        
                        // Start animation once all items are loaded
                        if (loadedCount >= adjustedTotalItems) {
                            loadingRef.current = false;
                            startAnimation();
                        }
                    };
                    
                    // Position mesh function to avoid code duplication
                    const positionMesh = (mesh: THREE.Mesh, phi: number, theta: number) => {
                        mesh.position.set(
                            adjustedSphereRadius * Math.sin(phi) * Math.cos(theta), 
                            adjustedSphereRadius * Math.sin(phi) * Math.sin(theta), 
                            adjustedSphereRadius * Math.cos(phi)
                        );
                        
                        mesh.lookAt(0, 0, 0);
                        mesh.rotateY(Math.PI);
                        mesh.rotation.z += (Math.random() - 0.5) * 0.2;
                    };

                    // Create spherical arrangement of images
                    const createSphere = () => {
                        const repeatsPerImage = Math.ceil(adjustedTotalItems / totalImages);
                        
                        for (let i = 0; i < adjustedTotalItems; i++) {
                            const phi = Math.acos(-1 + (2 * i) / adjustedTotalItems);
                            const theta = Math.sqrt(adjustedTotalItems * Math.PI) * phi;
                            
                            // Select image path, distributing all images evenly around the sphere
                            const imageIndex = Math.floor(i / repeatsPerImage) % totalImages;
                            createImagePlane(phi, theta, imagePaths[imageIndex]);
                        }
                    };

                    camera.position.set(0, 0, 8);
                    
                    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
                    scene.add(ambientLight);
                    
                    let animationFrameId: number;
                    let animationActive = false;
                    let lastFrameTime = 0;
                    const targetFps = 24; // Target 24 FPS for better performance
                    const frameInterval = 1000 / targetFps;
                    
                    const animate = (time = 0) => {
                        if (!animationActive) return;
                        
                        // Throttle frame rate for better performance
                        const deltaTime = time - lastFrameTime;
                        if (deltaTime < frameInterval) {
                            animationFrameId = requestAnimationFrame(animate);
                            return;
                        }
                        
                        lastFrameTime = time - (deltaTime % frameInterval);
                        
                        try {
                            controls.update();
                            renderer.render(scene, camera);
                            renderErrorCountRef.current = 0; // Reset error count on successful render
                            animationFrameId = requestAnimationFrame(animate);
                        } catch (e) {
                            renderErrorCountRef.current++;
                            console.error("Render error:", e);
                            
                            // If there are too many render errors, stop the animation
                            if (renderErrorCountRef.current > 5) {
                                console.error("Too many render errors, stopping animation");
                                setError("There was a problem with the 3D rendering. Please try a different browser or device.");
                                stopAnimation();
                            } else {
                                // Try to continue
                                animationFrameId = requestAnimationFrame(animate);
                            }
                        }
                    };
                    
                    const startAnimation = () => {
                        animationActive = true;
                        animate();
                    };
                    
                    const stopAnimation = () => {
                        animationActive = false;
                        if (animationFrameId) {
                            cancelAnimationFrame(animationFrameId);
                        }
                    };

                    // Handle window resize
                    const handleResize = () => {
                        if (!orbRef.current || !rendererRef.current) return;
                        
                        const containerWidth = orbRef.current.clientWidth;
                        const containerHeight = orbRef.current.clientHeight;
                        
                        camera.aspect = containerWidth / containerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(containerWidth, containerHeight);
                    };
                    
                    window.addEventListener("resize", handleResize);

                    createSphere();
                    
                    // Return cleanup function
                    return () => {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }
                        
                        window.removeEventListener("resize", handleResize);
                        stopAnimation();
                        
                        if (controls) {
                            controls.dispose();
                        }
                        
                        if (rendererRef.current) {
                            if (orbRef.current && orbRef.current.contains(rendererRef.current.domElement)) {
                                orbRef.current.removeChild(rendererRef.current.domElement);
                            }
                            rendererRef.current.dispose();
                            rendererRef.current = null;
                        }
                        
                        // Dispose all geometries and materials
                        scene.traverse((object: any) => {
                            if (object.geometry) {
                                object.geometry.dispose();
                            }
                            
                            if (object.material) {
                                if (Array.isArray(object.material)) {
                                    object.material.forEach((material: any) => material.dispose());
                                } else {
                                    object.material.dispose();
                                }
                            }
                        });
                        
                        scene.clear();
                    };
                } catch (err) {
                    console.error("Failed to initialize Three.js scene:", err);
                    setError("Failed to initialize 3D experience. Your browser may not support this feature.");
                }
            }).catch(err => {
                console.error("Failed to load OrbitControls:", err);
                setError("Failed to load required 3D components");
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            });
        }).catch(err => {
            console.error("Failed to load Three.js:", err);
            setError("Failed to load 3D library");
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        });

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [backgroundColor, baseHeight, baseWidth, sphereRadius, totalImages, totalItems]);

    return (
        <div 
            ref={orbRef} 
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 z-10">
                    <div className="text-center max-w-md">
                        <p className="text-xl font-bold mb-2">Something went wrong</p>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orbs;
