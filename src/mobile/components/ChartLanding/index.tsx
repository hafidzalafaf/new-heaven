import React, { ReactElement, FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart,
    LineController,
    LineElement,
    Filler,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    CategoryScale,
} from 'chart.js';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, CategoryScale);

// interface ChartLandingProps {
//     id: string;
//     theme: Theme;
//     className?: string;
//     labels?: number[];
//     data?: number[];
// }

// interface ChartData {
//     labels: string[];
//     datasets: {
//         label: string;
//         data: number[];
//         backgroundColor?: string;
//         borderColor?: string;
//         borderWidth?: number;
//         pointRadius?: number;
//     }[];
// }

// interface ChartOptions {
//     title: {
//         display: boolean;
//         text: string;
//         fontSize: number;
//     };
//     legend: {
//         display: boolean;
//         position: string;
//     };
// }

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
                        pointHoverRadius: 3,
                        clip: 20,
                    },
                ],
            },
            options: {
                chartArea: {
                    backgroundColor: '',
                },
                layout: {
                    padding: 1,
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                    },
                },
            },
            interaction: {
                intersect: false,
                mode: 'nearest',
            },
            maintainAspectRatio: false,
            resizeDelay: 200,
        });
        return () => chart.destroy();
    });

    return <canvas ref={canvas} width={width} height={height}></canvas>;
};

export { ChartLandingMobile };
