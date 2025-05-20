Vibe Meme Generator

A playful, web-based meme generator built for the In-House Vibe Builders assignment. Create, customize, download, and share memes with a vibrant UI and flexible text placement.
Features

*Choose from three meme templates (Distracted Boyfriend, Drake Hotline Bling, Success Kid).
*Add custom top and bottom text with wrapping for long text.
*Customize text color, outline color, font size (20-50px), and font style.
*Drag and drop top or bottom text anywhere on the canvas for creative placement.
*Set canvas background color for fallback or style.
*Download memes as PNG images.
*Share memes via URL with encoded parameters.
*Responsive, playful design with vibrant colors.

Tech Stack

*Frontend: HTML, CSS, JavaScript
*Library: html2canvas (for image downloads)
*Deployment: Netlify

Setup

Clone the repo:git clone <repo-url>


Navigate to the project folder:cd meme-generator


Run a local server to avoid CORS issues:npx http-server


Open http://localhost:8080 in your browser.

Usage

Select a meme template from the dropdown.
Enter top and bottom text (e.g., "HELLO MAH GIRL!" and "WOOOH WHAT AN ASS!").
Customize text color, outline color, font size, font style, and background color.
Select "Top Text" or "Bottom Text" via radio buttons, then click and drag on the canvas to position the text.
Click "Download Meme" to save as PNG.
Copy the URL to share your meme (parameters, including text positions, are encoded in the URL).

Live Demo
Live URL (Replace with your Netlify URL after deployment)
Folder Structure

index.html: Main HTML file.
styles.css: Styling for the UI.
script.js: Logic for meme generation, drag-and-drop, and sharing.
images/: Folder containing meme template images (distracted_boyfriend.jpg, drake_meme.jpg, success_kid.jpg).

Notes

Images must be public domain or royalty-free (e.g., from Unsplash or meme template sites).
No backend is used; sharing is handled via URL parameters.
Built in ~24 hours to meet the assignment criteria.
Debug logs in script.js help troubleshoot image loading issues.
Drag-and-drop text placement enhances creative control.

