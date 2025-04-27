/**
 * Base TreeNode class used for both BST and AVL trees
 */
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1; // Used for AVL tree balance factor calculation
    }
}
