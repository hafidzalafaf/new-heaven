import React, { ReactElement, FC } from 'react';
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

const ChartLandingMobile = ({ data, label, width, height }) => {
    const canvas = React.useRef(null);

    React.useEffect(() => {
        const ctx = canvas.current;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        data: data,
                        fill: true,
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 0,
                        borderColor: 'rgb(2,195,189)',
                        pointBackgroundColor: 'rgb(22, 22, 22)',
                        // backgroundColor: (context: ScriptableContext<'line'>) => {
                        //     const ctx = context.chart.ctx;
                        //     const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        //     gradient.addColorStop(0, 'rgba(2,195,189, 0.5)');
                        //     gradient.addColorStop(0.15, 'rgba(0,0,0, 1)');
                        //     return gradient;
                        // },

                        pointHoverRadius: 3,
                        clip: 20,
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
                resizeDelay: 200,
            },
        });
        return () => chart.destroy();
    });

    return <canvas ref={canvas} width={width} height={height}></canvas>;
};

export { ChartLandingMobile };
