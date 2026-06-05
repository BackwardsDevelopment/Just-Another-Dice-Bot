export function randInt(max: number): number {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0]! % max;
}


export function evalModifiers(val: number, modifiers: string) {
  const tokens = modifiers.match(/[+\-*/]\d+(\.\d+)?/g) ?? [];
  return tokens.reduce((acc, token) => {
    const op = token[0];
    const num = parseFloat(token.slice(1));
    switch (op) {
      case '+': return acc + num;
      case '-': return acc - num;
      case '*': return acc * num;
      case '/': return acc / num;
      default: return acc;
    }
  }, val);
}