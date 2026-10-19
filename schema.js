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
}