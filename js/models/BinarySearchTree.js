/**
 * Binary Search Tree implementation
 */
class BinarySearchTree {
    constructor() {
        this.root = null;
        this.history = [];
    }

    /**
     * Insert a new value into the BST
     */
    insert(value) {
        const newNode = new TreeNode(value);

        if (this.root === null) {
            this.root = newNode;
            this.saveSnapshot(`Inserted ${value} as root node since the tree was empty`);
            return;
        }

        const path = [];
        this.insertNodeWithPath(this.root, newNode, path);

        // Generate explanation
        const explanation = this.generateInsertExplanation(value, path);
        this.saveSnapshot(`Inserted ${value}: ${explanation}`);
    }

    /**
     * Helper method to insert a node recursively and track the path
     */
    insertNodeWithPath(node, newNode, path) {
        // If new value is less than current node, go to left subtree
        if (newNode.value < node.value) {
            path.push({
                node: node.value,
                direction: 'left'
            });
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNodeWithPath(node.left, newNode, path);
            }
        }
        // If new value is greater than current node, go to right subtree
        else {
            path.push({
                node: node.value,
                direction: 'right'
            });
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNodeWithPath(node.right, newNode, path);
            }
        }
    }

    /**
     * Generate explanation for insertion operation
     */
    generateInsertExplanation(value, path) {
        if (path.length === 0) return '';

        let explanation = 'Placed as ';
        path.forEach((step, index) => {
            if (index === path.length - 1) {
                explanation += `${step.direction} child of ${step.node}`;
            } else {
                explanation += `${step.node} → `;
            }
        });

        return explanation;
    }

    /**
     * Delete a value from the BST
     */
    delete(value) {
        if (this.root === null) {
            return null;
        }

        const deletionInfo = {
            explanation: '',
            succesorValue: null
        };
        this.root = this.deleteNodeWithInfo(this.root, value, deletionInfo);

        if (deletionInfo.explanation) {
            this.saveSnapshot(`Deleted ${value}: ${deletionInfo.explanation}`);
        } else {
            this.saveSnapshot(`Deleted ${value}`);
        }
    }

    /**
     * Helper method to delete a node recursively with explanation
     */
    deleteNodeWithInfo(node, value, info) {
        if (node === null) {
            return null;
        }

        // Navigate to the node to delete
        if (value < node.value) {
            node.left = this.deleteNodeWithInfo(node.left, value, info);
        } else if (value > node.value) {
            node.right = this.deleteNodeWithInfo(node.right, value, info);
        } else {
            // Case 1: Leaf node
            if (node.left === null && node.right === null) {
                info.explanation = `Removed leaf node ${value}`;
                return null;
            }
            // Case 2: Node with only one child
            else if (node.left === null) {
                info.explanation = `Removed node ${value} with right child, replaced by ${node.right.value}`;
                return node.right;
            } else if (node.right === null) {
                info.explanation = `Removed node ${value} with left child, replaced by ${node.left.value}`;
                return node.left;
            }
            // Case 3: Node with two children
            else {
                // Find the minimum value in the right subtree
                const minValue = this.findMinValue(node.right);
                info.explanation = `Removed node ${value} with two children, replaced by successor ${minValue}`;
                info.successorValue = minValue;

                node.value = minValue;
                // Delete the duplicate from the right subtree
                node.right = this.deleteNode(node.right, minValue);
            }
        }

        return node;
    }

    /**
     * Original delete node method (without explanation)
     */
    deleteNode(node, value) {
        if (node === null) {
            return null;
        }

        // Navigate to the node to delete
        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // Case 1: Leaf node
            if (node.left === null && node.right === null) {
                return null;
            }
            // Case 2: Node with only one child
            else if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }
            // Case 3: Node with two children
            else {
                // Find the minimum value in the right subtree
                const minValue = this.findMinValue(node.right);
                node.value = minValue;
                // Delete the duplicate from the right subtree
                node.right = this.deleteNode(node.right, minValue);
            }
        }

        return node;
    }

    /**
     * Find the minimum value in a subtree
     */
    findMinValue(node) {
        if (node.left === null) {
            return node.value;
        }
        return this.findMinValue(node.left);
    }

    /**
     * Update a value in the BST
     * Implemented as delete old value and insert new value
     */
    update(oldValue, newValue) {
        // Search for the node with oldValue
        if (!this.search(this.root, oldValue)) {
            console.log(`Value ${oldValue} not found in the tree`);
            return;
        }

        // Get deletion explanation
        const deletionInfo = {
            explanation: '',
            succesorValue: null
        };
        this.root = this.deleteNodeWithInfo(this.root, oldValue, deletionInfo);

        // Insert the new value and track path
        const newNode = new TreeNode(newValue);
        const insertPath = [];

        if (this.root === null) {
            this.root = newNode;
            this.saveSnapshot(`Updated ${oldValue} to ${newValue}: Inserted as root since tree became empty`);
            return;
        }

        this.insertNodeWithPath(this.root, newNode, insertPath);
        const insertExplanation = this.generateInsertExplanation(newValue, insertPath);

        // Combined explanation
        const explanation = `${deletionInfo.explanation || 'Removed '+oldValue}, then ${insertExplanation || 'added '+newValue}`;
        this.saveSnapshot(`Updated ${oldValue} to ${newValue}: ${explanation}`);
    }

    /**
     * Search for a value in the BST
     */
    search(node, value) {
        if (node === null) {
            return false;
        }

        if (node.value === value) {
            return true;
        }

        if (value < node.value) {
            return this.search(node.left, value);
        } else {
            return this.search(node.right, value);
        }
    }

    /**
     * Get all nodes in the tree in an array format suitable for visualization
     */
    getTreeData() {
        if (!this.root) return null;

        // Convert tree to hierarchical structure for d3.js
        const convertToHierarchy = (node) => {
            if (!node) return null;

            return {
                name: node.value,
                children: [
                    node.left ? convertToHierarchy(node.left) : null,
                    node.right ? convertToHierarchy(node.right) : null
                ].filter(n => n !== null)
            };
        };

        return convertToHierarchy(this.root);
    }

    /**
     * Save a snapshot of the current tree state for history
     */
    saveSnapshot(description) {
        // Deep clone the current tree structure
        const treeData = JSON.parse(JSON.stringify(this.getTreeData()));

        this.history.push({
            description,
            treeData,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    /**
     * Clear the tree
     */
    clear() {
        this.root = null;
        this.history = [];
    }
}
