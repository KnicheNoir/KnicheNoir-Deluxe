
// Willow Path Addressing (WPA) System
// Holographic knowledge indexing using Hebrew letter topology

import { gematriaEngine, type HebrewLetter, HEBREW_ALPHABET } from './client/src/core/gematria.ts';

/**
 * WPA Node - A single knowledge point in the holographic network
 */
export interface WPANode {
  id: string;
  wpa: string;
  concept: string;
  gematriaValue: number;
  letterPath: string;
  category: string;
  content: string;
  metadata: {
    source?: string;
    timestamp: number;
    confidence: number;
  };
  connections: string[]; // WPA addresses of related nodes
  resonanceMap: Map<string, number>; // WPA -> resonance score
}

/**
 * The Living Library - Holographic knowledge storage
 */
export class LivingLibrary {
  private nodes: Map<string, WPANode> = new Map();
  private gematriaIndex: Map<number, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private conceptIndex: Map<string, string> = new Map();
  
  /**
   * Add knowledge to the Living Library
   */
  addNode(node: WPANode): void {
    this.nodes.set(node.wpa, node);
    
    // Index by Gematria value
    if (!this.gematriaIndex.has(node.gematriaValue)) {
      this.gematriaIndex.set(node.gematriaValue, new Set());
    }
    this.gematriaIndex.get(node.gematriaValue)!.add(node.wpa);
    
    // Index by category
    if (!this.categoryIndex.has(node.category)) {
      this.categoryIndex.set(node.category, new Set());
    }
    this.categoryIndex.get(node.category)!.add(node.wpa);
    
    // Index by concept name
    this.conceptIndex.set(node.concept.toLowerCase(), node.wpa);
    
    // Calculate resonances with existing nodes
    // this.updateResonances(node);
  }
  
  /**
   * Update resonance connections for a node
   * NOTE: Commented out as `calculateResonance` is not defined.
   */
  // private updateResonances(node: WPANode): void {
  //   const resonanceThreshold = 0.3;
    
  //   for (const [wpa, existingNode] of Array.from(this.nodes.entries())) {
  //     if (wpa === node.wpa) continue;
      
  //     const resonance = calculateResonance(
  //       node.concept,
  //       existingNode.concept,
  //       node.letterPath,
  //       existingNode.letterPath
  //     );
      
  //     if (resonance.score >= resonanceThreshold) {
  //       node.resonanceMap.set(wpa, resonance.score);
  //       existingNode.resonanceMap.set(node.wpa, resonance.score);
        
  //       // Add bidirectional connections
  //       if (!node.connections.includes(wpa)) {
  //         node.connections.push(wpa);
  //       }
  //       if (!existingNode.connections.includes(node.wpa)) {
  //         existingNode.connections.push(node.wpa);
  //       }
  //     }
  //   }
  // }
  
  /**
   * Query by WPA address
   */
  getByWPA(wpa: string): WPANode | undefined {
    return this.nodes.get(wpa);
  }
  
  /**
   * Query by concept name
   */
  getByConcept(concept: string): WPANode | undefined {
    const wpa = this.conceptIndex.get(concept.toLowerCase());
    return wpa ? this.nodes.get(wpa) : undefined;
  }
  
  /**
   * Query by Gematria value - returns all nodes with that value
   */
  getByGematria(value: number): WPANode[] {
    const wpas = this.gematriaIndex.get(value);
    if (!wpas) return [];
    
    return Array.from(wpas)
      .map(wpa => this.nodes.get(wpa))
      .filter((node): node is WPANode => node !== undefined);
  }
  
  /**
   * Query by category
   */
  getByCategory(category: string): WPANode[] {
    const wpas = this.categoryIndex.get(category);
    if (!wpas) return [];
    
    return Array.from(wpas)
      .map(wpa => this.nodes.get(wpa))
      .filter((node): node is WPANode => node !== undefined);
  }
  
