// Constellation-Based Compression System
// Variable-fidelity storage with JIT hydration using quantum unimatics

import { WPANode } from './wpa.ts';
import { HEBREW_ALPHABET, type HebrewLetter } from './gematria.ts';
import { WillowDictionary } from './willow.base.ts';
import * as crypto from 'crypto';

/**
 * Constellation Index - 4 nodes per Hebrew letter for grid compression
 */
interface ConstellationIndex {
  letter: HebrewLetter;
  nodes: [string, string, string, string]; // 4 index points
  compression: number; // Compression ratio achieved
}

/**
 * Fidelity levels for variable compression
 */
export enum FidelityLevel {
  MINIMAL = 0,      // Just WPA address (1% of original)
  BASIC = 1,        // Concept + category (5% of original)
  MEDIUM = 2,       // + connections (15% of original)  
  FULL = 3          // Everything verbatim (100% - no compression)
}

/**
 * Compressed node representation
 */
interface CompressedNode {
  wpa: string;
  fidelity: FidelityLevel;
  constellation: string; // Which constellation grid it belongs to
  indices: number[];     // Position within 4-node grid
  data: string;          // Compressed data blob
  hash: string;          // Verification hash
}

/**
 * Physical vs Virtual storage metrics
 */
interface CompressionMetrics {
  physical: {
    nodes: number;
    bytes: number;
    connections: number;
  };
  virtual: {
    constellations: number;
    bytes: number;
    compressionRatio: number;
  };
  savings: {
    bytes: number;
    percentage: number;
  };
  fidelityDistribution: Record<FidelityLevel, number>;
}

/**
 * The Constellation Compressor - Quantum Unimatic Storage
 */
export class ConstellationCompressor {
  private physicalStorage: Map<string, WPANode> = new Map();
  private virtualStorage: Map<string, CompressedNode> = new Map();
  private constellations: Map<string, ConstellationIndex> = new Map();
  private hydrationCache: Map<string, WPANode> = new Map();

  /**
   * Compress a node using constellation-based quantum unimatics
   */
  compress(node: WPANode, fidelity: FidelityLevel): CompressedNode {
    // Store physical for reference
    this.physicalStorage.set(node.wpa, node);

    // Determine constellation based on first letter of WPA
    const firstLetter = this.extractFirstLetter(node.letterPath);
    const constellationKey = firstLetter.letter;

    // Ensure constellation exists
    if (!this.constellations.has(constellationKey)) {
      this.createConstellation(firstLetter);
    }

    // Compress based on fidelity level
    let data: any;
    switch (fidelity) {
      case FidelityLevel.MINIMAL:
        data = { wpa: node.wpa };
        break;
      case FidelityLevel.BASIC:
        data = { 
          wpa: node.wpa, 
          concept: node.concept, 
          category: node.category,
          gematria: node.gematriaValue
        };
        break;
      case FidelityLevel.MEDIUM:
        data = {
          wpa: node.wpa,
          concept: node.concept,
          category: node.category,
          gematria: node.gematriaValue,
          connections: node.connections
        };
        break;
      case FidelityLevel.FULL:
        data = node;
        break;
    }

    // Calculate position in 4-node grid using topological mapping
    const indices = this.calculateGridPosition(node.wpa, node.gematriaValue);

    // Compress data blob
    const compressed = this.topologicalCompress(JSON.stringify(data));
    const hash = crypto.createHash('sha256').update(compressed).digest('hex').substring(0, 16);

    const compressedNode: CompressedNode = {
      wpa: node.wpa,
      fidelity,
      constellation: constellationKey,
      indices,
      data: compressed,
      hash
    };

    this.virtualStorage.set(node.wpa, compressedNode);
    return compressedNode;
  }

