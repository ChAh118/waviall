# DRAPE — Cloth Store Setup Guide

## Files Included
- `index.html` — The complete single-page storefront
- `google-apps-script.js` — The backend script that saves orders to Google Sheets

---

## Step 1: Create Your Google Sheet

1. Go to https://sheets.google.com
2. Create a **New Spreadsheet**
3. Name it: `DRAPE Orders`
4. Copy the **Spreadsheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy just the long ID part

---

## Step 2: Set Up Google Apps Script

1. Go to https://script.google.com
2. Click **New Project**
3. Name it: `DRAPE Order Handler`
4. Delete all default code
5. Paste the entire contents of `google-apps-script.js`
6. On **line 16**, replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
7. Click **Save** (Ctrl+S)

---

## Step 3: Deploy as Web App

1. Click **Deploy** (top right) → **New Deployment**
2. Click the gear icon ⚙ → Select **Web app**
3. Set:
   - **Description**: DRAPE Order API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** → Allow permissions
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/XXXX/exec`)

---

## Step 4: Connect to Your Website

1. Open `index.html` in a text editor
2. Find line near the top with `GOOGLE_SCRIPT_URL`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied
4. Save the file

---

## Step 5: Test It

1. Open `index.html` in your browser
2. Add a product to cart
3. Fill in the checkout form
4. Click "Place Order"
5. Check your Google Sheet — a new row should appear!

You can also test from the Apps Script editor:
- Open the script → Select function `testDoPost` → Click Run ▶

---

## What Gets Saved to Google Sheets

Each order item becomes one row with these columns:

| Column | Example |
|--------|---------|
| Timestamp | 11/05/2025, 3:22 PM |
| Order Ref | DRP-M8K2A1 |
| First Name | Ahmed |
| Last Name | Khan |
| Phone | +92 300 1234567 |
| Email | ahmed@example.com |
| Delivery Address | House 5, Street 2... |
| City | Lahore |
| Payment Method | Cash on Delivery |
| Notes | Call before delivery |
| Product Name | Linen Overshirt |
| Category | Men's Shirts |
| Size | M |
| Quantity | 2 |
| Unit Price | 3200 |
| Line Total | 6400 |
| Order Total | 6400 |

If a customer orders 3 items, 3 rows are added — all sharing the same Order Ref.

---

## Customizing Products

In `index.html`, find the `PRODUCTS` array and edit or add items:

```js
{
  id: 7,                          // unique number
  name: 'My New Shirt',
  category: 'Men\'s Shirts',
  emoji: '👔',                    // product icon
  price: 2500,                    // price in Rs.
  originalPrice: 3000,            // null if no sale price
  badge: 'New',                   // null, 'New', 'Sale', 'Bestseller'
  desc: 'Product description here.',
  sizes: ['S','M','L','XL'],
  outOfStock: ['XL']              // sizes to mark as unavailable
}
```

---

## Hosting Options

- **Free**: Upload `index.html` to GitHub Pages or Netlify Drop
- **Easy**: Open directly in any browser (file://...)
- **Paid**: Any web hosting, cPanel, etc.

The Google Sheets integration works from any origin.
