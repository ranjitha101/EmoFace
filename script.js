const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const resultText = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Webcam access denied", err));

function capture() {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("image", blob, "frame.jpg");

        resultText.innerText = "🕵️ Detecting emotion...";
        resultText.style.color = "#BB86FC";

        fetch("/detect", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                resultText.innerText = `😀 Detected Emotion: ${data.emotion}`;
                resultText.style.color = "#FFCC00";
            })
            .catch(err => {
                resultText.innerText = "❌ Error detecting emotion!";
                resultText.style.color = "red";
                console.error("Error:", err);
            });
    }, "image/jpeg");
}
