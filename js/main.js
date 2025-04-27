/**
 * Main application script for tree visualization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tree instances
    const bst = new BinarySearchTree();
    const avl = new AVLTree();

    // Current active tree
    let activeTree = bst;
    let treeType = 'BST';

    // Initialize tree visualizer
    const visualizer = new TreeVisualizer('tree-container');

    // Tree type selection
    document.getElementById('bst-btn').addEventListener('click', () => {
        document.getElementById('bst-btn').classList.add('active');
        document.getElementById('avl-btn').classList.remove('active');
        activeTree = bst;
        treeType = 'BST';
        document.getElementById('current-tree-type').textContent = `Current Tree: ${treeType}`;
        updateTreeVisualization();
        updateOperationLog();
    });

    document.getElementById('avl-btn').addEventListener('click', () => {
        document.getElementById('avl-btn').classList.add('active');
        document.getElementById('bst-btn').classList.remove('active');
        activeTree = avl;
        treeType = 'AVL';
        document.getElementById('current-tree-type').textContent = `Current Tree: ${treeType}`;
        updateTreeVisualization();
        updateOperationLog();
    });

    // Insert operation
    document.getElementById('insert-btn').addEventListener('click', () => {
        const input = document.getElementById('insert-input');
        const value = parseInt(input.value);

        if (!isNaN(value)) {
            activeTree.insert(value);
            input.value = '';
            updateTreeVisualization();
            updateOperationLog();
        } else {
            alert('Please enter a valid number');
        }
    });

    // Delete operation
    document.getElementById('delete-btn').addEventListener('click', () => {
        const input = document.getElementById('delete-input');
        const value = parseInt(input.value);

        if (!isNaN(value)) {
            activeTree.delete(value);
            input.value = '';
            updateTreeVisualization();
            updateOperationLog();
        } else {
            alert('Please enter a valid number');
        }
    });

    // Update operation
    document.getElementById('update-btn').addEventListener('click', () => {
        const oldInput = document.getElementById('update-old');
        const newInput = document.getElementById('update-new');
        const oldValue = parseInt(oldInput.value);
        const newValue = parseInt(newInput.value);

        if (!isNaN(oldValue) && !isNaN(newValue)) {
            activeTree.update(oldValue, newValue);
            oldInput.value = '';
            newInput.value = '';
            updateTreeVisualization();
            updateOperationLog();
        } else {
            alert('Please enter valid numbers for old and new values');
        }
    });

    // Batch insert
    document.getElementById('batch-insert-btn').addEventListener('click', () => {
        const input = document.getElementById('batch-input');
        const values = input.value.split(',').map(val => {
            // Clean up each value and parse as integer
            return parseInt(val.trim());
        }).filter(val => !isNaN(val)); // Filter out invalid values

        if (values.length > 0) {
            for (const value of values) {
                activeTree.insert(value);
            }
            input.value = '';
            updateTreeVisualization();
            updateOperationLog();
        } else {
            alert('Please enter valid numbers separated by commas');
        }
    });

    // Clear tree
    document.getElementById('clear-tree-btn').addEventListener('click', () => {
        activeTree.clear();
        updateTreeVisualization();
        updateOperationLog();
    });

    // Example problems
    document.getElementById('example-bst').addEventListener('click', () => {
        // Switch to BST
        document.getElementById('bst-btn').click();

        // Clear existing tree
        activeTree.clear();

        // Example data and operations for BST
        const insertValues = [49, 56, 39, 34, 95, 43, 75, 86, 73, 44, 23, 66, 42, 51, 93];

        // Insert all values
        for (const value of insertValues) {
            activeTree.insert(value);
        }

        // Perform example operations
        setTimeout(() => {
            activeTree.delete(75);
            updateTreeVisualization();
            updateOperationLog();

            setTimeout(() => {
                activeTree.delete(39);
                updateTreeVisualization();
                updateOperationLog();

                setTimeout(() => {
                    activeTree.delete(49);
                    updateTreeVisualization();
                    updateOperationLog();

                    setTimeout(() => {
                        activeTree.update(43, 77);
                        updateTreeVisualization();
                        updateOperationLog();

                        setTimeout(() => {
                            activeTree.update(66, 55);
                            updateTreeVisualization();
                            updateOperationLog();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    });

    document.getElementById('example-avl').addEventListener('click', () => {
        // Switch to AVL
        document.getElementById('avl-btn').click();

        // Clear existing tree
        activeTree.clear();

        // Example data and operations for AVL
        const insertValues = [49, 56, 39, 34, 95, 43, 75, 86, 73, 44, 23, 66, 42, 51, 93];

        // Insert all values
        for (const value of insertValues) {
            activeTree.insert(value);
        }

        // Perform example operations
        setTimeout(() => {
            activeTree.delete(75);
            updateTreeVisualization();
            updateOperationLog();

            setTimeout(() => {
                activeTree.delete(39);
                updateTreeVisualization();
                updateOperationLog();

                setTimeout(() => {
                    activeTree.delete(49);
                    updateTreeVisualization();
                    updateOperationLog();

                    setTimeout(() => {
                        activeTree.update(43, 77);
                        updateTreeVisualization();
                        updateOperationLog();

                        setTimeout(() => {
                            activeTree.update(66, 55);
                            updateTreeVisualization();
                            updateOperationLog();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    });

    // Function to update tree visualization
    function updateTreeVisualization() {
        const treeData = activeTree.getTreeData();
        visualizer.drawTree(treeData);
    }

    // Function to update operation log
    function updateOperationLog() {
        const logContainer = document.getElementById('log-container');
        logContainer.innerHTML = '';

        // Get the last 10 history items for cleaner display
        const historyToShow = activeTree.history.slice(-10);

        for (const item of historyToShow) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = `${item.timestamp}: ${item.description}`;
            logContainer.appendChild(logEntry);
        }

        // Scroll to the bottom of the log
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Initialize with empty tree visualization
    updateTreeVisualization();
});
