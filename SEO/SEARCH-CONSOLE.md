# Verify taxilytics.vercel.app in Google Search Console & Submit sitemap

Steps to verify and submit sitemap:

1. Open Google Search Console: https://search.google.com/search-console
2. Sign in with the Google account that will manage the site.
3. Click "Add property" and choose **URL prefix** (recommended for Vercel deployments).
4. Enter your site URL exactly: `https://taxilytics.vercel.app/` and click "Continue".
5. Verification options:
   - Use the HTML file upload method: download the verification file and upload it to the root (`https://taxilytics.vercel.app/`). For a static Vercel site you can add the file to the repository root so it is deployed.
   - Or use the **HTML tag** method: copy the provided `<meta name="google-site-verification" content="...">` tag and paste it into the `<head>` of `index.html`, then deploy.
   - Or use the **Domain name provider** method if you manage DNS (requires adding a TXT record at your domain provider).
6. After adding the verification file or meta tag, click "Verify" in Search Console.

Submit sitemap:

1. In Search Console, open your verified property `https://taxilytics.vercel.app/`.
2. On the left menu, click "Sitemaps".
3. In the "Add a new sitemap" field, enter: `sitemap.xml` and click "Submit".
4. Wait a few minutes and then check the sitemap status; Search Console will report indexing status and errors if any.

Notes & tips:
- Ensure `robots.txt` references the sitemap (already added in this repo: `robots.txt` contains `Sitemap: https://taxilytics.vercel.app/sitemap.xml`).
- If you used the meta tag verification method, remove the meta only after verification if you prefer, but keeping it is fine.
- After verification and sitemap submission, monitor "Coverage" and "Performance" in Search Console to track impressions and queries for the keyword "Taxilytics".

If you'd like, I can add the HTML verification meta tag to `index.html` temporarily (if you paste the content string here) or show how to do it and how to verify the property step-by-step while you do the clicks.