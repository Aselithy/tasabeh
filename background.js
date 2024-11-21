// Initialize and start the scheduled notifications
function startScheduledNotifications() {
    chrome.storage.local.get(['messages', 'interval'], (data) => {
        const messages = data.messages || [];
        const intervalMinutes = data.interval || 1;

        if (messages.length === 0) {
            console.warn("No messages found in storage to display.");
            return;
        }

        // Set up the alarm based on the interval
        chrome.alarms.clearAll();
        chrome.alarms.create('showMessage', { periodInMinutes: intervalMinutes });

        // Reset the current message index
        chrome.storage.local.set({ currentMessageIndex: 0 });
    });
}

// Show notification for the current message
function showNotification() {
    chrome.storage.local.get(['messages', 'currentMessageIndex'], (data) => {
        const messages = data.messages || [];
        let currentIndex = data.currentMessageIndex || 0;

        if (messages.length > 0) {
            // Display the message at the current index
            const message = messages[currentIndex];

            chrome.storage.local.set({ currentMessage: message }, () => {
                chrome.windows.create({
                    url: "notification.html",
                    type: "popup",
                    width: 600,
                    height: 600
                });
            });

            // Move to the next message index, cycling back to 0 if at the end
            currentIndex = (currentIndex + 1) % messages.length;
            chrome.storage.local.set({ currentMessageIndex: currentIndex });
        }
    });
}

// Trigger the notification when the alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "showMessage") {
        showNotification();
    }

});

// Listen for start schedule message from the popup
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'startSchedule') {
        startScheduledNotifications();
    }
});
