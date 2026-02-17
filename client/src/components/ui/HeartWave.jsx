import { useEffect, useRef, useState } from "react";

export function HeartWave({ progress, type = 'light' }) {
    const [translateX, setTranslateX] = useState(0);
    const [translateXS, setTranslateXS] = useState(640);
    const requestRef = useRef()
    const clamped = Math.min(100, Math.max(0, progress));

    const minY = 10;
    const maxY = 580;
    const translateY = maxY - (clamped / 100) * (maxY - minY);

    const animate = time => {
        setTranslateX(prev => {
            return prev === -1027 ? 570 : prev -1;
        });
        setTranslateXS(prev => {
            return prev === -1027 ? 570 : prev -1;
        });
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="relative">
            <svg
                viewBox="0 0 640 640"
                width='1em'
                height='1em'
                className="w-30 h-30 md:w-50 md:h-50"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <path
                        id="heart"
                        d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"
                        transform="translate(-80 -64) scale(1.25 1.25)"
                    />

                    <mask id="heart-mask">
                        <use href="#heart" fill="white" />
                    </mask>
                </defs>

                <use href="#heart" className={`${type === 'dark' ? 'fill-main' : 'fill-white'}`} />

                <g mask="url(#heart-mask)">
                    <g height='1em' transform={`translate(${translateX} ${translateY})`}>
                        <path
                            d="
                                M0 40
                                Q40 20 80 40
                                T160 40
                                T240 40
                                T320 40
                                T400 40
                                T480 40
                                T560 40
                                T640 40
                                T720 40
                                T800 40
                                T880 40
                                T960 40
                                T1024 40
                                V640 H0 Z
                                "
                            className="fill-special"
                        />
                    </g>
                    <g height='1em' transform={`translate(${translateXS} ${translateY})`}>
                        <path
                            d="
                                M0 40
                                Q40 20 80 40
                                T160 40
                                T240 40
                                T320 40
                                T400 40
                                T480 40
                                T560 40
                                T640 40
                                T720 40
                                T800 40
                                T880 40
                                T960 40
                                T1024 40
                                V640 H0 Z
                                "
                            className="fill-special"
                        />
                    </g>
                </g>
            </svg>
            <h4 className={`font-semibold text-2xl md:text-5xl font-header text-center ${type === 'dark' ? 'text-white' : 'text-main'} absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]`}>{progress}%</h4>
        </div>
    );
}
