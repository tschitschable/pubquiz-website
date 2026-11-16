/**
 * Creditor / issuer details for Pub Quiz Bern invoices.
 * Only values that already exist in the product (sample QR bill + impressum).
 *
 * If you later get a Swiss UID / MWST number, set `vatUid` (e.g. "CHE-123.456.789")
 * and clear `vatNote`, or keep both if you want an explicit tax status line.
 */
export const CREDITOR = {
  tradeName: "Pub Quiz Bern",
  legalName: "Jannis Valaulta",
  address: "Kyburgstrasse",
  buildingNumber: "5",
  zip: "3013",
  city: "Bern",
  country: "CH",
  email: "pubquizbern@gmail.com",
  /** Regular PostFinance IBAN (not a QR-IBAN) → use SCOR / RF creditor references */
  iban: "CH60 0900 0000 1693 9006 9",
  /** Leave empty until a real UID is provided; do not invent one. */
  vatUid: "",
  /** Shown when vatUid is empty so invoices still state tax status clearly. */
  vatNote: "Nicht MWST-pflichtig / no VAT charged.",
  defaultPaymentDays: 30,
  language: "DE",
};
