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
    /**
     * Represented as an array of objects, with each object containing information about data.
     */
    data: number[];

    /**
     * Describe a specific data point or data series on the chart
     */
    label: string[];

    /**
     * Property refers to the width of the chart area (excluding labels, axes, and other elements) in pixels.
     */
    width: number;

    /**
     * Property refers to the vertical dimension of a chart or graph.
     */
    height: number;

    /**
     * Setting color of chart area with gradient color
     */
    backgroundGradient?: string;

    /**
     * Setting color of border chart on type line
     */
    borderColor: string;
}

/**
 * Handle displaying format currency in USD.
 */
const formatValue = (value: number) =>
    Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 4,
    }).format(value);

const ChartLandingMobile: React.FC<ChartLandingMobileProps> = ({
    data,
    label,
    width,
    height,
    backgroundGradient,
    borderColor,
}) => {
    /**
     * Initial canvas for make chart timeseries price using kline data
     */
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
                        borderColor: borderColor,
                        pointBackgroundColor: 'rgb(22, 22, 22)',
                        backgroundColor: (context: ScriptableContext<'line'>) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, `${backgroundGradient}`);
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
