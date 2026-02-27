import { FilterXSS } from 'xss';

// Customize xss options if needed. By default, it removes all dangerous tags like <script>.
const defaultXssOptions = {
    whiteList: {}, // Empty whitelist means strip ALL HTML tags.
    stripIgnoreTag: true, // Strip tags not in the whitelist
    stripIgnoreTagBody: ['script', 'style'] // Strip the content inside these tags
};

const customXss = new FilterXSS(defaultXssOptions);

/**
 * Sanitizes a string input by removing all HTML tags and preventing XSS.
 * If the input is null or undefined, it returns the input as is.
 */
export function sanitizeInput(input: string): string;
export function sanitizeInput(input: undefined): undefined;
export function sanitizeInput(input: null): null;
export function sanitizeInput(input: string | undefined | null): string | undefined | null {
    if (typeof input !== 'string') {
        return input;
    }
    return customXss.process(input);
}

/**
 * Sanitizes an object's string properties recursively.
 * Note: Only sanitizes enumerable own string properties.
 */
export function sanitizeObject<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item)) as unknown as T;
    }

    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitizedObj[key] = sanitizeInput(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitizedObj[key] = sanitizeObject(value);
        } else {
            sanitizedObj[key] = value;
        }
    }

    return sanitizedObj as unknown as T;
}