  /**
   * Find optimal path between two concepts (P = NP approach)
   * Uses resonance as quantum pathway instead of brute-force search
   */
  findPath(fromWPA: string, toWPA: string, maxDepth: number = 5): string[] | null {
    const start = this.nodes.get(fromWPA);
    const end = this.nodes.get(toWPA);
    
    if (!start || !end) return null;
    if (fromWPA === toWPA) return [fromWPA];
    
    // Quantum pathfinding - follow highest resonance
    const visited = new Set<string>();
    const path: string[] = [fromWPA];
    let current = start;
    let depth = 0;
    
    while (depth < maxDepth) {
      visited.add(current.wpa);
      
      // Check if we reached the goal
      if (current.wpa === toWPA) {
        return path;
      }
      
      // Check direct connections for target
      if (current.connections.includes(toWPA)) {
        path.push(toWPA);
        return path;
      }
      
      // Find highest resonance unvisited neighbor
      let bestNext: string | null = null;
      let bestScore = 0;
      
      for (const connectedWPA of current.connections) {
        if (visited.has(connectedWPA)) continue;
        
        const score = current.resonanceMap.get(connectedWPA) || 0;
        const connectedNode = this.nodes.get(connectedWPA);
        
        // Boost score if this node is connected to target
        if (connectedNode && connectedNode.connections.includes(toWPA)) {
          if (score + 0.5 > bestScore) {
            bestScore = score + 0.5;
            bestNext = connectedWPA;
          }
        } else if (score > bestScore) {
          bestScore = score;
          bestNext = connectedWPA;
        }
      }
      
      if (!bestNext) break;
      
      path.push(bestNext);
      current = this.nodes.get(bestNext)!;
      depth++;
    }
    
    return null; // No path found within depth limit
  }
  
