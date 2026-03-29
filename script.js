const reader = new Html5Qrcode("camera");

const btn = document.getElementById("btn");
const mapContainer = document.getElementById("mapContainer");
const marker = document.getElementById("marker");
const camera = document.getElementById("camera");

const nameEl = document.getElementById("name");
const statusEl = document.getElementById("status");
const priceEl = document.getElementById("price");

let scannerOn = false;

btn.addEventListener("click", toggleScanner);

function toggleScanner() {
    scannerOn = !scannerOn;

    if (scannerOn) {
        startScanner();
        mapContainer.style.display = "none";
        camera.style.display = "block";
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        mapContainer.style.display = "block";
        camera.style.display = "none";
        btn.innerText = "SCAN";
    }
}

function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
        onScanSuccess
    ).catch(console.error);
}

function stopScanner() {
    if (reader.isScanning) {
        reader.stop().catch(console.error);
    }
}

function onScanSuccess(text) {
    let item;

    try {
        item = JSON.parse(text);
    } catch (e) {
        console.error("Invalid QR:", text);
        return;
    }

    // Show marker if coordinates exist
    if (typeof item.top === "number" && typeof item.left === "number") {
        showMarkerAt(item.top, item.left);
    }

    // Inventory info
    nameEl.innerText = "Name: " + item.name;
    statusEl.innerText = "In store: " + (item.in_store ? "Yes" : "No");
    priceEl.innerText = "Price: €" + item.price;

    stopScanner();
    scannerOn = false;

    mapContainer.style.display = "block";
    camera.style.display = "none";
    btn.innerText = "SCAN";
}

function showMarkerAt(top, left) {
    marker.style.top = top + "%";
    marker.style.left = left + "%";
}