import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = join(__dirname, "..", "..", "knowledge");

/**
 * Load a JSON knowledge file
 */
export function loadJSON<T = unknown>(filename: string): T {
    const filePath = join(KNOWLEDGE_DIR, filename);
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
}

/**
 * Load a markdown documentation file
 */
export function loadDoc(filename: string): string {
    const filePath = join(KNOWLEDGE_DIR, "docs", filename);
    if (!existsSync(filePath)) {
        throw new Error(`Documentation file not found: ${filename}`);
    }
    return readFileSync(filePath, "utf-8");
}

/**
 * List all available documentation files
 */
export function listDocs(): string[] {
    const docsDir = join(KNOWLEDGE_DIR, "docs");
    return readdirSync(docsDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
}

// ── Type definitions ──

export interface DirectiveInfo {
    name: string;
    category: string;
    description: string;
    syntax: string;
    examples?: Array<{ html: string; description: string }>;
    notes?: string;
}

export interface DirectivesKB {
    version: string;
    categories: Array<{ id: string; name: string; description: string }>;
    directives: DirectiveInfo[];
}

export interface FilterInfo {
    name: string;
    category: string;
    description: string;
    syntax: string;
    example?: string;
}

export interface FiltersKB {
    version: string;
    categories: Array<{ id: string; name: string }>;
    filters: FilterInfo[];
}

export interface ApiKB {
    version: string;
    name: string;
    tagline: string;
    description: string;
    cdn: string;
    api: Record<string, unknown>;
    utilities: Record<string, string>;
    quickStart: string;
}
