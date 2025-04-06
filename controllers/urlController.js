const {nanoid} = require('nanoid');
const URL = require("../models/Url");

const normalizeUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url; // Default to HTTPS
    }
    return url;
};

exports.createShortUrl = async (req, res) => {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: "url is required!" });

        const shortId = nanoid(8);
        await URL.create({
            shortId: shortId,
            redirectUrl: normalizeUrl(body.url), // Ensure the URL has a protocol
            visitHistory: []
        });

        return res.json({ id: shortId });
    } catch (error) {
        console.log("Redirect Error:", error);
        res.status(500).json({ error: "Internal Server error!" });
    }
};


exports.getOgUrl = async (req, res) => {
    try {
        console.log("Searching for:", req.params.shortId);
        const ogUrl = await URL.findOne({
            shortId: req.params.shortId,
        });

        if (!ogUrl) {
            console.log("ShortUrl not found!");
            return res.status(404).json({ error: "ShortUrl not found" });
        }

        console.log("Found URL:", ogUrl.redirectUrl);

        await URL.updateOne(
            { shortId: req.params.shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
        );

        // Ensure the redirect URL has a proper scheme
        let finalRedirect = normalizeUrl(ogUrl.redirectUrl);
        // if (!finalRedirect.startsWith("http://") && !finalRedirect.startsWith("https://")) {
        //     finalRedirect = "https://" + finalRedirect;
        // }

        // finalRedirect = normalizeUrl(finalRedirect);

        console.log("Redirecting to:", finalRedirect);
        return res.redirect(finalRedirect);
    } catch (error) {
        console.error("Error in getOgUrl:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};


