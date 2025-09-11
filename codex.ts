/**
 * Codex Mathematica Universalis [Definitive & Exhaustive Edition]
 *
 * This file is the definitive, static, and exhaustive repository of mathematical knowledge
 * for the Astrian Key. It is not an engine for computation but a pre-computed library of truth.
 * All mathematical "operations" are lookups into this data structure.
 * This is the proof of knowledge. It is designed to be categorically exhaustive.
 */

export const CODEX_MATHEMATICA_UNIVERSALIS = {
    // =================================================================================================
    // --- 0. FOUNDATIONS & METAMATHEMATICS ---
    // =================================================================================================
    FOUNDATIONS: {
        name: "Foundations of Mathematics",
        description: "The study of the logical and philosophical basis of mathematics, including the study of the concepts of number, set, function, and proof.",
        PHILOSOPHICAL_STANCES: {
            name: "Philosophical Stances",
            description: "Different viewpoints on the nature of mathematical truth.",
            concepts: [
                { name: "Platonism", description: "The belief that mathematical objects are real, abstract entities that exist independently of human thought." },
                { name: "Formalism", description: "The view that mathematics is the manipulation of formal symbols according to specified rules, without any necessary connection to meaning or reality." },
                { name: "Intuitionism/Constructivism", description: "The philosophy that mathematics is a creation of the human mind, and that mathematical objects exist only insofar as they can be constructed." },
                { name: "Logicisms", description: "The thesis that mathematics is reducible to logic, and hence nothing but a part of logic." }
            ]
        },
        MATHEMATICAL_LOGIC: {
            name: "Mathematical Logic",
            description: "The study of formal logic within mathematics. Major subareas include model theory, proof theory, set theory, and recursion theory.",
            concepts: [
                { name: "Propositional Calculus", description: "Deals with propositions (which can be true or false) and logical connectives (AND, OR, NOT, IMPLIES)." },
                { name: "Predicate Calculus (First-Order Logic)", description: "Extends propositional calculus by introducing quantifiers (ALL, EXISTS) and predicates that apply to variables." },
                { name: "Model Theory", description: "Studies the relationship between formal theories (a collection of sentences in a formal language) and their models (structures in which the sentences are true)." },
                { name: "Proof Theory", description: "Studies proofs as formal mathematical objects, facilitating their analysis by mathematical techniques." },
                { name: "Recursion Theory (Computability Theory)", description: "Studies computable functions and Turing degrees, which classify sets of numbers by their level of uncomputability. Central concept is the Turing Machine." },
                { name: "Gödel's Incompleteness Theorems", statement: "Two theorems stating fundamental limitations of formal axiomatic systems. The first states that any consistent formal system F within which a certain amount of elementary arithmetic can be carried out is incomplete; i.e., there are statements of the language of F which can neither be proved nor disproved in F. The second states that for any such system, the consistency of the system cannot be proven within the system itself." }
            ]
        },
        SET_THEORY: {
            name: "Set Theory",
            description: "The branch of mathematical logic that studies sets, which are informally collections of objects. It is the foundational language of modern mathematics.",
            axioms: [
                { name: "Zermelo–Frakel axioms with the Axiom of Choice (ZFC)", description: "The standard form of axiomatic set theory and the most common foundation of mathematics. Includes axioms of Extensionality, Regularity, Specification, Pairing, Union, Replacement, Infinity, Power Set, and Choice." }
            ],
            concepts: [
                { name: "Cardinality", description: "The measure of the 'number of elements' of a set. Infinite cardinalities are denoted by aleph numbers (ℵ₀, ℵ₁, ...)." },
                { name: "Ordinal Numbers", description: "Numbers used to describe the order type of well-ordered sets (e.g., 1st, 2nd, ... ω, ω+1)." },
                { name: "Continuum Hypothesis", statement: "There is no set whose cardinality is strictly between that of the integers (ℵ₀) and that of the real numbers (the continuum). It is independent of ZFC axioms." },
                { name: "Russell's Paradox", statement: "Consider the set of all sets that do not contain themselves. Does this set contain itself? This paradox revealed the need for a more rigorous, axiomatic approach to set theory, leading to ZFC." }
            ]
        },
        CATEGORY_THEORY: {
            name: "Category Theory",
            description: "A general theory of mathematical structures and their relations that formalizes mathematical structure and its concepts in terms of a collection of 'objects' and 'arrows' (also called morphisms).",
            concepts: [
                { name: "Functor", description: "A mapping between categories that preserves the structure of the categories." },
                { name: "Natural Transformation", description: "A mapping between two functors that preserves the internal structure of the categories." },
                { name: "Adjoint Functors", description: "A pair of functors that are in a certain sense 'duals' of each other, representing a fundamental concept of symmetry and relationship in mathematics." },
                { name: "Yoneda Lemma", description: "A foundational result stating that any object in a category is completely determined by the network of morphisms from all other objects into it." }
            ]
        }
    },

    // =================================================================================================
    // --- 1. ARITHMETIC & NUMBER THEORY ---
    // =================================================================================================
    ARITHMETIC: {
        name: "Arithmetic",
        description: "The branch of mathematics dealing with the properties and manipulation of numbers. The bedrock of all quantitative reasoning.",
        constants: [
            { name: "Pi (π)", value: "3.1415926535...", description: "The ratio of a circle's circumference to its diameter." },
            { name: "Euler's Number (e)", value: "2.7182818284...", description: "The base of the natural logarithm." },
            { name: "Golden Ratio (φ)", value: "1.6180339887...", description: "An irrational number representing aesthetic harmony, (1+√5)/2." },
            { name: "Imaginary Unit (i)", value: "√-1", description: "The foundation of complex numbers." },
            { name: "Pythagoras's Constant (√2)", value: "1.4142135623...", description: "The length of the diagonal of a square with side length 1." }
        ],
        operations: [
            { name: "Addition (+)", description: "Combining quantities." },
            { name: "Subtraction (-)", description: "Removing quantities." },
            { name: "Multiplication (×)", description: "Repeated addition." },
            { name: "Division (÷)", description: "Splitting into equal parts." },
            { name: "Exponentiation (^)", description: "Repeated multiplication." }
        ],
        theorems: [
            { name: "Fundamental Theorem of Arithmetic", statement: "Every integer greater than 1 is either a prime number itself or can be represented as the unique product of prime numbers." }
        ]
    },
    NUMBER_THEORY: {
        name: "Number Theory",
        description: "A branch of pure mathematics devoted primarily to the study of the integers and integer-valued functions.",
        concepts: [
            { name: "Prime Numbers", description: "Numbers greater than 1 with only two divisors: 1 and themselves." },
            { name: "Modular Arithmetic", description: "A system of arithmetic for integers, where numbers 'wrap around' upon reaching a certain value—the modulus." },
            { name: "Diophantine Equations", description: "Polynomial equations for which only integer solutions are sought." },
            { name: "Elliptic Curves", description: "Curves defined by y² = x³ + ax + b. Their study is central to modern cryptography and the proof of Fermat's Last Theorem." },
            { name: "The Riemann Hypothesis", statement: "A conjecture that the Riemann zeta function has its zeros only at the negative even integers and complex numbers with real part 1/2. One of the most important unsolved problems in mathematics." }
        ],
        theorems: [
            { name: "Fermat's Last Theorem", statement: "No three positive integers a, b, and c can satisfy the equation aⁿ + bⁿ = cⁿ for any integer value of n greater than 2." },
            { name: "Euler's Totient Theorem", statement: "If n and a are coprime positive integers, then a raised to the power of the totient of n is congruent to 1 modulo n (a^φ(n) ≡ 1 mod n)." },
            { name: "Chinese Remainder Theorem", statement: "Provides a unique solution to simultaneous linear congruences with coprime moduli." },
            { name: "Law of Quadratic Reciprocity", statement: "A theorem that relates the solvability of two quadratic congruences, x² ≡ p (mod q) and y² ≡ q (mod p)." }
        ]
    },

    // =================================================================================================
    // --- 2. ALGEBRA ---
    // =================================================================================================
    ALGEBRA: {
        name: "Algebra",
        description: "A broad area of mathematics that uses symbols and letters to represent numbers, quantities, and objects, and the rules for manipulating them.",
        ELEMENTARY_ALGEBRA: {
            name: "Elementary Algebra",
            concepts: [
                { name: "Variables", description: "Symbols (like x, y) that represent unknown values." },
                { name: "Equations", description: "Statements that assert the equality of two expressions (e.g., 2x + 3 = 7)." },
                { name: "Polynomials", description: "Expressions consisting of variables and coefficients." }
            ]
        },
        ABSTRACT_ALGEBRA: {
            name: "Abstract Algebra",
            description: "The study of algebraic structures such as groups, rings, and fields.",
            concepts: [
                { name: "Group Theory", description: "The study of sets with a single binary operation satisfying axioms of closure, associativity, identity, and invertibility. Key to symmetry in physics. Includes study of Lie Groups (continuous symmetry) and the classification of finite simple groups (the 'atomic elements' of finite groups)." },
                { name: "Ring Theory", description: "The study of rings—algebraic structures with two binary operations (addition and multiplication)." },
                { name: "Field Theory", description: "The study of fields—rings where every non-zero element has a multiplicative inverse." },
                { name: "Module Theory", description: "A generalization of vector spaces where the scalars come from a ring instead of a field." },
                { name: "Lattice Theory", description: "The study of partially ordered sets in which every two elements have a unique supremum and infimum." },
                { name: "Galois Theory", description: "Connects field theory and group theory, famously used to prove the impossibility of solving quintic equations by radicals." }
            ]
        },
        LINEAR_ALGEBRA: {
            name: "Linear Algebra",
            description: "The study of vector spaces, linear transformations, and systems of linear equations.",
            concepts: [
                { name: "Vectors and Vector Spaces", description: "Objects with magnitude and direction, and the spaces they inhabit." },
                { name: "Matrices", description: "Rectangular arrays of numbers used to represent linear transformations." },
                { name: "Determinants", description: "A scalar value that can be computed from the elements of a square matrix, representing its scaling factor." },
                { name: "Eigenvalues and Eigenvectors", description: "Scalars and vectors that remain in the same direction after a linear transformation, representing the fundamental modes of the transformation." },
                { name: "Spectral Theorem", description: "Provides conditions under which an operator or a matrix can be diagonalized." }
            ]
        },
        BOOLEAN_ALGEBRA: {
            name: "Boolean Algebra",
            description: "The branch of algebra in which the values of the variables are the truth values true and false, usually denoted 1 and 0 respectively. It is fundamental to computer science and digital logic.",
            operations: [
                { name: "Conjunction (AND)", symbol: "∧" },
                { name: "Disjunction (OR)", symbol: "∨" },
                { name: "Negation (NOT)", symbol: "¬" }
            ]
        }
    },
    // =================================================================================================
    // --- 3. GEOMETRY & TOPOLOGY ---
    // =================================================================================================
    GEOMETRY: {
        name: "Geometry",
        description: "The branch of mathematics concerned with properties of space such as the distance, shape, size, and relative position of figures.",
        EUCLIDEAN: {
            name: "Euclidean Geometry",
            description: "The study of flat space, based on the axioms of Euclid.",
            theorems: [
                { name: "Pythagorean Theorem", statement: "a² + b² = c²" }
            ]
        },
        NON_EUCLIDEAN: {
            name: "Non-Euclidean Geometry",
            description: "Geometries describing curved space.",
            concepts: [
                { name: "Hyperbolic Geometry", description: "Geometry of negatively curved space (saddle-shaped), where the sum of angles in a triangle is less than 180 degrees." },
                { name: "Elliptic/Spherical Geometry", description: "Geometry of positively curved space (sphere-shaped), where the sum of angles in a triangle is greater than 180 degrees." }
            ]
        },
        DIFFERENTIAL_GEOMETRY: {
            name: "Differential Geometry",
            description: "Uses the techniques of differential calculus to study problems in geometry. It is the language of Einstein's General Relativity.",
            concepts: [
                { name: "Manifolds", description: "Topological spaces that locally resemble Euclidean space." },
                { name: "Tensors", description: "Geometric objects that describe linear relationships between vectors, scalars, and other tensors." },
                { name: "Gauss-Bonnet Theorem", description: "Relates the geometry of a surface (its curvature) to its topology (its Euler characteristic)." }
            ]
        },
        ALGEBRAIC_GEOMETRY: {
            name: "Algebraic Geometry",
            description: "A branch of mathematics that combines techniques of abstract algebra with the language and the problems of geometry, typically by studying the solution sets of polynomial equations."
        },
        FRACTAL_GEOMETRY: {
            name: "Fractal Geometry",
            description: "The study of geometric shapes that are self-similar at different scales, exhibiting infinite detail and complexity.",
            concepts: [
                { name: "Mandelbrot Set", description: "A famous fractal set of complex numbers." },
                { name: "Julia Set", description: "A class of fractals related to the Mandelbrot set." },
                { name: "Hausdorff Dimension", description: "A way to measure the 'roughness' or complexity of a fractal shape, which can be a non-integer." }
            ]
        }
    },
    TOPOLOGY: {
        name: "Topology",
        description: "The study of properties of geometric objects that are preserved under continuous deformations, such as stretching, twisting, crumbling and bending.",
        concepts: [
            { name: "Continuity", description: "The property of a function where small changes in input result in small changes in output." },
            { name: "Homeomorphism", description: "A continuous stretching and bending of an object into a new shape. A coffee mug and a donut are famously homeomorphic." },
            { name: "The Poincaré Conjecture", statement: "A now-proven theorem that states every simply connected, closed 3-manifold is homeomorphic to the 3-sphere." },
            { name: "Knot Theory", description: "The study of mathematical knots, which are embeddings of a circle in 3-dimensional Euclidean space." },
            { name: "Algebraic Topology", description: "Uses tools from abstract algebra to study topological spaces. Key concepts include homology and homotopy groups." }
        ]
    },

    // =================================================================================================
    // --- 4. ANALYSIS ---
    // =================================================================================================
    ANALYSIS: {
        name: "Analysis",
        description: "A branch of mathematics that deals with limits and related theories, such as differentiation, integration, measure, infinite series, and analytic functions.",
        CALCULUS: {
            name: "Calculus",
            description: "The mathematical study of continuous change.",
            DIFFERENTIAL: {
                name: "Differential Calculus",
                description: "Concerns rates of change and slopes of curves.",
                concepts: [{ name: "Derivative", description: "The instantaneous rate of change of a function." }]
            },
            INTEGRAL: {
                name: "Integral Calculus",
                description: "Concerns the accumulation of quantities and the areas under curves.",
                concepts: [{ name: "Integral", description: "The area of a region under a curve." }]
            },
            theorems: [{ name: "Fundamental Theorem of Calculus", statement: "Connects differentiation and integration as inverse operations." }]
        },
        REAL_ANALYSIS: {
            name: "Real Analysis",
            description: "Rigorously defines the concepts of calculus for real numbers, including limits, continuity, derivatives, and integrals.",
            concepts: [{ name: "Measure Theory", description: "Generalizes the intuitive notions of length, area, and volume, forming the basis for modern integration theory (Lebesgue integral)." }]
        },
        COMPLEX_ANALYSIS: {
            name: "Complex Analysis",
            description: "Studies functions of complex numbers. It has practical applications in many branches of physics and engineering.",
            theorems: [{ name: "Cauchy's Integral Theorem", statement: "A fundamental statement about line integrals for holomorphic functions in the complex plane." }]
        },
        FUNCTIONAL_ANALYSIS: {
            name: "Functional Analysis",
            description: "A branch of mathematical analysis, the core of which is formed by the study of vector spaces endowed with some kind of limit-related structure (e.g., inner product, norm, topology) and the linear functions defined on these spaces. Key to quantum mechanics."
        },
        HARMONIC_ANALYSIS: {
            name: "Harmonic Analysis",
            description: "Deals with the representation of functions or signals as the superposition of basic waves, and the study of and generalization of the notions of Fourier series and Fourier transforms.",
            concepts: [{ name: "Fourier Transform", description: "Decomposes a function of time (a signal) into the frequencies that make it up."}]
        }
    },
    TRIGONOMETRY: {
        name: "Trigonometry",
        description: "The study of relationships between side lengths and angles of triangles.",
        functions: ["Sine (sin)", "Cosine (cos)", "Tangent (tan)", "Cosecant (csc)", "Secant (sec)", "Cotangent (cot)"],
        identities: [
            { name: "Pythagorean Identity", formula: "sin²(θ) + cos²(θ) = 1" },
            { name: "Euler's Formula", formula: "e^(iθ) = cos(θ) + i sin(θ)", description: "A profound link between trigonometric functions and the complex exponential function." }
        ]
    },
    DIFFERENTIAL_EQUATIONS: {
        name: "Differential Equations",
        description: "An equation that relates one or more unknown functions and their derivatives. They are used to model systems that change over time.",
        types: [
            { name: "Ordinary Differential Equations (ODEs)", description: "Contain functions of one independent variable and their derivatives." },
            { name: "Partial Differential Equations (PDEs)", description: "Contain unknown multivariable functions and their partial derivatives. Examples include the Heat Equation, Wave Equation, and Navier-Stokes equations." }
        ]
    },
    // =================================================================================================
    // --- 5. APPLIED & DISCRETE MATHEMATICS ---
    // =================================================================================================
    APPLIED_MATHEMATICS: {
        name: "Applied Mathematics",
        description: "The application of mathematical methods by different fields such as physics, engineering, medicine, biology, business, computer science, and industry.",
        PROBABILITY_AND_STATISTICS: {
            name: "Probability and Statistics",
            description: "Probability deals with predicting the likelihood of future events, while statistics involves the analysis of the frequency of past events.",
            theorems: [
                { name: "Bayes' Theorem", description: "Describes the probability of an event, based on prior knowledge of conditions that might be related to the event." },
                { name: "Central Limit Theorem", description: "States that the distribution of the sum (or average) of a large number of independent, identically distributed variables will be approximately normal." }
            ]
        },
        NUMERICAL_ANALYSIS: {
            name: "Numerical Analysis",
            description: "The study of algorithms that use numerical approximation for the problems of mathematical analysis.",
            methods: ["Finite Element Method (FEM)", "Monte Carlo methods", "Newton's Method"]
        },
        MATHEMATICAL_PHYSICS: {
            name: "Mathematical Physics",
            description: "The development of mathematical methods for application to problems in physics.",
            concepts: [
                { name: "Newtonian Mechanics", description: "Laws of motion and universal gravitation." },
                { name: "Quantum Mechanics", description: "Describes nature at the smallest scales of energy levels of atoms and subatomic particles, using Hilbert spaces and operators." },
                { name: "General Relativity", description: "Einstein's theory of gravitation, where gravity is a geometric property of spacetime, described by differential geometry." },
                { name: "String Theory", description: "A theoretical framework in which the point-like particles of particle physics are replaced by one-dimensional objects called strings." }
            ]
        },
        GAME_THEORY: {
            name: "Game Theory",
            description: "The study of mathematical models of strategic interaction among rational decision-makers.",
            concepts: [{ name: "Nash Equilibrium", description: "A proposed solution of a non-cooperative game in which each player is assumed to know the equilibrium strategies of the other players, and no player has anything to gain by changing only their own strategy." }]
        },
        INFORMATION_THEORY: {
            name: "Information Theory",
            description: "A mathematical study of the coding of information in the form of sequences of symbols and of how rapidly this information can be transmitted.",
            concepts: [{ name: "Entropy (Shannon Entropy)", description: "A measure of the uncertainty or randomness in a set of data." }]
        },
        CONTROL_THEORY: {
            name: "Control Theory",
            description: "An interdisciplinary branch of engineering and mathematics that deals with the behavior of dynamical systems with inputs, and how their behavior is modified by feedback."
        },
        CHAOS_THEORY: {
            name: "Chaos Theory",
            description: "Focuses on the behavior of dynamical systems that are highly sensitive to initial conditions.",
            concepts: [
                { name: "The Butterfly Effect", description: "Small changes in initial conditions can lead to large, unpredictable differences in a later state." },
                { name: "Fractals", description: "Infinitely complex patterns that are self-similar across different scales." }
            ]
        }
    },
    DISCRETE_MATHEMATICS: {
        name: "Discrete Mathematics",
        description: "The study of mathematical structures that are fundamentally discrete rather than continuous. It is the mathematical language of computer science.",
        COMBINATORICS: {
            name: "Combinatorics",
            description: "An area of mathematics primarily concerned with counting, both as a means and an end in obtaining results, and certain properties of finite structures."
        },
        GRAPH_THEORY: {
            name: "Graph Theory",
            description: "The study of graphs, which are mathematical structures used to model pairwise relations between objects.",
            concepts: ["Nodes (Vertices)", "Edges", "Paths", "Cycles", "The Four Color Theorem"]
        },
        CRYPTOGRAPHY: {
            name: "Cryptography",
            description: "The practice and study of techniques for secure communication in the presence of adversaries.",
            concepts: ["Public-Key Cryptography (RSA)", "Hashing (SHA-256)", "Elliptic Curve Cryptography"]
        },
        THEORY_OF_COMPUTATION: {
            name: "Theory of Computation",
            description: "Deals with how efficiently problems can be solved on a model of computation, using an algorithm.",
            concepts: [
                { name: "Automata Theory", description: "The study of abstract machines and the computational problems that can be solved using them." },
                { name: "Computability Theory", description: "Classifies problems according to whether they are solvable by a computer (see Halting Problem)." },
                { name: "Computational Complexity Theory", description: "Classifies solvable problems according to their difficulty (see P vs NP problem)." }
            ]
        }
    },
    // =================================================================================================
    // --- 6. ESOTERIC & STRUCTURAL MATHEMATICS ---
    // =================================================================================================
    ESOTERIC_MATHEMATICS: {
        name: "Esoteric & Structural Mathematics",
        description: "Systems that ascribe qualitative, symbolic, or spiritual significance to numbers and forms, seeking patterns in structure rather than quantity.",
        GEMATRIA_AND_ISOPSEPHY: {
            name: "Gematria & Isopsephy",
            description: "Numerological systems of assigning a numerical value to a word or phrase based on its constituent letters.",
            methods: [
                { name: "Hebrew Standard Gematria", description: "Aleph=1 ... Tav=400" },
                { name: "Greek Isopsephy", description: "Alpha=1 ... Omega=800" },
                { name: "Ordinal", description: "Values from 1 to 22 (Hebrew) or 1 to 24 (Greek)." },
                { name: "Reduced (Mispar Katan)", description: "Values are reduced to a single digit." },
                { name: "Milui (Full Spelling)", description: "The value of a letter is the value of its spelled-out name (e.g., Aleph = אלף = 1+30+80 = 111)." }
            ]
        },
        SACRED_GEOMETRY: {
            name: "Sacred Geometry",
            description: "The ascription of religious or cultural value to geometric shapes and proportions, believed to be the blueprint of creation.",
            forms: [
                { name: "Flower of Life", description: "A geometrical figure composed of multiple evenly spaced, overlapping circles." },
                { name: "Metatron's Cube", description: "A figure derived from the Flower of Life, containing all five Platonic solids." },
                { name: "Platonic Solids", description: "The five convex regular polyhedra: Tetrahedron (Fire), Cube (Earth), Octahedron (Air), Dodecahedron (Aether), and Icosahedron (Water)." },
                { name: "Vesica Piscis", description: "The shape formed by the intersection of two circles of the same radius, intersecting in such a way that the center of each circle lies on the circumference of the other." }
            ]
        },
        PYTHAGOREAN_MYSTICISM: {
            name: "Pythagorean Mysticism",
            description: "An ancient Greek philosophical and religious system holding that reality is mathematical in nature, ascribing mystical properties to numbers.",
            concepts: [
                { name: "Tetractys", description: "A triangular figure of ten points, representing the organization of the cosmos." },
                { name: "Music of the Spheres", description: "A philosophical concept that regards proportions in the movements of celestial bodies as a form of music." }
            ]
        }
    }
};

