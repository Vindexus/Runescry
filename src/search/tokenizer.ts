export type OsOp = '=' | '>=' | '<=' | '>' | '<';

export type Token =
  | { type: 'WORD'; value: string }
  | { type: 'OR' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' }
  | { type: 'MINUS' }
  | { type: 'OS_EXPR'; op: OsOp; value: number }
  | { type: 'BASE_EXPR'; value: string };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    // Skip whitespace
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }

    if (input[i] === '(') {
      tokens.push({ type: 'LPAREN' });
      i++;
      continue;
    }

    if (input[i] === ')') {
      tokens.push({ type: 'RPAREN' });
      i++;
      continue;
    }

    if (input[i] === '-') {
      tokens.push({ type: 'MINUS' });
      i++;
      continue;
    }

    // os: expressions — os:4, os>=4, os<=3, os>4, os<4, os=4
    if (input.slice(i).toLowerCase().startsWith('os')) {
      const rest = input.slice(i + 2);
      const opMatch = rest.match(/^(>=|<=|>|<|:|=)(\d+)/);
      if (opMatch) {
        const rawOp = opMatch[1];
        const op: OsOp = rawOp === ':' ? '=' : (rawOp as OsOp);
        const value = parseInt(opMatch[2], 10);
        tokens.push({ type: 'OS_EXPR', op, value });
        i += 2 + opMatch[0].length;
        continue;
      }
    }

    // base: expressions — base:sword, base:melee
    if (input.slice(i).toLowerCase().startsWith('base:')) {
      i += 5;
      let value = '';
      while (i < input.length && !/[\s()]/.test(input[i])) {
        value += input[i];
        i++;
      }
      if (value) tokens.push({ type: 'BASE_EXPR', value: value.toLowerCase() });
      continue;
    }

    // Read a word (stops at whitespace, parens, or minus)
    let word = '';
    while (i < input.length && !/[\s()\-]/.test(input[i])) {
      word += input[i];
      i++;
    }
    if (word.toLowerCase() === 'or') {
      tokens.push({ type: 'OR' });
    } else if (word) {
      tokens.push({ type: 'WORD', value: word.toLowerCase() });
    }
  }

  return tokens;
}
