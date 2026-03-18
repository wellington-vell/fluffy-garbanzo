import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

type ClienteSeed = {
  nome: string;
  sobrenome: string;
  email: string;
  ativo: boolean;
};

type ProdutoSeed = {
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  imagemUri: string | null;
};

type LinkSeed = {
  clienteIndex: number; // index in clientes[]
  produtoIndex: number; // index in produtos[]
  quantidade: number;
};

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

function toSqlValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${sqlEscape(String(value))}'`;
}

function runSqlite(dbPath: string, sql: string) {
  execFileSync("sqlite3", [dbPath], { input: sql, stdio: ["pipe", "inherit", "inherit"] });
}

const repoRoot = path.resolve(__dirname, "..");
const drizzleDir = path.join(repoRoot, "drizzle");
const outDb = path.join(drizzleDir, "desafioTW.seed.db");

mkdirSync(drizzleDir, { recursive: true });
if (existsSync(outDb)) rmSync(outDb);

const migrations = [
  path.join(drizzleDir, "0000_complex_grey_gargoyle.sql"),
  path.join(drizzleDir, "0001_abandoned_clea.sql"),
  path.join(drizzleDir, "0002_imagem_uri_produto.sql"),
];

for (const file of migrations) {
  const sql = `PRAGMA foreign_keys=OFF;\n.read ${toSqlValue(file)}\n`;
  runSqlite(outDb, sql);
}

const now = new Date().toISOString();

const clientes: ClienteSeed[] = [
  { nome: "Ana", sobrenome: "Silva", email: "ana.silva@example.com", ativo: true },
  { nome: "Bruno", sobrenome: "Souza", email: "bruno.souza@example.com", ativo: true },
  { nome: "Carla", sobrenome: "Oliveira", email: "carla.oliveira@example.com", ativo: false },
];

const produtos: ProdutoSeed[] = [
  {
    nome: "Notebook",
    descricao: "14\" 16GB RAM",
    preco: 3999.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
  },
  {
    nome: "Mouse",
    descricao: "Sem fio",
    preco: 129.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
  },
  {
    nome: "Teclado",
    descricao: "Mecânico",
    preco: 299.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
  },
  {
    nome: "Headset",
    descricao: null,
    preco: 199.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    nome: "Monitor",
    descricao: "24\" IPS",
    preco: 899.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
  },
];

const links: LinkSeed[] = [
  { clienteIndex: 0, produtoIndex: 0, quantidade: 1 },
  { clienteIndex: 0, produtoIndex: 1, quantidade: 2 },
  { clienteIndex: 1, produtoIndex: 2, quantidade: 1 },
  { clienteIndex: 1, produtoIndex: 4, quantidade: 1 },
  { clienteIndex: 2, produtoIndex: 3, quantidade: 3 },
];

let seedSql = "";

// Insert clientes
for (const c of clientes) {
  seedSql +=
    "INSERT INTO Cliente (Nome, Sobrenome, Email, DataCadastro, Ativo) VALUES (" +
    [c.nome, c.sobrenome, c.email, now, c.ativo].map(toSqlValue).join(", ") +
    ");\n";
}

// Insert produtos
for (const p of produtos) {
  seedSql +=
    "INSERT INTO Produto (Nome, Descricao, Preco, Ativo, ImagemUri) VALUES (" +
    [p.nome, p.descricao, p.preco, p.ativo, p.imagemUri].map(toSqlValue).join(", ") +
    ");\n";
}

// Insert links using deterministic IDs (since we just created DB)
for (const l of links) {
  const clienteId = l.clienteIndex + 1;
  const produtoId = l.produtoIndex + 1;
  seedSql +=
    "INSERT INTO ClienteProduto (ClienteId, ProdutoId, Quantidade, DataVinculo) VALUES (" +
    [clienteId, produtoId, l.quantidade, now].map(toSqlValue).join(", ") +
    ");\n";
}

runSqlite(outDb, "BEGIN;\n" + seedSql + "COMMIT;\n");

console.log(`Seed generated: ${outDb}`);

