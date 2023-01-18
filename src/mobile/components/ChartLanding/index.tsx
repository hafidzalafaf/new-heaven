import React, { useEffect } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    Filler,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    ScriptableContext,
    CategoryScale,
} from 'chart.js';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, CategoryScale);

interface ChartLandingMobileProps {
    data: number[];
    label: string[];
    width: number;
    height: number;
    bgGradient: string;
    statusBd: string;
}

const formatValue = (value: number) =>
    Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 3,
    }).format(value);

const ChartLandingMobile: React.FC<ChartLandingMobileProps> = ({
    data,
    label,
    width,
    height,
    bgGradient,
    statusBd,
}) => {
    // Init canvas for chart
    const canvas = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvas.current;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        data: data,
                        fill: 'start',
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 0,
                        borderColor: statusBd,
                        pointBackgroundColor: 'rgb(22, 22, 22)',
                        backgroundColor: (context: ScriptableContext<'line'>) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, `${bgGradient}`);
                            gradient.addColorStop(0.19, 'rgba(0,0,0, 0)');
                            return gradient;
                        },
                    },
                ],
            },
            options: {
                layout: {
                    padding: 1,
                },
                scales: {
                    x: {
                        display: false,
                        beginAtZero: true,
                    },
                    y: {
                        display: false,
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest',
                },
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            beforeTitle: () => '',
                            title: () => '',
                            label: (ctx) => formatValue(ctx.parsed.y).toString(),
                        },
                    },
                },
            },
        });
        return () => chart.destroy();
    });

    return <canvas ref={canvas} width={width} height={height}></canvas>;
};

export { ChartLandingMobile };
