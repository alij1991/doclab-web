---
layout: ../layouts/Prose.astro
title: "Privacy Policy — DocLab"
description: "What data DocLab collects, why, and how you control it. The web tools run entirely in your browser and upload nothing."
---

# DocLab Privacy Policy

**Effective date:** 2026-05-26
**Last updated:** 2026-06-16

DocLab is a PDF editor available as a desktop app for Windows and macOS and as
free **web tools at doc-lab.net**, built by Ali Javdani Rikhtehgar. This policy
explains what data DocLab collects, why, and how you control it.

The short version: **DocLab is local-first.** The PDFs you open, edit, and save
never leave your device unless you explicitly choose to share them through your
own actions (sending the file via email, uploading to cloud storage, etc.).
DocLab itself does not transmit your documents to any server.

> **The web tools (doc-lab.net)** run 100% in your browser. Files you open there
> are processed on your device and **never uploaded** — there is no server, no
> account, and no analytics on the tools. The sections below about opt-in crash
> reporting and update checks apply to the **desktop app** only.

## 1. What we collect

### Data we collect by default

**Nothing.** Installing and using DocLab does not transmit any data to us or any
third party. No analytics, no telemetry, no usage tracking. The app works fully
offline, and the web tools work entirely in your browser.

### Data we collect with your explicit opt-in (desktop app)

**Anonymous crash reports.** If you opt in via the first-run consent dialog OR
Settings → Diagnostics → "Send anonymous crash reports," the desktop app sends
crash events to a crash-reporting service operated by the Author (powered by
Sentry, an open-source error-tracking SDK). Each event contains:

- The error message and stack trace
- The DocLab version and build number
- The operating system family (Windows / macOS / Linux)
- The DocLab feature area where the error occurred (e.g. "save_with_redactions," "open_document")

Each event **explicitly does NOT contain**:

- The contents of any PDF you have open or have opened
- File names of PDFs you have opened
- File paths (including your username, which can appear in Windows paths like `C:\Users\<you>\...`)
- Your IP address (we set `sendDefaultPii=false` and scrub `server_name` before transmission)
- Your email, real name, or any other personally identifying information
- Screenshots, view hierarchy, or UI state
- Any data from documents you have NOT opened

**You can opt out at any time** in Settings → Diagnostics. Opting out stops new
events from being sent; previously-sent events are not retroactively deleted (see §3 for retention).

### Data the app processes locally (never transmitted)

- The contents of PDFs you open, edit, save, annotate, redact, compress, or OCR
- Your preferences (theme, default tool colors, sidebar widths, recent-files list, etc.) — stored via the platform's standard local preferences API
- Optional Sentry consent flag (true / false / unset, stored locally)

None of this is transmitted to us.

## 2. Third-party services (desktop app)

| Service | Purpose | Trigger | Data shared |
|---------|---------|---------|-------------|
| **Sentry** (sentry.io) | Crash reporting | Only when user opts in | Error + stack + app version + OS family (see §1) |
| **GitHub Releases API** | "Check for Updates" version comparison | Manual: Help → Check for Updates | Only the HTTP GET to `api.github.com/.../releases/latest` with a `DocLab-UpdateCheck/<version>` User-Agent. No user identifier. (Removed on the Mac App Store build per Apple policy.) |

Both services are governed by their own policies — Sentry: <https://sentry.io/privacy/> · GitHub: <https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement>

The **web tools at doc-lab.net** use **no** third-party services and make no network calls with your files.

## 3. Data retention

**Locally-stored data** lives on your device for as long as DocLab is installed.
Uninstalling removes the app's preferences; your PDF files are unaffected.

**Opt-in crash reports** sent to Sentry are retained per Sentry's standard policy
(90 days for free-tier accounts at time of writing), after which the events are
deleted. To request earlier deletion, contact us (§9) with identifying context
(e.g. an event ID from the in-app log viewer).

## 4. Your rights

You can:

- **Stop crash reporting** anytime: Settings → Diagnostics → toggle off
- **View the local log** (`Ctrl+Shift+L`): every event the app logged, verifying no PDF content or PII is included before transmission
- **Export your preferences** to JSON: Settings → Diagnostics → Export settings
- **Uninstall** to remove all locally-stored data tied to the app

EU (GDPR) and California (CCPA) residents additionally have the **right of access**,
**right of erasure** (contact us; removed from Sentry within 30 days of
verification), and **right of portability**. DocLab does NOT sell, rent, or share
user data for advertising or marketing.

## 5. Children's privacy

DocLab is not directed at children under 13 (US) or 16 (EU). We do not knowingly
collect any data from children.

## 6. Security

Locally-stored preferences use the platform's standard storage APIs. PDF files
are stored wherever you save them — DocLab does not encrypt or relocate them.
Crash reports in transit to Sentry use TLS 1.2+. The web tools serve over HTTPS
with a strict Content-Security-Policy and make no calls with your file data.

## 7. International transfers

If you opt into desktop crash reporting, events are sent to Sentry's servers
(which may be in the US or elsewhere). By opting in, you consent to this
transfer. If you do not opt in, no cross-border transfers occur. The web tools
transfer nothing.

## 8. Changes to this policy

We may update this policy from time to time. The "Last updated" date reflects the
most recent change. Significant changes are announced via an in-app notice on
first launch after the update and a bumped policy URL on the store listings.

## 9. Contact

For privacy questions, opt-out requests, or data-deletion requests:

- **GitHub Issues** (preferred): <https://github.com/alij1991/doclab-website/issues> — mark privacy issues with the `privacy` label.
- Microsoft Store / Mac App Store listing support links

Response goal: within 30 days for GDPR/CCPA requests; within 72 hours for security issues.

## 10. Jurisdiction

DocLab is developed in the Province of British Columbia, Canada. Disputes about
this policy are governed by British Columbia law. Users in other jurisdictions
retain rights granted by their local privacy laws (GDPR, CCPA, PIPEDA, etc.),
which take precedence where applicable.
