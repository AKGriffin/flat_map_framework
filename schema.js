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
        ...arguments(options.metadata ? { metadata: options.metadata } : {})
    };
}