// Per-tool landing-page content (SEO). Authored unique copy per task so the
// pages are not near-duplicates. Rendered by ToolLanding.astro, which also
// derives the JSON-LD (WebApplication + BreadcrumbList + FAQPage) from this.
export interface Step { name: string; text: string }
export interface Faq { q: string; a: string }
export interface RelatedLink { href: string; label: string }
export interface ToolContent {
  name: string;
  slug: string;
  wide: boolean; // full-width editor shell vs. a normal centered tool
  title: string;
  description: string;
  h1: string;
  lead: string;
  steps: Step[];
  why: string[];
  privacy: string;
  faqs: Faq[];
  related: RelatedLink[];
}

const REL = {
  merge: { href: '/merge-pdf', label: 'Merge several PDFs into one' },
  split: { href: '/split-pdf', label: 'Split a PDF by page range' },
  rotate: { href: '/rotate-pdf', label: 'Rotate PDF pages' },
  delete: { href: '/delete-pages', label: 'Delete pages from a PDF' },
  extract: { href: '/extract-pages', label: 'Extract pages to a new PDF' },
  images: { href: '/jpg-to-pdf', label: 'Convert JPG / PNG images to PDF' },
  topng: { href: '/pdf-to-jpg', label: 'Convert PDF pages to JPG / PNG' },
  edit: { href: '/edit-pdf', label: 'Open the full PDF editor' },
} satisfies Record<string, RelatedLink>;

