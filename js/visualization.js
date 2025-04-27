/**
 * Tree visualization utilities using D3.js
 */
class TreeVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.margin = {
            top: 60,
            right: 40,
            bottom: 120,
            left: 40
        };
        this.width = 1100 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
        this.nodeSize = 25; // Increased node size

        // Clear any existing SVG
        d3.select(`#${containerId}`).selectAll("*").remove();

        // Create new SVG with zoom capability
        const svg = d3.select(`#${containerId}`).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`);

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", (event) => {
                this.svg.attr("transform", event.transform);
            });

        svg.call(zoom);

        this.svg = svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }

    /**
     * Draw the tree based on the provided hierarchical data
     */
    drawTree(treeData) {
        if (!treeData) {
            this.svg.selectAll("*").remove();
            this.svg.append("text")
                .attr("x", this.width / 2)
                .attr("y", this.height / 2)
                .attr("text-anchor", "middle")
                .text("Tree is empty");
            return;
        }

        // Clear any existing elements
        this.svg.selectAll("*").remove();

        // Create a tree layout with improved spacing
        const treemap = d3.tree()
            .nodeSize([60, 80]) // [x, y] spacing between nodes
            .separation((a, b) => {
                return a.parent === b.parent ? 1.5 : 2;
            });

        // Assigns parent, children, height, depth
        const root = d3.hierarchy(treeData, d => d.children);

        // Center the root at width/2
        root.x0 = this.width / 2;
        root.y0 = 0;

        // Compute the new tree layout
        treemap(root);

        // Shift all x coordinates to center the tree
        const nodes = root.descendants();
        const xMin = d3.min(nodes, d => d.x);
        const xMax = d3.max(nodes, d => d.x);
        const xOffset = this.width / 2 - (xMin + xMax) / 2;
        nodes.forEach(d => d.x += xOffset);

        // Define links between nodes
        const links = root.links();

        // Create curve generator for links - adapted for vertical orientation
        const diagonal = d => {
            return `M${d.source.x},${d.source.y}
                    C${d.source.x},${(d.source.y + d.target.y) / 2}
                     ${d.target.x},${(d.source.y + d.target.y) / 2}
                     ${d.target.x},${d.target.y}`;
        };

        // Update the nodes...
        const node = this.svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.counter));

        // Enter any new nodes
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Add Circle for the nodes with better styling
        nodeEnter.append('circle')
            .attr('r', this.nodeSize / 2)
            .style("fill", "#fff")
            .style("stroke", "steelblue")
            .style("stroke-width", "3px");

        // Add labels for the nodes with better positioning
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d.data.name)
            .style("font-size", "12px")
            .style("font-weight", "bold");

        // Add the links between nodes
        const link = this.svg.selectAll('path.link')
            .data(links, d => d.target.id);

        // Enter any new links
        link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', diagonal)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", "2px");
    }

    // Counter for uniquely identifying nodes
    counter = 0;
}
