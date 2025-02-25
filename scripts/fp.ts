const MAX_OVERLOADS = parseInt(Deno.args[0]) || 50; // Adjust as needed

function generatePipe(): string {
  let output = "";

  output += `type UnaryFn<T, R> = (arg: T) => R;\n\n`;

  for (let i = 1; i <= MAX_OVERLOADS; i++) {
    const generics = [
      "T",
      ...Array.from({ length: i }, (_, idx) => `R${idx + 1}`),
    ].join(", ");
    const params = Array.from(
      { length: i },
      (_, idx) =>
        `fn${idx + 1}: UnaryFn<${idx === 0 ? "T" : `R${idx}`}, R${idx + 1}>`,
    ).join(", ");

    output += `// deno-fmt-ignore\nexport function pipe<${generics}>(${
      ["value: T", params].join(", ")
    }): R${i};\n`;
  }

  output +=
    `export function pipe(value: unknown, ...fns: Array<(arg: unknown) => unknown>): unknown {\n`;
  output += `  return fns.reduce((acc, fn) => fn(acc), value);\n`;
  output += `}\n\n`;

  return output;
}

function generateFlow(): string {
  let output = "";

  output += `type VariadicFn<T extends unknown[], R> = (...args: T) => R;\n\n`;

  for (let i = 1; i <= MAX_OVERLOADS; i++) {
    const generics = [
      "T extends unknown[], R1",
      ...Array.from({ length: i - 1 }, (_, idx) => `R${idx + 2}`),
    ].join(", ");
    const params = Array.from(
      { length: i - 1 },
      (_, idx) => `fn${idx + 2}: UnaryFn<R${idx + 1}, R${idx + 2}>`,
    ).join(", ");

    output += `// deno-fmt-ignore\nexport function flow<${generics}>(`;
    output += `fn1: VariadicFn<T, R1>${params ? `, ${params}` : ""}`;
    output += `): VariadicFn<T, R${i}>;\n`;
  }

  output +=
    `export function flow(...fns: Array<(...args: unknown[]) => unknown>): (...args: unknown[]) => unknown {\n`;
  output += `  return (...args: unknown[]) => {\n`;
  output += `    const [first, ...rest] = fns;\n`;
  output += `    return rest.reduce((acc, fn) => fn(acc), first(...args));\n`;
  output += `  };\n`;
  output += `}\n`;

  return output;
}

async function generateFp() {
  const output = generatePipe() + generateFlow();
  const encoder = new TextEncoder();
  await Deno.writeFile("src/fp.ts", encoder.encode(output));
}

// Run the function
generateFp();