export const TOOLS: Record<string, ToolContent> = {
  merge: {
    name: 'Merge PDF',
    slug: '/merge-pdf',
    wide: false,
    title: 'Merge PDF Free — No Upload, In Your Browser | DocLab',
    description:
      'Combine PDF files into one online, free and private. Reorder the files, then download — everything runs in your browser and nothing is ever uploaded. No account, no limits.',
    h1: 'Merge PDF',
    lead: `Merge PDF lets you combine several PDF files into one document, in whatever order you set, without uploading anything. Add your files, arrange them top to bottom, and download the joined PDF — the whole merge runs locally in your browser, so your documents never leave your device.`,
    steps: [
      { name: 'Add your PDFs', text: 'Drop two or more PDF files onto the page or use Choose PDF files; each one is read in your browser and shown with its page count.' },
      { name: 'Set the order', text: "Use the up and down arrows to arrange the files top to bottom — that's the exact order their pages appear in the final document — and remove any you don't want." },
      { name: 'Merge and download', text: 'Click Merge & download and the combined file saves to your device, ready to open or share.' },
    ],
    why: [
      '100% in-browser — files never uploaded',
      'Free with no account or sign-up',
      'No file count, size, or page limits',
      'Reorder files before merging, page counts shown',
      'Works on Windows, Mac, Linux, ChromeOS, and mobile',
      'Open source and verifiable',
    ],
    privacy: `Merging happens entirely inside your own browser tab — there is no upload step and no server that ever receives your PDFs. When you add files, they're read into memory locally, combined by code running on your machine, and handed straight back as a download; nothing is stored or transmitted. A strict Content Security Policy blocks the page from sending your documents anywhere, and because the work is local, the tool keeps running even after you go offline once the page has loaded. The whole site is open source, so anyone can read exactly how it handles your files. For confidential contracts, statements, or records, that means you can merge without uploading and without trusting a third party with your data.`,
    faqs: [
      { q: 'Are my files uploaded when I merge them?', a: 'No. The merge runs entirely in your browser using a local Web Worker, so your PDFs are never sent to a server or stored anywhere — they stay on your device the whole time.' },
      { q: 'Is it free, and do I need an account?', a: "Yes, it's completely free with no account, sign-up, email, or watermark. Just open the page, add your PDFs, and download the merged file." },
      { q: 'Is there a limit on how many files or pages I can merge?', a: "There are no built-in limits on file count, file size, or pages. Very large merges are bounded only by your device's available memory, since all the work happens locally." },
      { q: 'Does it work offline and on Mac or mobile?', a: 'Yes. It runs in any modern browser on Windows, Mac, Linux, ChromeOS, and phones or tablets, and once the page has loaded it continues to work without an internet connection.' },
      { q: "Why won't one of my PDFs merge?", a: "Password-protected or damaged PDFs can't be read and are flagged in the list so they're skipped. Unlock or repair the file first — the free DocLab desktop app handles encrypted and complex documents." },
    ],
    related: [REL.split, REL.rotate, REL.delete, REL.edit],
  },

  split: {
    name: 'Split PDF',
    slug: '/split-pdf',
    wide: false,
    title: 'Split PDF Free — No Upload, In Your Browser | DocLab',
    description:
      'Split a PDF online for free: by page, by custom ranges like 1-3, 4-8, or in fixed chunks. Runs entirely in your browser — nothing is uploaded. No account, no page limits.',
    h1: 'Split PDF',
    lead: `Split a PDF in your browser for free — no upload, no account, no page limits. Carve one document into separate files three ways: each page on its own, by custom page ranges like 1-3, 4-8, 9-, or in fixed chunks of every N pages. One range gives you a single PDF; several come back as a tidy zip.`,
    steps: [
      { name: 'Open your PDF', text: 'Drag a PDF onto the page or click Choose a PDF; it loads instantly and shows the page count without going anywhere.' },
      { name: 'Pick how to split', text: 'Choose each page to its own file, type custom ranges (comma-separated groups such as 1-3, 4-8, 9-), or set a pages-per-file number for even chunks.' },
      { name: 'Split and download', text: 'Hit Split and download — one group saves as a single PDF, several save as a zip of numbered parts, generated right in your browser.' },
    ],
    why: [
      'Three split modes: per page, custom ranges, or every N pages',
      'Open-ended ranges like 8- grab everything to the last page',
      'One range downloads as a single PDF, many as a numbered zip',
      'Files never leave your device — nothing is uploaded',
      'Completely free with no sign-up and no page or file limits',
      'Works on Windows, Mac, Linux, ChromeOS, and mobile browsers',
    ],
    privacy: `Your PDF is split entirely on your own machine. When you drop a file in, it is read into memory and processed by a Web Worker running in your browser — there is no server step and no upload, so the document never travels across the network. Because the work is local, the size of your file is bound only by your device's memory, not an upload cap. The site is open source and ships a strict Content Security Policy that blocks outside connections, so you can verify the claim. Once the split files have downloaded, refresh or close the tab and nothing lingers — no copies are kept anywhere but your own downloads folder.`,
    faqs: [
      { q: 'Is my PDF uploaded to a server when I split it?', a: 'No. The split happens locally in a browser Web Worker — your file is read into memory on your device and never sent anywhere. There is no upload and no server processing.' },
      { q: 'Is it free, and do I need an account?', a: 'Yes, it is completely free with no account, sign-up, or watermark. Split as many PDFs as you like.' },
      { q: 'Are there file-size or page limits?', a: "There are no artificial caps. Since everything runs in your browser, the only real limit is your device's available memory, so very large PDFs depend on your machine rather than a server quota." },
      { q: 'Does it work offline, on Mac, or on my phone?', a: 'It runs in any modern browser on Windows, Mac, Linux, ChromeOS, and mobile, and once the page has loaded it keeps working offline since nothing is uploaded.' },
      { q: 'How do the output files come out, and can it split encrypted PDFs?', a: "A single range saves as one PDF; multiple ranges download as a zip of numbered parts. Password-protected or damaged PDFs can't be read here — use the DocLab desktop app for those." },
    ],
    related: [REL.merge, REL.extract, REL.delete, REL.edit],
  },

  rotate: {
    name: 'Rotate PDF',
    slug: '/rotate-pdf',
    wide: true,
    title: 'Rotate PDF Free — Save Permanently, No Upload | DocLab',
    description:
      'Rotate PDF pages 90° and save the new orientation permanently. Free, private, and entirely in your browser — fix sideways or upside-down scans with nothing uploaded.',
    h1: 'Rotate PDF',
    lead: `Rotate PDF pages 90° left or right and save the new orientation for good — perfect for sideways scans or upside-down pages. DocLab runs entirely in your browser, so your file is never uploaded and there's no account, no watermark, and no page or size limits.`,
    steps: [
      { name: 'Open your PDF', text: 'Drop in or pick the PDF and DocLab shows a thumbnail grid of every page so you can spot which ones are turned the wrong way.' },
      { name: 'Turn the pages you need', text: 'Click a page (or select several) and hit Rotate left or Rotate right; each click spins it 90°, so two clicks flips an upside-down page a full 180°.' },
      { name: 'Check the preview', text: 'Watch each thumbnail update live until every page sits upright, then keep rotating any stragglers until the whole document reads correctly.' },
      { name: 'Download the fixed PDF', text: 'Export and your browser saves a new PDF with the rotation baked in — it opens already upright everywhere, no re-rotating on reopen.' },
    ],
    why: [
      'Free with no sign-up',
      'Rotates left or right in 90° steps (two clicks = 180°)',
      'Rotate one page or several at once',
      'Live thumbnails of every page',
      'Rotation is saved permanently into the file',
      'No watermark, no page or size limits',
    ],
    privacy: `Your PDF stays on your device from start to finish. DocLab opens, rotates, and re-saves the file using code that runs inside your own browser tab, so the bytes are never sent to a server and there is nothing to upload, queue, or delete afterward. The rotation work happens locally in a background worker, which is also why it stays fast on big scans. Because no server touches your document, you can rotate confidential contracts, medical records, or ID scans privately, and once the page has loaded it keeps working with your Wi-Fi off. The tool is open source, so anyone can verify these claims by reading the code.`,
    faqs: [
      { q: 'Is it safe — does my PDF get uploaded?', a: 'No upload happens. Rotation runs locally in your browser, so the file never leaves your computer and isn’t stored on any server.' },
      { q: 'Is it free, and do I need an account?', a: "Yes, it's completely free with no account, no email, and no watermark added to your rotated PDF." },
      { q: 'Are there page or file-size limits?', a: 'There are no imposed page or size caps. Very large scans take longer because everything is processed on your own device, but they still work.' },
      { q: 'Does it work offline, on Mac, or on my phone?', a: 'It works in any modern browser on Windows, Mac, Linux, ChromeOS, and mobile, and keeps working offline once the page has finished loading.' },
      { q: 'Does the rotation actually stick when I reopen the file?', a: 'Yes. The chosen angle is written into the saved PDF, so the page opens upright in any viewer instead of reverting to its original sideways orientation.' },
    ],
    related: [REL.edit, REL.merge, REL.delete, REL.topng],
  },

  delete: {
    name: 'Delete PDF Pages',
    slug: '/delete-pages',
    wide: true,
    title: 'Delete PDF Pages Free — No Upload | DocLab',
    description:
      'Delete pages from a PDF free and in your browser — see every page, remove the ones you don’t need, and download. Nothing is uploaded. No account, no page limits.',
    h1: 'Delete PDF Pages',
    lead: `Delete PDF pages free and entirely in your browser, without uploading the file anywhere. Open a PDF, see every page as a thumbnail, click the ones you don't want, and download the trimmed document in seconds. No account, no install, no page or file-size caps.`,
    steps: [
      { name: 'Open your PDF', text: 'Drag a PDF onto the page or pick it from your device, and DocLab renders every page as a thumbnail you can scroll through.' },
      { name: 'Select pages to remove', text: "Click the pages you want gone — single pages or a whole run — and they're marked for deletion while everything else stays put." },
      { name: 'Delete and download', text: 'Confirm the removal and download a fresh PDF containing only the pages you kept, in their original order.' },
    ],
    why: [
      '100% free, no sign-up or email',
      'No page count or file-size limits',
      'See every page before you delete it',
      'Original page order and quality preserved',
      'Open source, no watermark added',
      'Works on Windows, Mac, Linux, ChromeOS, and mobile',
    ],
    privacy: `Deleting pages here happens entirely on your own device. The moment you open a PDF, it's read straight into your browser's memory and the page-removal work runs in a local Web Worker — your file is never sent to a server, and there's nothing to upload or wait on. That makes it a genuinely private way to trim a confidential contract, medical scan, or bank statement: the bytes never leave the tab. A strict Content-Security-Policy blocks any sneaky network calls, the whole tool keeps working after the page has loaded even with your connection off, and the code is open source so anyone can verify the claim instead of taking our word for it.`,
    faqs: [
      { q: 'Are my files uploaded when I delete pages?', a: 'No. The PDF is processed locally in your browser and never transmitted anywhere — page removal runs in an on-device Web Worker, so even the pages you delete never touch a server.' },
      { q: 'Is it free, and do I need an account?', a: "Yes, it's completely free with no account, email, or trial. Open the page, drop in your PDF, delete pages, and download — no sign-up step at all." },
      { q: 'Is there a limit on pages or file size?', a: "There are no artificial page-count or file-size caps. Because everything runs locally, the practical ceiling is your device's available memory, so very large or image-heavy PDFs simply take a moment longer to render." },
      { q: 'Does it work offline and on a Mac or phone?', a: 'Yes. Once the page has loaded it keeps working with no connection, and it runs in any modern browser on Windows, Mac, Linux, ChromeOS, iPhone, and Android.' },
      { q: 'Will deleting pages change the quality of the ones I keep?', a: 'No. The remaining pages are copied through untouched — same resolution, text, and order — so the only difference in your downloaded file is that the unwanted pages are gone.' },
    ],
    related: [REL.extract, REL.split, REL.rotate, REL.edit],
  },

  extract: {
    name: 'Extract PDF Pages',
    slug: '/extract-pages',
    wide: true,
    title: 'Extract PDF Pages Free — No Upload | DocLab',
    description:
      'Extract pages from a PDF into a new file, free and in your browser. Pick the pages you want and download — your original is untouched and nothing is uploaded.',
    h1: 'Extract PDF Pages',
    lead: `Extract PDF pages online for free, right in your browser, with nothing ever uploaded. Open a PDF, see a thumbnail of every page, tick the ones you want, and pull them into a brand-new file in their original order. Your original document stays untouched, and the file never leaves your device.`,
    steps: [
      { name: 'Open your PDF', text: "Drop in or choose the PDF you want to pull pages from, and DocLab renders a thumbnail of every page so you can see exactly what you're picking." },
      { name: 'Select the pages to keep', text: "Click pages to select them, Shift-click for a range, Ctrl/Cmd-click to add stray ones, or hit All — the selection count shows how many you've chosen." },
      { name: 'Click Extract', text: 'Press Extract and DocLab copies just those pages, in their original order, into a fresh PDF while leaving your source file completely unchanged.' },
      { name: 'Download the new file', text: 'Save the extracted PDF straight to your device — no watermark, no waiting on an upload, no email required.' },
    ],
    why: [
      'Free with no sign-up, no watermark, and no page or file-size caps',
      'See every page as a thumbnail before you choose — no guessing page numbers',
      'Extracted pages keep their original quality, text, and order',
      'Your source PDF is never modified — extraction makes a separate new file',
      'Files stay on your device; nothing is uploaded to a server',
      'Works on Windows, Mac, Linux, ChromeOS, and mobile browsers',
    ],
    privacy: `DocLab extracts your pages entirely inside your own browser — your PDF is opened, read, and rewritten locally, and not a single byte is sent to a server. There is no upload step and no account to create, so nothing is stored or logged on our end. Because the page work runs in a Web Worker on your machine, it keeps functioning even with your Wi-Fi off once the page has loaded, which makes it genuinely private for confidential contracts, medical records, or financial statements. A strict content-security policy blocks any sneaky outbound transfer, and the web tools are open source, so you can read the code and confirm the files never leave your device.`,
    faqs: [
      { q: 'Are my files uploaded anywhere?', a: 'No. Every step — reading your PDF, selecting pages, and building the new file — happens locally in your browser, and your document is never transmitted to any server. After the page loads you can even disconnect from the internet and it still works.' },
      { q: 'Is it free, and do I need an account?', a: "Yes, it's completely free with no account, no email, and no sign-up. You won't hit a trial wall, a watermark, or a paywall after a few uses." },
      { q: 'Is there a limit on file size or how many pages I can extract?', a: "There are no artificial page or file-size limits — you can extract a single page or dozens at once. Because the work runs on your own device, very large PDFs are bounded only by your computer's available memory." },
      { q: 'Does it work on a Mac or on my phone?', a: 'Yes. It runs in any modern browser on Windows, Mac, Linux, ChromeOS, iPhone, and Android. On a phone, tap pages to select them and tap Extract the same way you would on a desktop.' },
      { q: 'Will the extracted pages lose quality or change the original?', a: 'No. The selected pages are copied at full fidelity, so text stays selectable and images stay sharp, and they keep their original order. Your source PDF is left exactly as it was — extraction always produces a separate new file.' },
    ],
    related: [REL.delete, REL.split, REL.merge, REL.edit],
  },

  images: {
    name: 'Images to PDF',
    slug: '/jpg-to-pdf',
    wide: false,
    title: 'Images to PDF (JPG/PNG) Free — No Upload | DocLab',
    description:
      'Convert JPG and PNG images to a single PDF online, free and private. Reorder the pictures, then download — everything runs in your browser and nothing is uploaded.',
    h1: 'Images to PDF',
    lead: `Images to PDF turns your JPG and PNG photos or scans into a single PDF — one image per page, arranged in whatever order you like — and it runs entirely in your browser, so the pictures are never uploaded. It's free, needs no account, and works without sending a single byte to a server.`,
    steps: [
      { name: 'Add your images', text: 'Drag JPG or PNG files onto the page, or click Choose images to pick them from your device.' },
      { name: 'Put them in order', text: 'Each image becomes one page; use the up and down arrows on any thumbnail to reorder, or the ✕ to drop one you don’t want.' },
      { name: 'Create and download', text: 'Click Create PDF & download and the combined PDF downloads straight to your device.' },
    ],
    why: [
      'Free with no sign-up and no limit on how many images you combine',
      'One image per page, kept in exactly the order you arrange',
      'Reorder or remove any photo before converting — no surprises in the output',
      'Accepts both JPG and PNG, from phone shots to flatbed scans',
      'Nothing is uploaded — your images stay on your own machine',
      'Open source, and works on Windows, Mac, Linux, ChromeOS, and mobile',
    ],
    privacy: `Your photos never leave your device. When you drop images here, the page reads them locally and builds the PDF inside your browser using a background Web Worker — there's no upload step, no server that ever sees your pictures, and no copy stored anywhere online. Because all the work happens in the browser, the tool keeps running even if your connection drops, and once the page has loaded you could disconnect entirely and still convert. The code is open source, so anyone can verify there's no hidden upload, and a strict content-security policy blocks the page from quietly phoning home. The finished PDF is created right on your computer and saved directly to your downloads.`,
    faqs: [
      { q: 'Are my images uploaded anywhere?', a: 'No. Every image is read and converted locally in your browser by a Web Worker — there is no server upload and no copy is kept online. Your photos stay on your device the entire time.' },
      { q: 'Is it free, and do I need an account?', a: "Yes, it's completely free with no account, no email, and no watermark. Just add your images and download the PDF." },
      { q: 'Is there a limit on how many images or how large they can be?', a: "There's no fixed cap on the number of images or file size. Since everything runs in your browser, very large or very high-resolution batches are limited only by your device's memory." },
      { q: 'Does it work offline, on a Mac, or on my phone?', a: 'Yes. It runs in any modern browser on Windows, Mac, Linux, ChromeOS, and mobile, and because nothing is uploaded it keeps working even if you go offline after the page loads.' },
      { q: 'What image formats are supported, and how are pages laid out?', a: 'JPG and PNG are supported, and each image becomes its own page in the PDF in the order you arrange them. For other formats like HEIC or TIFF, convert them to JPG or PNG first.' },
    ],
    related: [REL.topng, REL.merge, REL.edit, REL.split],
  },

  topng: {
    name: 'PDF to JPG',
    slug: '/pdf-to-jpg',
    wide: true,
    title: 'PDF to JPG / PNG Free — No Upload | DocLab',
    description:
      'Convert PDF to JPG or PNG images free, right in your browser. Each page becomes an image — multi-page files download as a zip. Nothing is uploaded; no account needed.',
    h1: 'PDF to JPG',
    lead: `Convert PDF to JPG (or PNG) right in your browser — open your PDF, hit To images, and download one picture per page, no uploading and no account. Every page renders locally on your own device, so even confidential documents never leave your computer.`,
    steps: [
      { name: 'Open your PDF', text: 'Drag a PDF onto the editor or click Choose a PDF; every page appears as a thumbnail you can preview.' },
      { name: 'Pick format and resolution', text: 'Click the To images tool, then choose JPG or PNG and a Standard or High resolution for the output.' },
      { name: 'Export and download', text: 'Hit Export images: a single page saves as one image file, and multiple pages download together as a .zip.' },
    ],
    why: [
      'Free with no sign-up, no email, and no page or file-count limits',
      'Choose JPG for small photo-like files or PNG for sharp, lossless text',
      'Two resolutions: Standard for the web, High for print or zooming in',
      'Multi-page PDFs arrive as a tidy zip, named and numbered in page order',
      'Rotate, annotate, or watermark pages first — your edits bake into the images',
      'Open source and works in any modern browser on any OS',
    ],
    privacy: `This converter runs entirely inside your web browser. When you open a PDF, it is read into memory and drawn to images on your own device — there is no server, no upload step, and no copy of your file sitting in someone's cloud. The page enforces a strict content-security policy, so the code cannot quietly ship your document anywhere, and once the page has loaded you can even pull the network cable and the conversion still works. Because the whole tool is open source, anyone can read the code and confirm exactly what it does. That makes it a genuinely private, secure way to turn sensitive contracts, statements, or IDs into JPG or PNG files offline.`,
    faqs: [
      { q: 'Are my files uploaded to a server?', a: 'No. The PDF is opened and rendered to images directly in your browser; nothing is sent to a server, and the tool keeps working even with no internet connection after the page loads.' },
      { q: 'Is it free, and do I need an account?', a: 'Yes, it is completely free with no account, no email, and no watermark on your images. There is nothing to install and no usage cap.' },
      { q: 'Is there a limit on pages or file size?', a: 'There is no fixed page or size limit — the tool processes one page at a time, so very large PDFs simply take a little longer and use more memory on your device.' },
      { q: 'Does it work on Mac, Windows, and mobile?', a: 'Yes. It runs in any modern browser, so Windows, macOS, Linux, ChromeOS, and phones or tablets all work the same way; on mobile the zip just saves to your downloads.' },
      { q: 'Should I choose JPG or PNG, and what does resolution change?', a: 'Pick PNG for crisp text and lossless quality, or JPG for smaller, photo-style files. The resolution setting controls output size — High suits print or zooming, Standard suits the web.' },
    ],
    related: [REL.images, REL.edit, REL.split, REL.merge],
  },

  edit: {
    name: 'Edit PDF',
    slug: '/edit-pdf',
    wide: true,
    title: 'Edit PDF Free — In Your Browser, No Upload | DocLab',
    description:
      'Edit a PDF free in your browser: reorder, rotate, delete, extract and add pages, annotate, sign, number, and watermark — then download. Nothing is uploaded; no account.',
    h1: 'Edit PDF',
    lead: `Edit a PDF in your browser without uploading it: open any file, see every page as a thumbnail, then reorder, rotate, delete, duplicate, and extract pages, annotate, sign, add page numbers or a watermark, and download. It is free, needs no account, and your file never leaves your device.`,
    steps: [
      { name: 'Open your PDF', text: 'Drag a PDF onto the page or click Choose a PDF, and your whole document loads as a thumbnail rail with a large editable page view.' },
      { name: 'Make your edits', text: 'Drag thumbnails to reorder, rotate or delete pages, add pages from other PDFs or images, then draw, highlight, type, sign, number pages, or stamp a watermark.' },
      { name: 'Download or extract', text: 'Click Download PDF to save the edited file, Extract to pull selected pages into a new PDF, or To images to export pages as PNG or JPG.' },
    ],
    why: [
      '100% in your browser, nothing uploaded',
      'Free with no account and no page limits',
      'One page for organizing, annotating, signing, and exporting',
      'Drag-and-drop thumbnails with multi-select',
      'Draw, highlight, add text, shapes, and signatures',
      'Add page numbers, watermarks, or export to images',
    ],
    privacy: `This editor runs entirely on your own machine. When you open a PDF, it is read straight into the browser tab and rendered there; nothing is sent to a server, so there is no upload step, no copy stored online, and no account to sign into. Every change, from reordering pages to baking in signatures and watermarks, happens in local memory, and the finished file is written directly to your downloads. A strict content-security policy blocks outside connections, the page works offline once it has loaded, and the web tools are open source so anyone can verify the behavior. Your document stays private to you from open to download.`,
    faqs: [
      { q: 'Is it safe, and are my files uploaded anywhere?', a: 'Nothing is uploaded. Your PDF is opened, edited, and saved entirely inside your browser tab, so the file and your annotations and signature never reach a server.' },
      { q: 'Is it free, and do I need an account?', a: 'Yes, it is completely free with no account, sign-up, or watermark on your output. There are no usage limits on how many files you edit.' },
      { q: 'Are there file size or page count limits?', a: "There is no fixed limit; editing is bound only by your device's memory since everything runs locally. Very large PDFs simply take a little longer to render thumbnails and build the download." },
      { q: 'Does it work offline, on Mac, and on mobile?', a: 'Yes. Once the page has loaded it works offline, and it runs in any modern browser on Windows, Mac, Linux, ChromeOS, and phones, where you can even draw a signature with your finger.' },
      { q: 'Will it keep everything in my PDF exactly as it was?', a: 'Page edits and annotations are preserved, and signatures, page numbers, and watermarks bake in on download. Tagged accessibility PDFs may lose tags here, and encrypted files must be unlocked first, so for those use the DocLab desktop app.' },
    ],
    related: [REL.merge, REL.split, REL.rotate, REL.topng],
  },
};