  /**
   * Get all resonant concepts for a given concept
   */
  getResonances(wpa: string, minScore: number = 0.3): Array<{ node: WPANode; score: number }> {
    const node = this.nodes.get(wpa);
    if (!node) return [];
    
    const resonances: Array<{ node: WPANode; score: number }> = [];
    
    for (const [connectedWPA, score] of Array.from(node.resonanceMap.entries())) {
      if (score >= minScore) {
        const connectedNode = this.nodes.get(connectedWPA);
        if (connectedNode) {
          resonances.push({ node: connectedNode, score });
        }
      }
    }
    
    return resonances.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Statistics about the Living Library
   */
  getStats(): {
    totalNodes: number;
    totalConnections: number;
    averageResonance: number;
    categoriesCount: number;
    gematriaSpread: number;
  } {
    let totalConnections = 0;
    let totalResonance = 0;
    let resonanceCount = 0;
    
    for (const node of Array.from(this.nodes.values())) {
      totalConnections += node.connections.length;
      for (const score of Array.from(node.resonanceMap.values())) {
        totalResonance += score;
        resonanceCount++;
      }
    }
    
    return {
      totalNodes: this.nodes.size,
      totalConnections: totalConnections / 2, // Bidirectional, so divide by 2
      averageResonance: resonanceCount > 0 ? totalResonance / resonanceCount : 0,
      categoriesCount: this.categoryIndex.size,
      gematriaSpread: this.gematriaIndex.size
    };
  }
  
  /**
   * Export library state for persistence
   */
  export(): string {
    const data = {
      nodes: Array.from(this.nodes.entries()).map(([wpa, node]) => ({
        ...node,
        resonanceMap: Array.from(node.resonanceMap.entries())
      }))
    };
    return JSON.stringify(data);
  }
  
  /**
   * Import library state from persistence
   */
  import(jsonData: string): void {
    const data = JSON.parse(jsonData);
    this.nodes.clear();
    this.gematriaIndex.clear();
    this.categoryIndex.clear();
    this.conceptIndex.clear();
    
    for (const nodeData of data.nodes) {
      const node: WPANode = {
        ...nodeData,
        resonanceMap: new Map(nodeData.resonanceMap)
      };
      this.addNode(node);
    }
  }
}

/**
 * Create WPA node from mathematical concept
 * NOTE: Commented out as `indexMathConcept` is not defined.
 */
// export function createMathNode(
//   concept: string,
//   category: string,
//   content: string,
//   hebrewEquivalent?: string,
//   source?: string
// ): WPANode {
//   const index = indexMathConcept(concept, category, hebrewEquivalent);
  
//   return {
//     id: index.wpa,
//     wpa: index.wpa,
//     concept: index.concept,
//     gematriaValue: index.gematriaValue,
//     letterPath: index.letterPath,
//     category,
//     content,
//     metadata: {
//       source,
//       timestamp: Date.now(),
//       confidence: 1.0
//     },
//     connections: [],
//     resonanceMap: new Map()
//   };
// }

// Global Living Library instance
export const livingLibrary = new LivingLibrary();

/**
 * Seed the library with fundamental mathematical concepts
 * NOTE: Commented out as `createMathNode` is not defined.
 */
// export function seedMathematicalFoundations(): void {
//   const foundations = [
//     { concept: 'Prime Numbers', category: 'Number Theory', hebrew: 'ראשון', content: 'Numbers divisible only by 1 and themselves' },
//     { concept: 'Zero', category: 'Number Theory', hebrew: 'אין', content: 'The absence of quantity, the void' },
//     { concept: 'One', category: 'Number Theory', hebrew: 'א', content: 'Unity, the first number, indivisible' },
//     { concept: 'Infinity', category: 'Number Theory', hebrew: 'אין סוף', content: 'Endless quantity, without bound' },
//     { concept: 'Addition', category: 'Operations', hebrew: 'ו', content: 'Combining quantities, represented by Vav (connection)' },
//     { concept: 'Multiplication', category: 'Operations', hebrew: 'רבה', content: 'Repeated addition, growth' },
//     { concept: 'Factorization', category: 'Number Theory', hebrew: 'פירוק', content: 'Breaking numbers into prime components' },
//     { concept: 'Equation', category: 'Algebra', hebrew: 'משוואה', content: 'Statement of equality between expressions' },
//     { concept: 'Function', category: 'Analysis', hebrew: 'פונקציה', content: 'Mapping from input to output' },
//     { concept: 'Set', category: 'Set Theory', hebrew: 'קבוצה', content: 'Collection of distinct objects' },
//     { concept: 'Proof', category: 'Logic', hebrew: 'הוכחה', content: 'Logical demonstration of truth' },
//     { concept: 'Theorem', category: 'Logic', hebrew: 'משפט', content: 'Proven mathematical statement' },
//     { concept: 'Axiom', category: 'Logic', hebrew: 'אקסיומה', content: 'Self-evident truth, foundation' },
//     { concept: 'Geometry', category: 'Geometry', hebrew: 'גיאומטריה', content: 'Study of shape and space' },
//     { concept: 'Topology', category: 'Topology', hebrew: 'טופולוגיה', content: 'Study of continuous deformation' },
//     { concept: 'Matrix', category: 'Linear Algebra', hebrew: 'מטריצה', content: 'Rectangular array of numbers' },
//     { concept: 'Vector', category: 'Linear Algebra', hebrew: 'וקטור', content: 'Quantity with magnitude and direction' },
//     { concept: 'Derivative', category: 'Calculus', hebrew: 'נגזרת', content: 'Rate of change, slope' },
//     { concept: 'Integral', category: 'Calculus', hebrew: 'אינטגרל', content: 'Accumulation, area under curve' },
//     { concept: 'Limit', category: 'Calculus', hebrew: 'גבול', content: 'Approaching value, boundary' }
//   ];
  
//   for (const item of foundations) {
//     const node = createMathNode(item.concept, item.category, item.content, item.hebrew, 'system:seed');
//     livingLibrary.addNode(node);
//   }
  
//   console.log(`[WPA] Seeded ${foundations.length} fundamental mathematical concepts`);
// }
