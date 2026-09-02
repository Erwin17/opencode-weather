async function* createReader(): AsyncGenerator<string> {
  process.stdin.setEncoding("utf8");
  let buffer = "";
  for await (const fragment of process.stdin) {
    buffer += String(fragment);
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      yield buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
    }
  }
  if (buffer.length > 0) yield buffer;
}

const reader = createReader();
let eof = false;

export async function ask(question: string): Promise<string> {
  if (eof) return "";
  process.stdout.write(question);
  const result = await reader.next();
  if (result.done) {
    eof = true;
    return "";
  }
  return result.value.trim();
}

export function isEof(): boolean {
  return eof;
}

export async function closeReader(): Promise<void> {
  await reader.return(undefined);
}

export function parseIndex(input: string, total: number): number | null {
  const index = Number.parseInt(input, 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= total) return null;
  return index;
}
