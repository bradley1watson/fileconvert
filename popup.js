document.addEventListener("DOMContentLoaded", function () {
    // Get references to UI elements
    const convertButton = document.getElementById("convert");
    const fileInput = document.getElementById("fileInput");
    const formatSelect = document.getElementById("format");
    const qualityInput = document.getElementById("quality");
    const downloadLink = document.getElementById("download");
    const dropZone = document.getElementById("drop-zone");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Load saved user preferences
    formatSelect.value = localStorage.getItem("format") || "png";

    // Save user preferences when changed
    formatSelect.addEventListener("change", () => {
        localStorage.setItem("format", formatSelect.value);
    });

    // Drag & Drop Support
    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.style.backgroundColor = "#eee"; // Highlight drop area
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.backgroundColor = "white";
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.style.backgroundColor = "white";
        fileInput.files = event.dataTransfer.files; // Assign to file input
    });

    // On click of drop zone, trigger file input click
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle Convert Button Click
    convertButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Ensure the event is triggered by a user action
        if (!event.isTrusted) {
            return; // Ignore programmatic or unintended triggers
        }

        // Get the selected file
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        // Get the selected format and quality
        const format = formatSelect.value;

        // Show loading spinner
        loadingSpinner.style.display = "block";

        // Read the file
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                // Create a canvas to draw the image
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                // Convert the canvas to the selected format
                canvas.toBlob(
                    (blob) => {
                        createDownloadLink(blob, format);
                    },
                    `image/${format}`,
                    quality
                );
            };
        };

        reader.readAsDataURL(file);
    });

    // Function to create and trigger download
    function createDownloadLink(blob, format) {
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `converted.${format}`;
        downloadLink.style.display = "block";
        downloadLink.innerText = "Download Converted Image";

        // Auto-download the file
        downloadLink.click();

        // Hide loading spinner
        loadingSpinner.style.display = "none";
    }
});