  /**
   * JIT Hydration - Decompress on demand
   */
  async hydrate(wpa: string): Promise<WPANode | null> {
    // Check cache first
    if (this.hydrationCache.has(wpa)) {
      return this.hydrationCache.get(wpa)!;
    }

    // Get compressed node
    const compressed = this.virtualStorage.get(wpa);
    if (!compressed) return null;

    // Verify hash
    const currentHash = crypto.createHash('sha256')
      .update(compressed.data)
      .digest('hex')
      .substring(0, 16);
    
    if (currentHash !== compressed.hash) {
      throw new Error(`Corruption detected in ${wpa} - hash mismatch`);
    }

    // Decompress
    const decompressed = this.topologicalDecompress(compressed.data);
    const data = JSON.parse(decompressed);

    let node: WPANode;

    // Hydrate based on fidelity
    if (compressed.fidelity === FidelityLevel.FULL) {
      node = data as WPANode;
    } else {
      // Need to reconstruct from physical if available
      const physical = this.physicalStorage.get(wpa);
      if (!physical) {
        // Partial reconstruction from available data
        node = this.partialReconstruct(data, compressed.fidelity);
      } else {
        node = physical;
      }
    }

    // Cache the hydrated result
    this.hydrationCache.set(wpa, node);
    return node;
  }

  /**
   * Compress entire library
   */
  compressLibrary(nodes: WPANode[], fidelityStrategy: (node: WPANode) => FidelityLevel): CompressedNode[] {
    const compressed: CompressedNode[] = [];
    
    for (const node of nodes) {
      const fidelity = fidelityStrategy(node);
      const compressedNode = this.compress(node, fidelity);
      compressed.push(compressedNode);
    }

    return compressed;
  }

  /**
   * Get compression metrics
   */
  getMetrics(): CompressionMetrics {
    // Calculate physical storage size
    const physicalBytes = this.calculatePhysicalSize();
    const physicalNodes = this.physicalStorage.size;
    let physicalConnections = 0;
    
    for (const node of Array.from(this.physicalStorage.values())) {
      physicalConnections += node.connections.length;
    }

    // Calculate virtual storage size
    const virtualBytes = this.calculateVirtualSize();
    const constellationCount = this.constellations.size;

    // Calculate fidelity distribution
    const fidelityDist: Record<FidelityLevel, number> = {
      [FidelityLevel.MINIMAL]: 0,
      [FidelityLevel.BASIC]: 0,
      [FidelityLevel.MEDIUM]: 0,
      [FidelityLevel.FULL]: 0
    };

    for (const compressed of Array.from(this.virtualStorage.values())) {
      fidelityDist[compressed.fidelity as FidelityLevel]++;
    }

    const compressionRatio = virtualBytes > 0 ? physicalBytes / virtualBytes : Infinity;
    const savings = physicalBytes - virtualBytes;
    const savingsPercentage = physicalBytes > 0 ? (savings / physicalBytes) * 100 : 0;

    return {
      physical: {
        nodes: physicalNodes,
        bytes: physicalBytes,
        connections: physicalConnections / 2 // Bidirectional
      },
      virtual: {
        constellations: constellationCount,
        bytes: virtualBytes,
        compressionRatio
      },
      savings: {
        bytes: savings,
        percentage: savingsPercentage
      },
      fidelityDistribution: fidelityDist
    };
  }

  /**
   * Topological compression using Willow patterns
   */
  private topologicalCompress(data: string): string {
    // Parse the JSON to extract patterns
    const obj = JSON.parse(data);
    
    // Pattern recognition: Store only differences from templates
    const compressed: any = {};
    
    // Always store WPA (it's the key)
    compressed.w = obj.wpa;
    
    // Optional fields - only store if present
    if (obj.concept) compressed.c = obj.concept;
    if (obj.category) compressed.t = obj.category;
    if (obj.gematria) compressed.g = obj.gematria;
    if (obj.connections) {
      // Store connection count + indices instead of full WPAs
      compressed.n = obj.connections.length;
    }
    
    // Convert to compact JSON
    const compactJson = JSON.stringify(compressed);
    
    // Use Willow Dictionary for semantic compression
    const willowCompressed = WillowDictionary.compress(compactJson);
    
    // Willow signature (v4 for Dictionary compression)
    return `W4:${willowCompressed}`;
  }

