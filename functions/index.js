const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");
const cheerio = require("cheerio");

initializeApp();
const db = getFirestore();

exports.scrapeMetadata = onDocumentCreated("users/{userId}/bookmarks/{bookmarkId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;

    const data = snapshot.data();
    const url = data.url;

    if (!url) return null;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });

        const $ = cheerio.load(response.data);
        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || "";
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content') || "";
        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || "";

        if (favicon && !favicon.startsWith('http')) {
            const baseUrl = new URL(url);
            favicon = new URL(favicon, baseUrl.origin).href;
        } else if (!favicon) {
            try {
                const baseUrl = new URL(url);
                favicon = `${baseUrl.origin}/favicon.ico`;
            } catch (e) {
                favicon = "";
            }
        }

        const updateData = {
            description: description.trim(),
            favicon: favicon,
            metadataScrapedAt: new Date().toISOString()
        };

        if (!data.title) {
            updateData.title = title.trim();
        }

        return snapshot.ref.update(updateData);
    } catch (error) {
        console.error(`Error scraping metadata for ${url}:`, error.message);
        return snapshot.ref.update({
            scrapingError: error.message,
            metadataScrapedAt: new Date().toISOString()
        });
    }
});
