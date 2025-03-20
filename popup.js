document.addEventListener("DOMContentLoaded", function () {
    // Get references to UI elements
    const convertButton = document.getElementById("convert");
    const fileInput = document.getElementById("fileInput");
    const formatSelect = document.getElementById("format");
    const downloadLink = document.getElementById("download");
    const dropZone = document.getElementById("drop-zone");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Load saved user preferences
    formatSelect.value = localStorage.getItem("format") || "png";

    // Save user preferences when changed
    function handleFormatChange() {
        localStorage.setItem("format", formatSelect.value);
    }
    formatSelect.addEventListener("change", handleFormatChange);

    // Drag & Drop Support
    function handleDragOver(event) {
        event.preventDefault();
        dropZone.style.backgroundColor = "#eee"; // Highlight drop area
    }
    dropZone.addEventListener("dragover", handleDragOver);

    function handleDragLeave() {
        dropZone.style.backgroundColor = "white";
    }
    dropZone.addEventListener("dragleave", handleDragLeave);

    // Add this function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update the handleDrop function
    function handleDrop(event) {
        event.preventDefault();
        dropZone.style.backgroundColor = "white";
        fileInput.files = event.dataTransfer.files;
        updateDropZoneText(fileInput.files[0]);
    }

    // Add new function to update drop zone text
    function updateDropZoneText(file) {
        if (file) {
            const fileSize = formatFileSize(file.size);
            dropZone.innerHTML = `Selected: ${file.name}<br>Size: ${fileSize}`;
        } else {
            dropZone.innerHTML = "Click or drag & image here";
        }
    }

    // Update file input change handler
    fileInput.addEventListener('change', function() {
        updateDropZoneText(this.files[0]);
    });

    // On click of drop zone, trigger file input click
    function handleDropZoneClick() {
        fileInput.click();
    }
    dropZone.addEventListener("click", handleDropZoneClick);

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

        // Get the selected format
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
                    `image/${format}`
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

        // Hide loading spinner
        loadingSpinner.style.display = "none";
    }
});
