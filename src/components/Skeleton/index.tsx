import React from 'react';
import Skeleton, { SkeletonProps, SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';
import { selectCurrentColorTheme } from 'src/modules';

interface SkeletonContainerProps extends SkeletonProps {
    loading: boolean;
}

export const SkeletonCom: React.FC<SkeletonContainerProps> = ({ loading, height, width, className, children }) => {
    const theme = useSelector(selectCurrentColorTheme);

    return (
        <>
            {loading ? (
                <SkeletonTheme
                    baseColor={theme === 'dark' ? '#2D3748' : '#CBD5E0'}
                    highlightColor={theme === 'dark' ? '#718096' : '#E2E8F0'}>
                    <Skeleton height={height} width={width} className={className} />
                </SkeletonTheme>
            ) : (
                children
            )}
        </>
    );
};
