let tokenClient;
let accessToken = null;
let imageUrls = [];
let currentImageIndex = 0;
let intervalId;

const CLIENT_ID = "1067280451430-65sea94t68h5bds6jsagmv052tnvc7nb.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

// Initialize Howler.js sound for ticking
const tickSound = new Howl({
    src: ['tick.mp3'],
    volume: 0.5
});

// Initialize Google API client library
function handleCredentialResponse(response) {
    if (response.credential) {
        accessToken = response.credential;
        document.getElementById("status").textContent = "Signed in!";
        loadDriveApi();
    }
}

function loadDriveApi() {
    gapi.load('client', async () => {
        await gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
        });
        console.log('GAPI client loaded');
    });
}

// Fetch files from the selected Google Drive folder
async function listFilesInFolder(folderId) {
    const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/'`,
        fields: 'files(id, name)',
    });
    return response.result.files.map(file => `https://drive.google.com/uc?id=${file.id}`);
}

document.getElementById("select-folder").addEventListener("click", async () => {
    // Ask user to select a folder
    const folderId = prompt("Enter your Google Drive Folder ID:");
    imageUrls = await listFilesInFolder(folderId);
    document.getElementById("status").textContent = `${imageUrls.length} images loaded`;
});

document.getElementById("start-slideshow").addEventListener("click", () => {
    if (!imageUrls.length) {
        alert("No images loaded. Select a folder first.");
        return;
    }
    if (intervalId) clearInterval(intervalId);

    currentImageIndex = 0;
    document.getElementById("image-container").src = imageUrls[currentImageIndex];
    intervalId = setInterval(() => {
        tickSound.play();  // Play tick sound at each interval
        currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
        document.getElementById("image-container").src = imageUrls[currentImageIndex];
    }, 2000);  // Change image every 2 seconds (adjust as desired)
});
