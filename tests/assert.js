// tests/assert.js
// Dependency-free, pure Vanilla JS test harness for browser console execution.

export function describe(label, fn) {
    console.group(`%c=== ${label} ===`, "color: #2563eb; font-weight: bold; font-size: 14px;");
    fn();
    console.groupEnd();
}

export function test(label, fn) {
    try {
        fn();
        console.log(`%c  ✓ ${label}`, "color: #16a34a; font-weight: bold;");
    } catch (err) {
        console.error(`%c  ✕ ${label}`, "color: #dc2626; font-weight: bold;");
        console.error(`    ${err.message}`);
    }
}

export function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected "${expected}" (${typeof expected}) but got "${actual}" (${typeof actual})`);
            }
        },
        toEqual(expected) {
            const actualStr = JSON.stringify(actual);
            const expectedStr = JSON.stringify(expected);
            if (actualStr !== expectedStr) {
                throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
            }
        },
        toContain(item) {
            if (Array.isArray(actual) ? !actual.includes(item) : !String(actual).includes(item)) {
                throw new Error(`Expected ${JSON.stringify(actual)} to contain "${item}"`);
            }
        },
        toThrow() {
            let threw = false;
            try {
                if (typeof actual === "function") {
                    actual();
                } else {
                    throw new Error("Target passed to .toThrow() must be a function.");
                }
            } catch (e) {
                if (e.message === "Target passed to .toThrow() must be a function.") throw e;
                threw = true;
            }
            if (!threw) {
                throw new Error("Expected function to throw an error, but it executed successfully.");
            }
        }
    };
}