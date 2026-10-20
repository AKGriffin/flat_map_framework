# flat_map_framework


## Key Architectural Improvements

1. **Schema Standardization & Strict Contracts**
Enforce a strict node schema that cleanly separates standard HTML attributes, internal metadata, and custom action triggers. Introduce runtime JSON Schema validation for all operations.


2. **Decoupled Event Bus & Action Pipeline**
Implement a dedicated `EventBus` pub/sub module. Decouple event firing from DOM rendering so custom actions (`action-type`) can be tested, mocked, or logged independently of the preview UI.


3. **Batch Mutations & History Compression**
 Introduce transaction-based mutations (`store.batch(() => { ... })`). Adding a complex template with 10 nodes records a single undo entry rather than cluttering history or performing redundant clones.


4. **Normalized Component Registry**
 Treat registered Web Components as first-class citizens with formal prop definitions, default attributes, and slots, making component injection seamless.


5. **Unified Multi-View State**
Use a unified reactive UI rendering scheduler that re-renders all active views in a single microtask frame on state changes.



---

## Master Project Milestones & Sub-Milestones

### Milestone 1: Core Architecture & Data Engine

* **1.1 Data Model & Schema Definition**
* Define the Flat Map JSON schema ($O(1)$ node lookup dictionary indexed by unique IDs).
* Implement node schema validation (`id`, `tag`, `children`, `attributes`, `textContent`).


* **1.2 State Store & Reactive Subscriptions**
* Build `FlatMapStore` with subscriber notifications (`subscribe`/`notify`).
* Implement transactional batching (`store.batch()`) for grouped state updates.


* **1.3 Atomic Mutators (`src/core/Mutators.js`)**
* `addNode`: Insert new node under parent.
* `updateNode`: Modify text content or attributes.
* `deleteNode`: Recursive removal of node and descendant sub-trees.
* `moveNode`: Reparenting and index reordering with descendant loop checks.


* **1.4 History Manager (Undo / Redo)**
* Implement past/future snapshot stacks with configurable depth limits.
* Expose `canUndo` and `canRedo` flags to sync UI control states.


* **1.5 Offline Persistence**
* Implement automatic synchronization with browser `localStorage`.
* Provide fallback default initial state on cold boots.



---

### Milestone 2: Pure Render Engine (`src/engine`)

* **2.1 Dynamic DOM Compiler (`RenderEngine.js`)**
* Implement recursive $O(1)$ tree construction from flat JSON dictionaries.
* Attach `data-node-id` attributes to DOM nodes for UI selection.


* **2.2 Web Component Registry (`ComponentRegistry.js`)**
* Register custom HTML tags with defined attributes, defaults, and schemas.


* **2.3 Custom Action Event Bus (`EventBus.js`)**
* Global event delegation for elements tagged with `action-type`.
* Unified event dispatching for application-level handling.


* **2.4 Clean Production Exporter (`ExportEngine.js`)**
* Generate standalone, editor-free HTML strings.
* Support inline CSS generation and clean structural formatting.



---

### Milestone 3: Editor Studio UI (`src/ui`)

* **3.1 Multi-View Navigation Bar**
* **Tree Hierarchy View (`TreeView.js`)**: Visual parent-child tree.
* **Dictionary Hash Map View (`DictView.js`)**: Raw key-value dictionary view.


* **3.2 Interactive Property Inspector (`Inspector.js`)**
* Tag-based CSS class manager (chip/badge interface with `×` deletion).
* Text content and custom action string inputs.
* Dynamic attribute input fields generated from `ComponentRegistry`.


* **3.3 Direct Canvas Interaction**
* Click-to-select elements inside the live preview canvas.
* Hover outline overlays to highlight target elements.


* **3.4 Drag-and-Drop Structure Reordering**
* Drag-and-drop reparenting in the Tree View using native HTML5 DND APIs.



---

### Milestone 4: Productivity Tools & Workflows

* **4.1 Sub-Tree Cloning Engine**
* Recursive deep-copying of node branches with fresh unique ID generation (`Ctrl+D`).


* **4.2 Global Search & Filter System (`Search.js`)**
* Real-time node filtering across views by ID, tag name, class name, or text content.


* **4.3 Component Preset Library (`Templates.js`)**
* Multi-node layout fragment generators (Hero Section, Feature Cards, Navbars).
* Single-click template injection into any selected parent container.


* **4.4 Global Keyboard Shortcuts**
* Hotkeys for Undo (`Ctrl+Z`), Redo (`Ctrl+Y` / `Cmd+Shift+Z`), and Duplicate (`Ctrl+D`).
* Smart input focus checking to prevent triggering hotkeys while typing.



---

### Milestone 5: Interoperability & Refactoring

* **5.1 ES Module Decoupling (`/src/core`, `/src/engine`, `/src/ui`)**
* Clean JavaScript module structure using strict native ES import/export syntax (`type="module"`).


* **5.2 JSON Import / Export System**
* Import modal with JSON schema validation.
* Export suite with clipboard copying and `.json` file download capabilities.


* **5.3 Developer Test Suite & Documentation**
* Unit tests for pure mutator functions (`add`, `delete`, `move`, `clone`).
* API documentation for registering custom components and action handlers.