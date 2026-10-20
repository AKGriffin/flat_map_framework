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

}

