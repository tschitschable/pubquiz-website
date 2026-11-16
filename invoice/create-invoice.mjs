import PDFDocument from "pdfkit";
import { SwissQRBill, Table } from "swissqrbill/pdf";
import {
  calculateSCORReferenceChecksum,
  formatIBAN,
  formatSCORReference,
  mm2pt,
} from "swissqrbill/utils";

import { CREDITOR } from "./creditor.mjs";

const A4_WIDTH = mm2pt(210);
const MARGIN_X = mm2pt(20);
const CONTENT_WIDTH = A4_WIDTH - MARGIN_X * 2;

/**
 * Build an ISO 11649 Creditor Reference (SCOR) from a free-form invoice id.
 * Example: "20261111" → "RF45 2026 1111" (check digits computed).
 */
export function buildScorReference(invoiceNumber) {
  const body = String(invoiceNumber || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 21);
  if (!body) {
    throw new Error("invoiceNumber is required to build an SCOR reference");
  }
  const check = calculateSCORReferenceChecksum(body);
  return `RF${check}${body}`;
}

export function formatChDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function normalizeInvoiceInput(input = {}) {
  const invoiceDate = input.invoiceDate
    ? new Date(input.invoiceDate)
    : new Date();
  const paymentDays =
    input.paymentDays ?? CREDITOR.defaultPaymentDays ?? 30;
  const dueDate = input.dueDate
    ? new Date(input.dueDate)
    : addDays(invoiceDate, paymentDays);

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("amount must be a non-negative number");
  }

  const invoiceNumber =
    input.invoiceNumber ||
    `PQ-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, "0")}${String(invoiceDate.getDate()).padStart(2, "0")}`;

  const reference =
    input.reference || buildScorReference(invoiceNumber.replace(/^PQ-/, ""));

  const debtor = {
    name: String(input.debtor?.name || "").trim(),
    address: String(input.debtor?.address || "").trim(),
    buildingNumber: String(input.debtor?.buildingNumber || "").trim(),
    zip: String(input.debtor?.zip || "").trim(),
    city: String(input.debtor?.city || "").trim(),
    country: String(input.debtor?.country || "CH").trim().toUpperCase(),
  };

  if (!debtor.name || !debtor.address || !debtor.zip || !debtor.city) {
    throw new Error(
      "debtor.name, debtor.address, debtor.zip and debtor.city are required"
    );
  }

  const description =
    String(input.description || "").trim() ||
    "Pub Quiz Durchführung";

  const message = String(
    input.message ||
      `${description}. Zahlbar bis ${formatChDate(dueDate)}.`
  ).slice(0, 140);

  return {
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentDays,
    amount,
    currency: input.currency === "EUR" ? "EUR" : "CHF",
    description,
    message,
    reference,
    debtor,
    language: input.language || CREDITOR.language || "DE",
  };
}

export function toSwissQrData(invoice) {
  return {
    amount: invoice.amount,
    currency: invoice.currency,
    creditor: {
      account: CREDITOR.iban.replace(/\s/g, ""),
      name: CREDITOR.tradeName,
      address: CREDITOR.address,
      buildingNumber: CREDITOR.buildingNumber,
      zip: CREDITOR.zip,
      city: CREDITOR.city,
      country: CREDITOR.country,
    },
    debtor: {
      name: invoice.debtor.name,
      address: invoice.debtor.address,
      buildingNumber: invoice.debtor.buildingNumber || undefined,
      zip: invoice.debtor.zip,
      city: invoice.debtor.city,
      country: invoice.debtor.country,
    },
    reference: invoice.reference,
    message: invoice.message,
  };
}

function drawAddressBlock(doc, x, y, lines, options = {}) {
  doc.font(options.bold ? "Helvetica-Bold" : "Helvetica").fontSize(options.size || 10);
  let cursorY = y;
  for (const line of lines) {
    if (!line) continue;
    doc.text(line, x, cursorY, {
      width: options.width || mm2pt(80),
      lineGap: 1,
    });
    cursorY = doc.y;
  }
  return cursorY;
}

