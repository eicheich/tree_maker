/**
 * AVL Tree implementation (self-balancing BST)
 */
class AVLTree {
    constructor() {
        this.root = null;
        this.history = [];
    }

    // Get height of a node
    height(node) {
        return node ? node.height : 0;
    }

    // Get balance factor of a node
    getBalanceFactor(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    // Update height of a node
    updateHeight(node) {
        if (node) {
            node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
        }
    }

    // Right rotation
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    // Left rotation
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    /**
     * Insert a new value into the AVL tree
     */
    insert(value) {
        const insertInfo = {
            path: [],
            rotations: []
        };

        this.root = this.insertNode(this.root, value, insertInfo);

        // Generate detailed explanation
        let explanation = this.generateInsertExplanation(value, insertInfo);
        this.saveSnapshot(`Inserted ${value}: ${explanation}`);
    }

    /**
     * Helper method to insert a node recursively
     */
    insertNode(node, value, info) {
        // 1. Perform standard BST insert
        if (node === null) {
            return new TreeNode(value);
        }

        if (value < node.value) {
            info.path.push({
                node: node.value,
                direction: 'left'
            });
            node.left = this.insertNode(node.left, value, info);
        } else if (value > node.value) {
            info.path.push({
                node: node.value,
                direction: 'right'
            });
            node.right = this.insertNode(node.right, value, info);
        } else {
            // Duplicate values are not allowed
            return node;
        }

        // 2. Update height of this node
        this.updateHeight(node);

        // 3. Get the balance factor to check if this node became unbalanced
        const balance = this.getBalanceFactor(node);

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            info.rotations.push({
                type: 'Right Rotation',
                unbalancedNode: node.value,
                balanceFactor: balance,
                child: node.left.value
            });
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            info.rotations.push({
                type: 'Left Rotation',
                unbalancedNode: node.value,
                balanceFactor: balance,
                child: node.right.value
            });
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            info.rotations.push({
                type: 'Left-Right Rotation',
                unbalancedNode: node.value,
                balanceFactor: balance,
                firstRotation: `Left rotation at ${node.left.value}`,
                secondRotation: `Right rotation at ${node.value}`
            });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            info.rotations.push({
                type: 'Right-Left Rotation',
                unbalancedNode: node.value,
                balanceFactor: balance,
                firstRotation: `Right rotation at ${node.right.value}`,
                secondRotation: `Left rotation at ${node.value}`
            });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /**
     * Generate explanation for insertion operation
     */
    generateInsertExplanation(value, info) {
        let explanation = '';

        // Path explanation
        if (info.path.length === 0) {
            explanation += 'Inserted as root node';
        } else {
            explanation += 'Inserted as ';
            info.path.forEach((step, index) => {
                if (index === info.path.length - 1) {
                    explanation += `${step.direction} child of ${step.node}`;
                } else {
                    explanation += `${step.node} → `;
                }
            });
        }

        // Rotation explanation
        if (info.rotations.length > 0) {
            explanation += '. Tree became unbalanced after insertion, requiring ';

            info.rotations.forEach((rotation, index) => {
                if (rotation.type === 'Left Rotation' || rotation.type === 'Right Rotation') {
                    explanation += `${rotation.type} at node ${rotation.unbalancedNode} (balance factor: ${rotation.balanceFactor})`;
                } else {
                    explanation += `${rotation.type}: ${rotation.firstRotation} followed by ${rotation.secondRotation}`;
                }
            });
        }

        return explanation;
    }

    /**
     * Delete a value from the AVL tree
     */
    delete(value) {
        if (this.root === null) {
            return null;
        }

        const deleteInfo = {
            explanation: '',
            successorValue: null,
            rotations: []
        };

        this.root = this.deleteNode(this.root, value, deleteInfo);

        let explanation = deleteInfo.explanation;
        if (deleteInfo.rotations.length > 0) {
            explanation += '. Tree was rebalanced with ';
            deleteInfo.rotations.forEach((rotation, index) => {
                explanation += `${rotation.type} at node ${rotation.node}`;
                if (index < deleteInfo.rotations.length - 1) {
                    explanation += ' and ';
                }
            });
        }

        this.saveSnapshot(`Deleted ${value}: ${explanation}`);
    }

    /**
     * Helper method to delete a node recursively
     */
    deleteNode(node, value, info) {
        // 1. Perform standard BST delete
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value, info);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value, info);
        } else {
            // Node with only one child or no child
            if (node.left === null || node.right === null) {
                const temp = node.left ? node.left : node.right;

                // No child case
                if (temp === null) {
                    info.explanation = `Removed leaf node ${value}`;
                    node = null;
                } else {
                    // One child case
                    info.explanation = `Removed node ${value} with one child, replaced by ${temp.value}`;
                    node = temp; // Copy the contents of the non-empty child
                }
            } else {
                // Node with two children: Get the inorder successor
                const temp = this.minValueNode(node.right);
                info.explanation = `Removed node ${value} with two children, replaced by successor ${temp.value}`;
                info.successorValue = temp.value;

                // Copy the inorder successor's data to this node
                node.value = temp.value;

                // Delete the inorder successor
                node.right = this.deleteNode(node.right, temp.value, {
                    explanation: '',
                    successorValue: null,
                    rotations: info.rotations
                });
            }
        }

