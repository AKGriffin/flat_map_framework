// tests/schema.test.js
import { describe, test, expect } from "./assert.js";
import {
    createDefaultMap,
    createNode,
    createAndValidateNode,
    validateNode,
    validateFlatMap
} from "../src/core/Schema.js";

describe("Milestone 1.1: Schema & Factory Helpers", () => {
    test("createDefaultMap produces a valid flat map schema", () => {
        const defaultMap = createDefaultMap();
        const result = validateFlatMap(defaultMap);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    test("createNode applies correct fallback defaults", () => {
        const node = createNode("card-1", "div");
        expect(node).toEqual({
            id: "card-1",
            tag: "div",
            attributes: {},
            children: [],
            textContent: ""
        });
    });

    test("createAndValidateNode creates a valid node successfully", () => {
        const node = createAndValidateNode("btn-1", "button", { textContent: "Click Me" });
        expect(node.id).toBe("btn-1");
        expect(node.tag).toBe("button");
    });

    test("createAndValidateNode throws an error on invalid arguments", () => {
        expect(() => {
            createAndValidateNode("", ""); // Empty ID and empty Tag
        }).toThrow();
    });
});

describe("Milestone 1.1: Node Validation Integrity", () => {
    test("validateNode rejects null or non-object values", () => {
        const result = validateNode(null);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toBe("Node must be a non-null object");
    });

    test("validateNode flags missing or empty 'id' and 'tag'", () => {
        const invalidNode = { id: "", tag: " ", children: [] };
        const result = validateNode(invalidNode);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(2);
    });

    test("validateNode ensures 'children' is an array", () => {
        const invalidNode = { id: "node-1", tag: "div", children: "not-an-array" };
        const result = validateNode(invalidNode);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toBe("Node 'children' property must be an array of IDs.");
    });
});

describe("Milestone 1.1: Flat Map Integrity Checks", () => {
    test("validateFlatMap detects missing root node in dictionary", () => {
        const brokenMap = {
            rootId: "missing-root",
            nodes: {
                "node-1": { id: "node-1", tag: "div", children: [] }
            }
        };
        const result = validateFlatMap(brokenMap);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Root node 'missing-root' is missing from the 'nodes' dictionary.");
    });

    test("validateFlatMap detects dictionary key mismatch", () => {
        const keyMismatchMap = {
            rootId: "root",
            nodes: {
                "root": { id: "root", tag: "main", children: ["wrong-key"] },
                "wrong-key": { id: "correct-id", tag: "div", children: [] }
            }
        };
        const result = validateFlatMap(keyMismatchMap);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toBe("Dictionary key 'wrong-key' does not match node.id 'correct-id'.");
    });

    test("validateFlatMap detects non-existent child ID references (orphans)", () => {
        const orphanMap = {
            rootId: "root",
            nodes: {
                "root": { id: "root", tag: "main", children: ["ghost-child-id"] }
            }
        };
        const result = validateFlatMap(orphanMap);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toBe("Node 'root' references non-existent child ID 'ghost-child-id'.");
    });
});