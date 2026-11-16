# Swiss QR invoices (Pub Quiz Bern)

Generates a complete business invoice plus a compliant Swiss QR-bill payment part
(`Empfangsschein` + `Zahlteil`) for Pub Quiz Bern.

## What was wrong with the old sample

The previous PDF (`QR_Rechnung_20261111`) was essentially a PostFinance payment
slip with almost no invoice body:

- No invoice number
- No service line items / total block
- Sparse creditor details on the document part (no street, no contact, no legal name)
- No VAT / tax-status statement
- Debtor **name** in the QR payload incorrectly contained `3097 Liebefeld`

The QR payload IBAN + SCOR reference themselves were valid; the document did not
look or read like an official business invoice.

## Creditor data used (from existing product data)

From the sample bill + `impressum.html`:

- Trade name: Pub Quiz Bern
- Legal name: Jannis Valaulta
- Address: Kyburgstrasse 5, 3013 Bern
- Email: pubquizbern@gmail.com
- IBAN: `CH60 0900 0000 1693 9006 9` (regular IBAN → SCOR / `RF…` references)

**Not present in the repo:** a Swiss UID / MWST number. Until you add a real one
in `creditor.mjs` (`vatUid`), invoices print `Nicht MWST-pflichtig / no VAT charged.`

## Generate a PDF (recommended)

```bash
cd invoice
npm install
node generate.mjs --data examples/sample-invoice.json --out output/QR_Rechnung_20261111.pdf
```

Or open `invoice/index.html` (after `npm run build`) for a browser preview and
“Print → Save as PDF”.

## JSON fields

See `examples/sample-invoice.json`:

- `invoiceNumber`, `invoiceDate`, `amount`, `description`
- `debtor`: `name`, `address`, `buildingNumber`, `zip`, `city`, `country`
