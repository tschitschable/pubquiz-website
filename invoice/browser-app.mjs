import { SwissQRBill } from "swissqrbill/svg";
import {
  calculateSCORReferenceChecksum,
  formatIBAN,
  formatSCORReference,
} from "swissqrbill/utils";

import { CREDITOR } from "./creditor.mjs";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatChDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function buildScorReference(invoiceNumber) {
  const body = String(invoiceNumber || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 21);
  if (!body) throw new Error("Rechnungsnummer fehlt");
  return `RF${calculateSCORReferenceChecksum(body)}${body}`;
}

function readForm(form) {
  const fd = new FormData(form);
  const invoiceDate = fd.get("invoiceDate") || new Date().toISOString().slice(0, 10);
  const paymentDays = Number(fd.get("paymentDays") || CREDITOR.defaultPaymentDays);
  const dueDate = addDays(invoiceDate, paymentDays);
  const invoiceNumber =
    String(fd.get("invoiceNumber") || "").trim() ||
    invoiceDate.replace(/-/g, "");
  const amount = Number(fd.get("amount"));
  const description = String(fd.get("description") || "").trim();
  const debtor = {
    name: String(fd.get("debtorName") || "").trim(),
    address: String(fd.get("debtorAddress") || "").trim(),
    buildingNumber: String(fd.get("debtorBuilding") || "").trim(),
    zip: String(fd.get("debtorZip") || "").trim(),
    city: String(fd.get("debtorCity") || "").trim(),
    country: String(fd.get("debtorCountry") || "CH").trim().toUpperCase(),
  };

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Betrag ungültig");
  }
  if (!debtor.name || !debtor.address || !debtor.zip || !debtor.city) {
    throw new Error("Debitor-Adresse unvollständig");
  }
  if (!description) {
    throw new Error("Leistungsbeschreibung fehlt");
  }

  const reference = buildScorReference(invoiceNumber.replace(/^PQ-/, ""));
  const message = `${description}. Zahlbar bis ${formatChDate(dueDate)}.`.slice(
    0,
    140
  );

  return {
    invoiceNumber,
    invoiceDate: new Date(invoiceDate),
    dueDate,
    paymentDays,
    amount,
    currency: "CHF",
    description,
    message,
    reference,
    debtor,
  };
}

function renderPreview(invoice) {
  const preview = document.getElementById("invoice-preview");
  const qrMount = document.getElementById("qr-mount");
  const vatLine = CREDITOR.vatUid
    ? `MWST-Nr. / UID: ${CREDITOR.vatUid}`
    : CREDITOR.vatNote;

  preview.innerHTML = `
    <div class="invoice-sheet">
      <div class="invoice-doc">
        <div class="invoice-top">
          <div class="issuer">
            <div class="brand">${escapeHtml(CREDITOR.tradeName)}</div>
            <div>${escapeHtml(CREDITOR.legalName)}</div>
            <div>${escapeHtml(`${CREDITOR.address} ${CREDITOR.buildingNumber}`)}</div>
            <div>${escapeHtml(`${CREDITOR.zip} ${CREDITOR.city}`)}</div>
            <div>${escapeHtml(CREDITOR.email)}</div>
            <div>IBAN ${escapeHtml(formatIBAN(CREDITOR.iban))}</div>
          </div>
          <div class="meta">
            <div class="doc-title">Rechnung</div>
            <div>Rechnungsnummer: ${escapeHtml(invoice.invoiceNumber)}</div>
            <div>Rechnungsdatum: ${escapeHtml(formatChDate(invoice.invoiceDate))}</div>
            <div>Fällig bis: ${escapeHtml(formatChDate(invoice.dueDate))}</div>
            <div>Referenz: ${escapeHtml(formatSCORReference(invoice.reference))}</div>
          </div>
        </div>

        <div class="debtor-block">
          <div class="label">Rechnungsempfänger</div>
          <div>${escapeHtml(invoice.debtor.name)}</div>
          <div>${escapeHtml(`${invoice.debtor.address}${invoice.debtor.buildingNumber ? ` ${invoice.debtor.buildingNumber}` : ""}`)}</div>
          <div>${escapeHtml(`${invoice.debtor.zip} ${invoice.debtor.city}`)}</div>
        </div>

        <p class="intro">Vielen Dank für Ihren Auftrag. Bitte überweisen Sie den Rechnungsbetrag mit der QR-Rechnung unten.</p>

        <table class="lines">
          <thead>
            <tr>
              <th>Beschreibung</th>
              <th class="num">Menge</th>
              <th class="num">Betrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escapeHtml(invoice.description)}</td>
              <td class="num">1</td>
              <td class="num">${escapeHtml(invoice.currency)} ${invoice.amount.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td colspan="2" class="num">Total</td>
              <td class="num">${escapeHtml(invoice.currency)} ${invoice.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <p class="terms">Zahlungsfrist: ${invoice.paymentDays} Tage (bis ${escapeHtml(formatChDate(invoice.dueDate))}).</p>
        <p class="vat">${escapeHtml(vatLine || "")}</p>
        <p class="fineprint">Aussteller: ${escapeHtml(CREDITOR.tradeName)} · ${escapeHtml(CREDITOR.legalName)} · ${escapeHtml(`${CREDITOR.address} ${CREDITOR.buildingNumber}, ${CREDITOR.zip} ${CREDITOR.city}`)} · ${escapeHtml(CREDITOR.email)}</p>
      </div>
      <div class="qr-slot" id="qr-slot"></div>
    </div>
  `;

  const data = {
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

  const bill = new SwissQRBill(data, { language: "DE" });
  const slot = preview.querySelector("#qr-slot");
  slot.appendChild(bill.element);

  // Keep a mirror mount for debugging / accessibility
  qrMount.replaceChildren(bill.element.cloneNode(true));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setStatus(message, isError) {
  const el = document.getElementById("status");
  el.textContent = message || "";
  el.classList.toggle("error", Boolean(isError));
}

function fillSample() {
  const form = document.getElementById("invoice-form");
  form.invoiceNumber.value = "20261111";
  form.invoiceDate.value = "2026-11-14";
  form.paymentDays.value = "30";
  form.amount.value = "100.00";
  form.description.value =
    "Durchführung des Pub Quizzes im Eiger vom 11.11.2026";
  form.debtorName.value = "KG Gastrokultur GmbH";
  form.debtorAddress.value = "Könzistrasse";
  form.debtorBuilding.value = "151";
  form.debtorZip.value = "3097";
  form.debtorCity.value = "Liebefeld";
  form.debtorCountry.value = "CH";
}

function init() {
  const form = document.getElementById("invoice-form");
  const today = new Date();
  form.invoiceDate.value = today.toISOString().slice(0, 10);
  form.paymentDays.value = String(CREDITOR.defaultPaymentDays);
  form.invoiceNumber.value = `${today.getFullYear()}${pad2(today.getMonth() + 1)}${pad2(today.getDate())}`;

  document.getElementById("btn-sample").addEventListener("click", () => {
    fillSample();
    setStatus("Beispiel geladen – jetzt Vorschau erzeugen.");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const invoice = readForm(form);
      renderPreview(invoice);
      document.getElementById("preview-wrap").hidden = false;
      setStatus(
        `Vorschau bereit · Referenz ${formatSCORReference(invoice.reference)}. Zum PDF: Drucken → Als PDF speichern.`
      );
    } catch (err) {
      setStatus(err.message || String(err), true);
    }
  });

  document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
  });
}

init();
