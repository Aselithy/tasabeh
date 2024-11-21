// Retrieve the message from storage and display it
chrome.storage.local.get("currentMessage", (data) => {
    const messageElement = document.getElementById("message");
    if (data.currentMessage) {
        messageElement.textContent = data.currentMessage;
    } else {
        messageElement.textContent = "No message found.";
    }
});

// Ensure close button works properly
document.querySelector(".close-button").addEventListener("click", () => {
    window.close();
});
