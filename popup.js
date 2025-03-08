document.addEventListener("DOMContentLoaded", function () {
    // Get references to UI elements
    const convertButton = document.getElementById("convert");
    const fileInput = document.getElementById("fileInput");
    const formatSelect = document.getElementById("format");
    const downloadLink = document.getElementById("download");

    // Add event listener to the button
    convertButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevents any unwanted behavior

        // Get the selected file
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select an image.");
            return;
        }

        // Get the selected format
        const format = formatSelect.value;

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

                // Convert and create a downloadable file
                canvas.toBlob(
                    (blob) => {
                        const url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = `converted.${format}`;
                        downloadLink.style.display = "block";
                        downloadLink.innerText = "Download Converted Image";
                    },
                    `image/${format}`
                );
            };
        };

        reader.readAsDataURL(file);
    });
});
