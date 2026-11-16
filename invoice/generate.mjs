#!/usr/bin/env node
/**
 * Generate a complete Swiss QR-Rechnung (invoice + payment part) as PDF.
 *
 * Usage:
 *   node generate.mjs
 *   node generate.mjs --out ./samples/rechnung.pdf
 *   node generate.mjs --data ./examples/sample-invoice.json
 *
 * Flags:
 *   --out <path>     Output PDF path (default: ./output/QR_Rechnung_<invoiceNumber>.pdf)
 *   --data <path>    JSON file with invoice fields (see examples/sample-invoice.json)
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeInvoicePdf } from "./create-invoice.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { out: null, data: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") args.out = argv[++i];
    else if (a === "--data") args.data = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

const defaultSample = {
  invoiceNumber: "20261111",
  invoiceDate: "2026-11-14",
  amount: 100,
  currency: "CHF",
  description: "Durchführung des Pub Quizzes im Eiger vom 11.11.2026",
  debtor: {
    name: "KG Gastrokultur GmbH",
    address: "Könzistrasse",
    buildingNumber: "151",
    zip: "3097",
    city: "Liebefeld",
    country: "CH",
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node generate.mjs [--data file.json] [--out file.pdf]`);
    process.exit(0);
  }

  let input = defaultSample;
  if (args.data) {
    const raw = await readFile(path.resolve(args.data), "utf8");
    input = JSON.parse(raw);
  }

  const tmpInvoiceNumber = input.invoiceNumber || "invoice";
  const outPath = path.resolve(
    args.out ||
      path.join(__dirname, "output", `QR_Rechnung_${tmpInvoiceNumber}.pdf`)
  );
  await mkdir(path.dirname(outPath), { recursive: true });

  const { invoice } = await writeInvoicePdf(input, outPath);
  console.log(`Wrote ${outPath}`);
  console.log(
    JSON.stringify(
      {
        invoiceNumber: invoice.invoiceNumber,
        reference: invoice.reference,
        amount: invoice.amount,
        currency: invoice.currency,
        dueDate: invoice.dueDate.toISOString().slice(0, 10),
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
