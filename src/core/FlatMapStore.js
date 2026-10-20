import { validateFlatMap, createDefaultMap } from "./Schema.js";

/**
 * Central State Store for Flat Map Schema with Reactive Subscriptions.
 */

export class FlatMapStore {

    /**
     * @param {Object} [initialMap] - Optional initial Flat Map schema.
     */

    constructor(initialMap = createDefaultMap()) {
        const validation = validateFlatMap(initialMap);

        if (!validation.isValid) {
            throw new Error(`Cannot initialize store with invalid map: ${validation.errors.join(", ")}`);
        }

        this._state = JSON.parse(JSON.stringify(initialMap));
        this._listeners = new Map();
    }

    /**
     * Returns a clone of the current Flat Map state.
     * 
     * @returns {Object}
     */

    getState() {
        return JSON.parse(JSON.stringify(this._state));
    };

    /**
     * Get a node by ID.
     * 
     * @param {string} nodeId 
     * @returns {Object|null}
     */
    getNode(nodeId) {
        const node = this._state.nodes[nodeId];
        return node ? JSON.parse(JSON.stringify(node)) : null;
    }

    /**
     * Subscribe to store event changes.
     * 
     * @param {string} event - Event name
     * @param {Function} callback - Listener function
     * @returns {Function} Unsubscribe function
     */

    subscribe(event, callback) {
        if (typeof callback !== "function") {
            throw new Error("Listener callback must be a function.");
        }

        (this._listeners.get(event) ??= new Set()).add(callback);

        return () => {
            const eventListeners = this._listeners.get(event);

            if (eventListeners) {
                eventListeners.delete(callback);
                if (eventListeners.size === 0) {
                    this._listeners.delete(event);
                }
            }
        }
    }

    /**
     * Internal method to notify event subscribers.
     * @param {string} event 
     * @param {Object} payload 
     * @private
     */
    _emit(event, payload = {}) {
        const eventListeners = this._listeners.get(event);

        if (eventListeners) {
            eventListeners.forEach(callback => callback(payload, this.getState()));
        }

        if (event !== "change") {
            const globalListeners = this._listeners.get("change");
            if (globalListeners) {
                globalListeners.forEach(callback => callback({ event, ...payload }, this.getState()));
            }
        }
    }

    /**
     * Adds a new node to the store and attaches it to a parent node.
     * 
     * @param {Object} node - Valid node object to add.
     * @param {Object} parentId - ID of the parent node.
     * @param {number} [index=null] - Target index in parent's array.
     */

    addNode(node, parentId, index = null) {
        if (!node || !node.id) {
            throw new Error("Cannot add invalid node");
        };

        if (this._state.nodes[node.id]) {
            throw new Error(`Node with ID '${node.id}' already exists.`);
        };

        const parent = this._state.nodes[parentId];
        if (!parent) {
            throw new Error(`Parent node '${parentId}' does not exist`);
        };

        this._state.nodes[node.id] = JSON.parse(JSON.stringify(node))

        if (typeof index === "number" && index >= 0 && index <= parent.children.length) {
            parent.children.splice(index, 0, node.id);
        } else {
            parent.children.push(node.id);
        };

        this._emit("node:add", { nodeId: node.id, parentId });
    }

    /**
     * Updates and existing node's properties.
     * 
     * @param {string} nodeId - Target node ID.
     * @param {Object} [updatess= {}] - Partial property updates.
     */

    updateNode(nodeId, updates = {}) {
        const node = this._state.nodes[nodeId];
        if (!node) {
            throw new Error(`Node '${nodeId}' not found.`);
        };

        const { id, ...validUpdates } = updates;

        if (validUpdates.attributes) {
            node.attributes = { ...node.attributes, ...validUpdates.attributes };
            delete validUpdates.attributes;
        };

        if (validUpdates.metadata) {
            node.metadata = { ...node.metadata, ...validUpdates.metadata };
            delete validUpdates.metadata;
        }

        Object.assign(node, validUpdates);

        this._emit("node:update", { nodeId, updates });

    };

    /**
     * 
     */
}