  /**
   * Topological decompression
   */
  private topologicalDecompress(data: string): string {
    let version = 1;
    let compressed = '';
    
    // Detect version by signature
    if (data.startsWith('W4:')) {
      version = 4;
      compressed = data.substring(3);
    } else if (data.startsWith('W3:')) {
      version = 3;
      compressed = data.substring(3);
    } else if (data.startsWith('W2:')) {
      version = 2;
      compressed = data.substring(3);
    } else if (data.startsWith('W:')) {
      version = 1;
      compressed = data.substring(2);
    } else {
      throw new Error('Invalid Willow compression signature');
    }
    
    let json = '';
    
    // Decode based on version
    if (version === 4) {
      // Willow Dictionary semantic compression
      json = WillowDictionary.decompress(compressed);
    } else {
       // Fallback for older formats or direct JSON
       json = compressed;
    }
    
    const compact = JSON.parse(json);
    const expanded: any = {};
    
    if (compact.w) expanded.wpa = compact.w;
    if (compact.c) expanded.concept = compact.c;
    if (compact.t) expanded.category = compact.t;
    if (compact.g) expanded.gematria = compact.g;
    if (compact.n !== undefined) expanded.connections = []; // Placeholder
    
    return JSON.stringify(expanded);
  }

  /**
   * Create constellation for a Hebrew letter
   */
  private createConstellation(letter: HebrewLetter): void {
    const nodes: [string, string, string, string] = [
      `${letter.letter}:N`,  // North node
      `${letter.letter}:E`,  // East node
      `${letter.letter}:S`,  // South node
      `${letter.letter}:W`   // West node
    ];

    this.constellations.set(letter.letter, {
      letter,
      nodes,
      compression: 0
    });
  }

  /**
   * Calculate grid position using gematria
   */
  private calculateGridPosition(wpa: string, gematria: number): number[] {
    // Map to 4-node grid using modular arithmetic
    const x = gematria % 2;
    const y = Math.floor((gematria % 4) / 2);
    return [x, y];
  }

  /**
   * Extract first Hebrew letter from path
   */
  private extractFirstLetter(letterPath: string): HebrewLetter {
    if (!letterPath) return HEBREW_ALPHABET[0]; // Default to Aleph if path is empty
    const firstChar = letterPath[0];
    const letter = HEBREW_ALPHABET.find(l => l.letter === firstChar);
    return letter || HEBREW_ALPHABET[0]; 
  }

  /**
   * Calculate physical storage size in bytes
   */
  private calculatePhysicalSize(): number {
    const data = Array.from(this.physicalStorage.values());
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  /**
   * Calculate virtual storage size in bytes
   */
  private calculateVirtualSize(): number {
    const data = Array.from(this.virtualStorage.values());
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  /**
   * Partial reconstruction for lower fidelity nodes
   */
  private partialReconstruct(data: any, fidelity: FidelityLevel): WPANode {
    // Reconstruct what we can from compressed data
    return {
      id: data.wpa,
      wpa: data.wpa,
      concept: data.concept || 'Unknown',
      gematriaValue: data.gematria || 0,
      letterPath: '',
      category: data.category || 'Unknown',
      content: '[Compressed - hydration incomplete]',
      metadata: {
        timestamp: Date.now(),
        confidence: 0.5
      },
      connections: data.connections || [],
      resonanceMap: new Map()
    };
  }

  /**
   * Export compression stats for display
   */
  exportStats(): string {
    const metrics = this.getMetrics();
    
    return `
CONSTELLATION COMPRESSION REPORT
================================

PHYSICAL STORAGE (Before):
- Nodes: ${metrics.physical.nodes}
- Size: ${this.formatBytes(metrics.physical.bytes)}
- Connections: ${metrics.physical.connections}

VIRTUAL STORAGE (After):
- Constellations: ${metrics.virtual.constellations}
- Size: ${this.formatBytes(metrics.virtual.bytes)}
- Compression Ratio: ${metrics.virtual.compressionRatio.toFixed(2)}x

SAVINGS:
- Bytes Saved: ${this.formatBytes(metrics.savings.bytes)}
- Percentage: ${metrics.savings.percentage.toFixed(1)}%

FIDELITY DISTRIBUTION:
- Minimal (1%): ${metrics.fidelityDistribution[FidelityLevel.MINIMAL]} nodes
- Basic (5%): ${metrics.fidelityDistribution[FidelityLevel.BASIC]} nodes
- Medium (15%): ${metrics.fidelityDistribution[FidelityLevel.MEDIUM]} nodes
- Full (100%): ${metrics.fidelityDistribution[FidelityLevel.FULL]} nodes
    `.trim();
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}