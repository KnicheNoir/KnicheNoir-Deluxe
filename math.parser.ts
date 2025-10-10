// =================================================================================================
// --- UNIMATICS PARSER ---
// This file contains the logic for parsing mathematical expressions into an
// Abstract Syntax Tree (AST), which can then be evaluated or manipulated by the Unimatics Kernel.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { AstNode, UnaryOperator, MathDomain } from './types.ts';
import * as kernel from './unimatics.kernel.ts';

// #region ################################### TOKENIZER ######################################

type TokenType =
  | 'NUMBER' | 'IDENTIFIER'
  | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'POWER'
  | 'LPAREN' | 'RPAREN' | 'COMMA' | 'EOF';

interface Token {
  type: TokenType;
  value: string;
}

const tokenRegex =
  /(?<NUMBER>\d+(\.\d+)?)|(?<IDENTIFIER>[a-zA-Z_][a-zA-Z_0-9]*)|(?<PLUS>\+)|(?<MINUS>-)|(?<MULTIPLY>\*)|(?<DIVIDE>\/)|(?<POWER>\^)|(?<LPAREN>\()|(?<RPAREN>\))|(?<COMMA>,)/g;


function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  for (const match of expression.matchAll(tokenRegex)) {
    for (const key in match.groups) {
      if (match.groups[key] !== undefined) {
        tokens.push({ type: key as TokenType, value: match.groups[key] });
        break;
      }
    }
  }
  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}
// #endregion

// #region ##################################### PARSER #######################################

class Parser {
  private tokens: Token[] = [];
  private pos = 0;

  private currentToken(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    this.pos++;
    return this.tokens[this.pos - 1];
  }

  private match(...types: TokenType[]): boolean {
    if (types.includes(this.currentToken().type)) {
      this.advance();
      return true;
    }
    return false;
  }
  
  private consume(type: TokenType, message: string): Token {
    if (this.currentToken().type === type) {
        return this.advance();
    }
    throw new Error(message);
  }

  // Primary -> Unary -> Power -> Factor -> Term -> Expression
  
  private parsePrimary(): AstNode {
    if (this.match('NUMBER')) {
      return { type: 'number', value: parseFloat(this.tokens[this.pos - 1].value) };
    }
    if (this.match('IDENTIFIER')) {
        const identifier = this.tokens[this.pos - 1];
        if (this.match('LPAREN')) { // Function call
            const operand = this.parseExpression();
            this.consume('RPAREN', "Expected ')' after function argument.");
            return { type: 'unaryOp', op: identifier.value as UnaryOperator, operand: operand };
        }
        return { type: 'variable', name: identifier.value };
    }
    if (this.match('LPAREN')) {
      const expr = this.parseExpression();
      this.consume('RPAREN', "Expected ')' after expression.");
      return expr;
    }
    throw new Error(`Unexpected token: ${this.currentToken().value}`);
  }

  private parseUnary(): AstNode {
      if (this.match('MINUS')) {
          const operand = this.parseUnary();
          return { type: 'unaryOp', op: 'neg', operand: operand };
      }
      if (this.match('PLUS')) {
          return this.parseUnary();
      }
      return this.parsePrimary();
  }
  
  private parsePower(): AstNode {
    let expr = this.parseUnary();
    while (this.match('POWER')) {
        const right = this.parseUnary(); // Right-associative
        expr = { type: 'binaryOp', op: '^', left: expr, right: right };
    }
    return expr;
  }

  private parseFactor(): AstNode {
    let expr = this.parsePower();
    while (this.match('MULTIPLY', 'DIVIDE')) {
      const operator = this.tokens[this.pos - 1].type === 'MULTIPLY' ? '*' : '/';
      const right = this.parsePower();
      expr = { type: 'binaryOp', op: operator, left: expr, right };
    }
    return expr;
  }

  private parseTerm(): AstNode {
    let expr = this.parseFactor();
    while (this.match('PLUS', 'MINUS')) {
      const operator = this.tokens[this.pos - 1].type === 'PLUS' ? '+' : '-';
      const right = this.parseFactor();
      expr = { type: 'binaryOp', op: operator, left: expr, right };
    }
    return expr;
  }

  private parseExpression(): AstNode {
    return this.parseTerm();
  }

  public parse(tokens: Token[]): AstNode {
    this.tokens = tokens;
    this.pos = 0;
    return this.parseExpression();
  }
}

// #endregion

// #region ############################# PUBLIC INTERFACE #####################################

/**
 * The main entry point for the parser. It takes a mathematical expression string
 * and returns a structured AST and analysis metadata.
 * @param input The mathematical expression string.
 * @returns An object containing the AST and inferred operation.
 */
export function parseMathematicalExpression(input: string): { ast: AstNode, domain: MathDomain, operation: string } {
    const lowerInput = input.toLowerCase();

    // --- Calculus Operation Detection ---
    if (lowerInput.startsWith('derivative of')) {
        const expressionStr = input.substring('derivative of'.length).trim();
        const parts = expressionStr.split(' with respect to ');
        if (parts.length !== 2) throw new Error("Invalid derivative format. Expected 'derivative of <expression> with respect to <variable>'.");
        
        const tokens = tokenize(parts[0]);
        const parser = new Parser();
        const ast = parser.parse(tokens);
        const derivativeAst = kernel.calculateDerivative(ast, parts[1].trim());

        return {
            ast: derivativeAst,
            domain: 'Calculus',
            operation: `Derivative with respect to ${parts[1].trim()}`,
        };
    }
    
    if (lowerInput.startsWith('evaluate')) {
         const expressionStr = input.substring('evaluate'.length).trim();
         const tokens = tokenize(expressionStr);
         const parser = new Parser();
         const ast = parser.parse(tokens);
         return { ast, domain: 'Equation Solving', operation: 'Evaluation' };
    }

    // Default to parsing the whole expression for evaluation
    const tokens = tokenize(input);
    const parser = new Parser();
    const ast = parser.parse(tokens);
    return { ast, domain: 'Equation Solving', operation: 'Evaluation' };
}
// #endregion