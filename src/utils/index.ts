import { type ClassValue, clsx } from "clsx"


export * from './router'
export * from './tokens'
export * from './tools'


export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}



export function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}


export function reorder<T = any>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export function reorderMixed<T = any>(listA: T[], listB: T[], startIndex: number, endIndex: number): [T[], T[]] {
    const resultA = Array.from(listA);
    const resultB = Array.from(listB);
    const [remove] = resultA.splice(startIndex, 1)

    resultB.splice(endIndex, 0, remove)

    return [resultA, resultB]
}


export function formatTimeHourMinSec(date: Date) {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
}


export function formatTimeYearMonthDay(date: Date) {
    return `${date.getFullYear().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}`
}


export function durationWithAutoUnit(duration: number | undefined) {
    if (!duration) {
        return ''
    }

    if (duration < 1000) {
        return `${duration} 毫秒`
    }

    if (duration < 60000) {
        return `${duration / 1000} 秒`
    }

    if (duration < 3600000) {
        return `${(duration / 60000).toFixed(2)} 分钟`
    }

    if (duration < 86400000) {
        return `${(duration / 3600000).toFixed(2)} 小时`
    }


    if (duration < 604800000) {
        return `${(duration / 86400000).toFixed(2)} 天`
    }
}


/**
 * Calculates the speed based on the given frequency.
 *
 * @param {string} freq - The frequency value line/seconds.
 * @return {number} The calculated speed.  mm/seconds
 */
export function freqToSpeed(freq: number, dpi: number) {
    return pixelToMm(freq, dpi)
}

export function pixelToMm(pixel: number, dpi: number) {
    if (!dpi) {
        return 0
    }
    return pixel / dpi * 25.4
}

export function mmToPixel(mm: number, dpi: number) {
    if (!dpi) {
        return 0
    }
    return mm / 25.4 * dpi
}