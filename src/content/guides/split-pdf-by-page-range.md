---
title: "How to Split a PDF by Page Range for Free"
description: "Split a PDF by page range for free, right in your browser. Extract chapters, separate invoices, or break a file into parts — no upload, no sign-up, fully private."
tool: "/split-pdf"
toolLabel: "Open the Split PDF tool"
readMins: 5
pubDate: 2026-06-17
---
Splitting a PDF means taking one file and breaking it into smaller, separate PDFs — by page, by a custom range like 1-3, or into even chunks. This guide shows how to do it for free in your browser, with nothing uploaded to a server.

If you've ever needed to pull a single chapter out of a long report, or separate a stack of scanned invoices into individual files, that's exactly what splitting solves. The DocLab [Split PDF tool](/split-pdf) does all three common kinds of split, and the file never leaves your computer.

## The three ways to split

DocLab gives you three modes. Pick whichever matches what you're trying to get out.

### 1. Each page becomes its own file

This is the simplest option: a 10-page PDF turns into 10 separate one-page PDFs. It's handy when every page is its own document — think a batch of scanned receipts, certificates, or single-page forms that got merged together by accident.

### 2. Custom ranges (like 1-3, 4-8, 9-)

This is the most flexible mode and the one most people searching for "split by page range" actually want. You type the ranges you want, separated by commas, and **each comma-separated group becomes one PDF file.**

- `1-3, 4-8` produces two files: one with pages 1 through 3, another with pages 4 through 8.
- `9-` is open-ended — it means "page 9 to the end of the document." Great when you don't want to count to the last page.
- A single number like `5` is allowed too, and it becomes its own one-page file.

So `1-3, 4-8, 9-` gives you three files in one go. Pages are counted starting at 1, just like you'd read them.

### 3. Every N pages

Tell DocLab how many pages go in each file, and it chops the document into even chunks. Enter `2` and a 10-page PDF becomes five 2-page files. If the total doesn't divide evenly, the last file just holds whatever's left. This is ideal for splitting a long double-sided scan into front/back pairs, or breaking a big document into uniform sections.

## How the output comes back: one PDF or a zip

This part trips people up, so here's the simple rule:

- **If your split produces one file, you get a single PDF** named like `yourfile-split.pdf`.
- **If your split produces several files, you get a single .zip download** named `yourfile-split.zip`, with the individual PDFs inside named `yourfile-part-01.pdf`, `yourfile-part-02.pdf`, and so on.

The zip keeps your downloads tidy — instead of your browser firing off ten separate save prompts, you get one file to unzip. Every operating system (Windows, macOS, ChromeOS, most phones) can open a .zip without extra software: just double-click or tap "Extract."

## Step-by-step

1. Go to the [Split PDF tool](/split-pdf).
2. Drag your PDF onto the drop zone, or click **Choose a PDF** and pick it. DocLab reads it instantly and shows the page count.
3. Under **How to split**, choose one of the three modes: *Each page → its own file*, *Custom ranges*, or *Every N pages*.
4. If you picked **Custom ranges**, type your ranges in the box — for example `1-3, 4-8, 9-`. If you picked **Every N pages**, enter how many pages per file.
5. Click **Split & download**. Your file (a single PDF or a zip) downloads automatically.
6. Want a clean slate? Click **Start over** or the ✕ to load a different PDF.

A couple of things worth knowing: if your PDF is **encrypted or damaged**, the tool will tell you it can't read it. And if your PDF is **tagged for accessibility**, DocLab warns you that splitting in the browser may drop those tags — for accessibility-preserving edits, the free DocLab desktop app is the better choice.

## Two quick examples

**Extract a chapter.** Say Chapter 3 of a report runs from page 24 to page 41. Choose *Custom ranges*, type `24-41`, and split. Because that's a single group, you get one PDF — `report-split.pdf` — containing just that chapter.

**Separate an invoice batch.** You scanned 12 invoices into one PDF and each invoice is two pages. Choose *Every N pages*, enter `2`, and split. You'll get a zip containing six 2-page PDFs, one per invoice, ready to file or email individually.

## Is it private?

Yes. This is the real difference between DocLab and most "free PDF splitter" sites.

Your PDF is opened and split **entirely inside your own browser**. There's no upload, no server processing your file, and no account to create. The work happens in a background worker on your machine — your document's bytes never travel across the internet, so there's nothing for anyone (including us) to see, store, or leak. The web tools are open source, so you don't have to take that on faith.

In practice that means you can safely split contracts, medical records, tax documents, or anything confidential without it ever leaving your device. When the download finishes, the job is done and nothing lingers on a remote server.

## FAQ

### What's the difference between splitting and extracting pages?

Splitting breaks one PDF into *multiple* output files based on ranges or chunks. If you only want to pull out a handful of pages into a *single* new PDF — say pages 2, 5, and 9 — the [Extract Pages tool](/extract-pages) is the more direct fit. And if your goal is to *remove* unwanted pages and keep the rest as one file, use [Delete Pages](/delete-pages) instead.

### Will splitting reduce the quality of my pages?

No. Splitting copies your existing pages into new files as-is — text stays selectable, images keep their resolution, and nothing is re-rendered or re-compressed. The pages in your output are the same pages from your original.

### Do I need to install anything or sign up?

No. The Split PDF tool runs in any modern browser with no install and no account. (If you later need OCR, true redaction, or text editing, those live in the free DocLab desktop app — but plain splitting needs nothing beyond your browser.)

### Can I split a password-protected PDF?

Not directly — DocLab can't read encrypted files, so you'd need to remove the password first (you can do that in a viewer that has the password, then save an unlocked copy). After that, splitting works normally.

---

Ready to break that file down? [Open the Split PDF tool](/split-pdf) and split your first PDF in a few clicks — free, private, and right in your browser.