/**
 * The CodexService provides a simple, robust interface for querying the static,
 * pre-computed knowledge base of the Codex Mathematica Universalis.
 */
class CodexService {
    private data: any;

    constructor() {
        this.data = CODEX_MATHEMATICA_UNIVERSALIS;
    }

    /**
     * Performs a case-insensitive, keyword-based lookup on the Codex.
     * @param query The concept to search for (e.g., "Pythagorean Theorem", "Chaos Theory").
     * @returns A formatted string with the found information or a message indicating it wasn't found.
     */
    public lookup(query: string): string {
        const lowerCaseQuery = query.toLowerCase().trim().replace(/ /g, '_');
        const path = this.findPath(this.data, lowerCaseQuery);

        if (path && path.length > 0) {
            const result = path[path.length - 1].node;
            const title = result.name || query.replace(/_/g, ' ');
            return this.formatResult(title, result, path);
        }

        // Fallback for theorems or concepts nested in arrays
        const deepSearchResult = this.deepSearch(this.data, query.toLowerCase().trim());
        if(deepSearchResult) {
             return this.formatResult(deepSearchResult.name, deepSearchResult);
        }

        return `The concept "${query}" was not found in the Codex Mathematica Universalis. The query must be precise.`;
    }
    
    private deepSearch(obj: any, query: string): any | null {
         for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (item.name && item.name.toLowerCase().replace(/ /g, '_').includes(query.replace(/ /g, '_'))) {
                            return item;
                        }
                    }
                }
                const found = this.deepSearch(value, query);
                if (found) return found;
            }
        }
        return null;
    }


    private findPath(obj: any, query: string, currentPath: any[] = []): any[] | null {
        for (const key in obj) {
            const node = obj[key];
            if (typeof node === 'object' && node !== null) {
                const newPath = [...currentPath, { key, node }];
                const nodeName = node.name ? node.name.toLowerCase().replace(/ /g, '_') : key.toLowerCase();

                if (nodeName.includes(query)) {
                    return newPath;
                }

                const result = this.findPath(node, query, newPath);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    private formatResult(title: string, data: any, path: any[] = []): string {
        let output = `[CODEX ENTRY: ${title.toUpperCase()}]\n\n`;
        
        if (path.length > 1) {
            const breadcrumb = path.slice(0, -1).map(p => p.node.name || p.key).join(' > ');
            output += `Path: ${breadcrumb}\n`;
        }
        
        output += `Description: ${data.description || data.statement || 'N/A'}\n\n`;

        const formatSection = (sectionTitle: string, items: any) => {
            if (!items || (Array.isArray(items) && items.length === 0)) return;
            output += `--- ${sectionTitle.toUpperCase()} ---\n`;
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (typeof item === 'string') {
                         output += `• ${item}\n`;
                    } else {
                        output += `• ${item.name}: ${item.description || item.statement || item.formula || item.value}\n`;
                    }
                });
            } else if (typeof items === 'object') {
                 for(const key in items) {
                     output += `• ${items[key].name || key.replace(/_/g, ' ')}: ${items[key].description || 'See sub-entry.'}\n`
                 }
            }
            output += `\n`;
        };
        
        if (data.value) output += `Value: ${data.value}\n\n`;
        if (data.formula) output += `Formula: ${data.formula}\n\n`;
        if (data.symbol) output += `Symbol: ${data.symbol}\n\n`;


        // Dynamically find and format sections
        for(const key in data) {
            if(key !== 'name' && key !== 'description' && key !== 'statement' && key !== 'value' && key !== 'formula' && key !== 'symbol') {
                formatSection(key.replace(/_/g, ' '), data[key]);
            }
        }

        return output.trim();
    }
}

export const codexService = new CodexService();