        // If the tree had only one node then return
        if (node === null) {
            return null;
        }

        // 2. Update height of the current node
        this.updateHeight(node);

        // 3. Get the balance factor
        const balance = this.getBalanceFactor(node);

        // If unbalanced, try the 4 cases

        // Left Left Case
        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            info.rotations.push({
                type: 'Right Rotation',
                node: node.value
            });
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            info.rotations.push({
                type: 'Left-Right Rotation',
                node: node.value
            });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            info.rotations.push({
                type: 'Left Rotation',
                node: node.value
            });
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            info.rotations.push({
                type: 'Right-Left Rotation',
                node: node.value
            });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /**
     * Find the node with minimum value
     */
    minValueNode(node) {
        let current = node;

        // Loop down to find the leftmost leaf
        while (current.left !== null) {
            current = current.left;
        }

        return current;
    }

    /**
     * Update a value in the AVL tree
     * Implemented as delete old value and insert new value
     */
    update(oldValue, newValue) {
        // Verify the old value exists in the tree
        if (!this.search(this.root, oldValue)) {
            console.log(`Value ${oldValue} not found in the tree`);
            return;
        }

        // Delete with info
        const deleteInfo = {
            explanation: '',
            successorValue: null,
            rotations: []
        };

        this.root = this.deleteNode(this.root, oldValue, deleteInfo);

        // Insert with info
        const insertInfo = {
            path: [],
            rotations: []
        };

        this.root = this.insertNode(this.root, newValue, insertInfo);

        // Combined explanation
        let explanation = deleteInfo.explanation;

        if (deleteInfo.rotations.length > 0) {
            explanation += '. During deletion, tree was rebalanced with ';
            deleteInfo.rotations.forEach((rotation, index) => {
                explanation += `${rotation.type} at node ${rotation.node}`;
                if (index < deleteInfo.rotations.length - 1) {
                    explanation += ' and ';
                }
            });
        }

        explanation += '. Then inserted ' + newValue + ' ';

        if (insertInfo.path.length > 0) {
            explanation += 'as ';
            insertInfo.path.forEach((step, index) => {
                if (index === insertInfo.path.length - 1) {
                    explanation += `${step.direction} child of ${step.node}`;
                } else {
                    explanation += `${step.node} → `;
                }
            });
        } else {
            explanation += 'as root';
        }

        if (insertInfo.rotations.length > 0) {
            explanation += '. During insertion, tree required ';
            insertInfo.rotations.forEach((rotation, index) => {
                if (rotation.type === 'Left Rotation' || rotation.type === 'Right Rotation') {
                    explanation += `${rotation.type} at node ${rotation.unbalancedNode}`;
                } else {
                    explanation += `${rotation.type}: ${rotation.firstRotation} followed by ${rotation.secondRotation}`;
                }
                if (index < insertInfo.rotations.length - 1) {
                    explanation += ' and ';
                }
            });
        }

        this.saveSnapshot(`Updated ${oldValue} to ${newValue}: ${explanation}`);
    }

    /**
     * Search for a value in the AVL tree
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
