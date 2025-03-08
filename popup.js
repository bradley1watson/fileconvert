document.getElementById('convert').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) return alert("Please select an image.");

    const format = document.getElementById('format').value;
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.getElementById('download');
                downloadLink.href = url;
                downloadLink.download = `converted.${format}`;
                downloadLink.style.display = 'block';
                downloadLink.innerText = 'Download Converted Image';
            }, `image/${format}`);
        };
    };

    reader.readAsDataURL(fileInput);
});
