// ─────────────────────────────────────────────────────────────────────────────
// DRAPE — Google Apps Script for Order Collection
// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com and create a New Project
// 2. Paste this entire file into the editor (replace default content)
// 3. Click "Deploy" → "New deployment" → Type: "Web app"
// 4. Set "Execute as" = Me, "Who has access" = Anyone
// 5. Click Deploy → Authorize → Copy the Web App URL
// 6. In index.html, replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE with that URL
// 7. Also create a Google Sheet and paste its ID below
// ─────────────────────────────────────────────────────────────────────────────

// 👇 Paste your Google Spreadsheet ID here (from the URL: .../d/SPREADSHEET_ID/edit)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Sheet tab names — these will be auto-created if they don't exist
const ORDERS_SHEET  = 'Orders';
const SUMMARY_SHEET = 'Order Summary';

// ─── COLUMN HEADERS ──────────────────────────────────────────────────────────
const HEADERS = [
  'Timestamp',
  'Order Ref',
  'First Name',
  'Last Name',
  'Phone / WhatsApp',
  'Email',
  'Delivery Address',
  'City',
  'Payment Method',
  'Notes',
  'Product Name',
  'Category',
  'Size',
  'Quantity',
  'Unit Price (Rs.)',
  'Line Total (Rs.)',
  'Order Total (Rs.)',
];

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const rows = payload.rows;

    if (!rows || rows.length === 0) {
      return jsonResponse({ result: 'error', error: 'No rows provided' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet(ss, ORDERS_SHEET);

    // Write header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#1A1714');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // Append each item as a row
    rows.forEach(row => {
      sheet.appendRow([
        row.timestamp,
        row.orderRef,
        row.firstName,
        row.lastName,
        row.phone,
        row.email,
        row.address,
        row.city,
        row.payment,
        row.notes,
        row.productName,
        row.category,
        row.size,
        row.quantity,
        row.unitPrice,
        row.lineTotal,
        row.orderTotal,
      ]);
    });

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    // Optional: highlight new rows
    const lastRow = sheet.getLastRow();
    const newRows = sheet.getRange(lastRow - rows.length + 1, 1, rows.length, HEADERS.length);
    newRows.setBackground('#FAF8F4');

    // Alternate row coloring for readability
    reapplyRowColors(sheet);

    return jsonResponse({ result: 'success', orderRef: rows[0].orderRef, rowsAdded: rows.length });

  } catch (err) {
    return jsonResponse({ result: 'error', error: err.toString() });
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function reapplyRowColors(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  for (let r = 2; r <= lastRow; r++) {
    const color = r % 2 === 0 ? '#FFFFFF' : '#F5F3EF';
    sheet.getRange(r, 1, 1, HEADERS.length).setBackground(color);
  }
}

// ─── TEST FUNCTION (run manually from Apps Script editor) ────────────────────
function testDoPost() {
  const mockPayload = {
    rows: [{
      timestamp: new Date().toLocaleString(),
      orderRef: 'DRP-TEST001',
      firstName: 'Ahmed',
      lastName: 'Khan',
      phone: '+92 300 1234567',
      email: 'ahmed@example.com',
      address: 'House 12, Street 5, Gulberg',
      city: 'Lahore',
      payment: 'Cash on Delivery',
      notes: 'Please call before delivery',
      productName: 'Linen Overshirt',
      category: "Men's Shirts",
      size: 'M',
      quantity: 2,
      unitPrice: 3200,
      lineTotal: 6400,
      orderTotal: 6400,
    }]
  };

  const result = doPost({ postData: { contents: JSON.stringify(mockPayload) } });
  Logger.log(result.getContent());
}