function formatMoney(amount, currency) {
  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Write a complete A4 Swiss business invoice + QR-bill payment part to `outputPath`
 * or return a PDFKit document piped by the caller.
 */
export function createInvoicePdf(rawInput, { outputStream } = {}) {
  const invoice = normalizeInvoiceInput(rawInput);
  const qrData = toSwissQrData(invoice);

  const doc = new PDFDocument({ size: "A4", margin: 0 });
  if (outputStream) {
    doc.pipe(outputStream);
  }

  // --- Invoice document part (above the payment slip) ---
  let y = mm2pt(18);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111111")
    .text(CREDITOR.tradeName, MARGIN_X, y, { width: CONTENT_WIDTH });
  y = doc.y + 4;

  doc.font("Helvetica").fontSize(9).fillColor("#333333");
  const issuerLines = [
    CREDITOR.legalName,
    `${CREDITOR.address} ${CREDITOR.buildingNumber}`,
    `${CREDITOR.zip} ${CREDITOR.city}`,
    CREDITOR.email,
    `IBAN ${formatIBAN(CREDITOR.iban)}`,
  ];
  for (const line of issuerLines) {
    doc.text(line, MARGIN_X, y, { width: mm2pt(90) });
    y = doc.y;
  }

  // Meta block top-right
  const metaX = MARGIN_X + mm2pt(110);
  let metaY = mm2pt(18);
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#111111");
  doc.text("Rechnung", metaX, metaY, { width: mm2pt(60), align: "right" });
  metaY = doc.y + 8;
  doc.font("Helvetica").fontSize(9).fillColor("#333333");
  const metaLines = [
    `Rechnungsnummer: ${invoice.invoiceNumber}`,
    `Rechnungsdatum: ${formatChDate(invoice.invoiceDate)}`,
    `Fällig bis: ${formatChDate(invoice.dueDate)}`,
    `Referenz: ${formatSCORReference(invoice.reference)}`,
  ];
  for (const line of metaLines) {
    doc.text(line, metaX, metaY, { width: mm2pt(60), align: "right" });
    metaY = doc.y;
  }

  y = Math.max(y, metaY) + mm2pt(12);

  // Debtor ("Bill to")
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#666666");
  doc.text("Rechnungsempfänger", MARGIN_X, y);
  y = doc.y + 2;
  y = drawAddressBlock(
    doc,
    MARGIN_X,
    y,
    [
      invoice.debtor.name,
      `${invoice.debtor.address}${invoice.debtor.buildingNumber ? ` ${invoice.debtor.buildingNumber}` : ""}`,
      `${invoice.debtor.zip} ${invoice.debtor.city}`,
      invoice.debtor.country !== "CH" ? invoice.debtor.country : "",
    ],
    { size: 11, bold: false, width: mm2pt(90) }
  );

  y += mm2pt(10);

  doc.font("Helvetica").fontSize(10).fillColor("#222222");
  doc.text(
    "Vielen Dank für Ihren Auftrag. Bitte überweisen Sie den Rechnungsbetrag mit der QR-Rechnung unten.",
    MARGIN_X,
    y,
    { width: CONTENT_WIDTH }
  );
  y = doc.y + mm2pt(8);

  const amountLabel = formatMoney(invoice.amount, invoice.currency);
  const table = new Table({
    width: CONTENT_WIDTH,
    fontSize: 10,
    padding: 6,
    rows: [
      {
        header: true,
        backgroundColor: "#F2F2F2",
        fontName: "Helvetica-Bold",
        columns: [
          { text: "Beschreibung", width: CONTENT_WIDTH * 0.62 },
          { text: "Menge", width: CONTENT_WIDTH * 0.12, align: "right" },
          { text: "Betrag", width: CONTENT_WIDTH * 0.26, align: "right" },
        ],
      },
      {
        columns: [
          { text: invoice.description, width: CONTENT_WIDTH * 0.62 },
          { text: "1", width: CONTENT_WIDTH * 0.12, align: "right" },
          { text: amountLabel, width: CONTENT_WIDTH * 0.26, align: "right" },
        ],
      },
      {
        fontName: "Helvetica-Bold",
        columns: [
          { text: "Total", width: CONTENT_WIDTH * 0.74, align: "right" },
          { text: amountLabel, width: CONTENT_WIDTH * 0.26, align: "right" },
        ],
      },
    ],
  });
  table.attachTo(doc, MARGIN_X, y);
  y = doc.y + mm2pt(10);

  doc.font("Helvetica").fontSize(9).fillColor("#333333");
  doc.text(`Zahlungsfrist: ${invoice.paymentDays} Tage (bis ${formatChDate(invoice.dueDate)}).`, MARGIN_X, y, {
    width: CONTENT_WIDTH,
  });
  y = doc.y + 2;

  if (CREDITOR.vatUid) {
    doc.text(`MWST-Nr. / UID: ${CREDITOR.vatUid}`, MARGIN_X, y, {
      width: CONTENT_WIDTH,
    });
  } else if (CREDITOR.vatNote) {
    doc.text(CREDITOR.vatNote, MARGIN_X, y, { width: CONTENT_WIDTH });
  }
  y = doc.y + mm2pt(6);

  doc.fontSize(8).fillColor("#666666");
  doc.text(
    `Aussteller: ${CREDITOR.tradeName} · ${CREDITOR.legalName} · ${CREDITOR.address} ${CREDITOR.buildingNumber}, ${CREDITOR.zip} ${CREDITOR.city} · ${CREDITOR.email}`,
    MARGIN_X,
    y,
    { width: CONTENT_WIDTH }
  );

  // --- Swiss QR-bill payment part (Empfangsschein + Zahlteil) ---
  const qrBill = new SwissQRBill(qrData, {
    language: invoice.language,
    scissors: true,
    outlines: true,
  });
  qrBill.attachTo(doc);

  return { doc, invoice, qrData };
}

export async function writeInvoicePdf(rawInput, outputPath) {
  const { createWriteStream } = await import("node:fs");
  const { doc, invoice } = createInvoicePdf(rawInput);
  const stream = createWriteStream(outputPath);
  doc.pipe(stream);
  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
  return { outputPath, invoice };
}
