/**
 * Create a default flat map data structure
 * 
 * @returns {Object} default flat map schema
 */

export function createDefaultMap() {
    return {
        rootId: "root",
        nodes: {
            "root": {
                id: "root",
                tag: "main",
                children: [],
                attributes: {
                    class: "container"
                },
                textContent: ""
            }
        }
    }
};

/**
 * create a single formated node object with defaults
 * 
 * @param {string} id - Unique node ID.
 * @param {string} tag - HTML tag name.
 * @aram {Object} options - optional attributes, textContent, and children.
 * @returns {Object} Node schema object
 */

export function createNode(id, tag, options = {}) {
    return {
        id,
        tag,
        attributes: options.attributes || {},
        children: options.children || [],
        textContent: options.textContent || "",
        ...(options.metadata ? { metadata: options.metadata } : {})
    };
}

export function createAndValidateNode(id, tag, options = {}) {
    const node = createNode(id, tag, options);
    const result = validateNode(node);

    if (!result.isValid) {
        throw new Error(`Failed to create node: '${result}'`)
    };

    return node;
}

/**
 * Validates if a given object is a valid flat map node
 * 
 * @param {Object} node
 * @return {{id: string, valid: boolean, errors:[string]}}
 */

export function validateNode(node) {
    if (!node || typeof node !== "object") {
        return {
            id: undefined,
            isValid: false,
            errors: ["Node must be a non-null object"]
        };
    };

    const errors = [];

    if (!node || typeof node !== "object") {
        return { valid: false, errors: ["Node mustbe a non-null object."] };
    };

    if (typeof node.id !== "string" || !node.id.trim()) {
        errors.push("Node must have a non-empty string 'id'.");
    };

    if (typeof node.tag !== "string" || !node.tag.trim()) {
        errors.push("Node must have a non-empty string 'tag'.");
    };

    if (!Array.isArray(node.children)) {
        errors.push("Node 'children' property must be an array of IDs.");
    };

    if (node.attributes && typeof node.attributes !== "object") {
        errors.push("Node 'attributes' must be a valid object.");
    };


    return {
        id: node.id,
        isValid: errors.length === 0,
        errors: errors
    }

};

/**
 * Validates a flat map object
 * 
 * @param {Object} map
 * @returns{{map: {object}, valid: boolean, errors: [string]}}
 */

export function validateFlatMap(map) {

    if (!map || typeof map !== "object") {

        return {
            map,
            isValid: false,
            errors: ["Flat map must be an object"]
        };
    };

    const errors = [];

    if (typeof map.rootId != "string" || !map.rootId.trim()) {
        errors.push("Map is missing a valid 'rootId'.");
    }

    if (!map.nodes || typeof map.nodes !== "object") {
        errors.push("Map is missing the 'nodes' dictionary.")
    } else if (map.rootId && !map.nodes[map.rootId]) {
        errors.push(`Root node '${map.rootId}' is missing from the 'nodes' dictionary.`)
    }

    if (map.nodes && typeof map.nodes === "object") {
        Object.entries(map.nodes).forEach(([key, node]) => {
            if (key !== node.id) {
                errors.push(`Dictionary key '${key}' does not match node.id '${node.id}'.`);
            }

            const nodeValidationResponse = validateNode(node);

            if (!nodeValidationResponse.isValid) {
                errors.push(`Invalid node '${key}': ${nodeValidationResponse.errors.join(", ")}`);
            };

            if (node && Array.isArray(node.children)) {
                node.children.forEach(childId => {
                    if (!map.nodes[childId]) {
                        errors.push(`Node '${node.id}' references non-existent child ID '${childId}'.`);
                    }
                });
            };
        });
    }

    return {
        map,
        isValid: errors.length === 0,
        errors: errors
    };


}