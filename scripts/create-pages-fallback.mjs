/**
 * Gera o fallback de GitHub Pages após o build da edição estática.
 * A cópia conserva o caminho requisitado para que Wouter escolha a rota cliente.
 */
import { access, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve("dist", "public");
const indexFile = resolve(outputDirectory, "index.html");
const fallbackFile = resolve(outputDirectory, "404.html");

await access(indexFile, constants.R_OK);
await copyFile(indexFile, fallbackFile);
console.log("GitHub Pages fallback created: dist/public/404.html");
