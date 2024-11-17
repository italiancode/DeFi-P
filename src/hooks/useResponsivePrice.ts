import { useState, useEffect, useMemo } from 'react';

export const useResponsivePrice = (price: number | undefined | null) => {
    const [decimals, setDecimals] = useState(2);

    useEffect(() => {
        const updateDecimals = () => {
            // Adjust the decimal points based on the screen size
            if (window.innerWidth <= 400) {
                setDecimals(0); // No decimals for very small screens
            } else if (window.innerWidth <= 768) {
                setDecimals(2); // 2 decimals for tablets and smaller screens
            } else {
                setDecimals(3); // 3 decimals for larger screens
            }
        };

        // Initialize on component mount
        updateDecimals();

        // Update on window resize
        window.addEventListener('resize', updateDecimals);

        // Cleanup event listener
        return () => {
            window.removeEventListener('resize', updateDecimals);
        };
    }, []);

    // Define a return type for the hook
    type PriceResult = {
        type: 'regular' | 'small';
        value: string;
        zeros?: number;
        significantDigits?: string;
    };

    // Smart rounding logic based on price magnitude
    const smartRound = (value: number | undefined | null): PriceResult => {
        if (value === undefined || value === null) return { type: 'regular', value: '0' };
        
        const num = Number(value);
        if (isNaN(num)) return { type: 'regular', value: '0' };

        // For very small numbers (less than 0.01)
        if (num < 0.01 && num > 0) {
            const numStr = num.toFixed(10);
            const zeroCount = (numStr.match(/^0\.0*/)?.[0]?.length ?? 2) - 2;
            
            if (zeroCount >= 2) {
                const significantDigits = numStr.slice(zeroCount + 2, zeroCount + 4);
                return {
                    type: 'small',
                    value: '0.0',
                    zeros: zeroCount,
                    significantDigits
                };
            }
        }

        // For regular numbers
        if (num >= 1000000) return { type: 'regular', value: (num / 1000000).toFixed(2) + 'M' };
        if (num >= 1000) return { type: 'regular', value: (num / 1000).toFixed(2) + 'K' };
        if (num >= 1) return { type: 'regular', value: num.toFixed(2) };
        if (num >= 0.01) return { type: 'regular', value: num.toFixed(4) };
        
        return { type: 'regular', value: num.toFixed(4) };
    };

    // Apply smart rounding to the price
    return smartRound(price);
};