importScripts("heic2any.js");

self.onmessage = async function (e) {
    try {
        const convertedBlob = await heic2any({ blob: e.data, toType: "image/png" });
        self.postMessage(convertedBlob);
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
