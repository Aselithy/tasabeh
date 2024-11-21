document.addEventListener('DOMContentLoaded', () => {
    // Load stored messages and interval into the input fields
    chrome.storage.local.get(['messages', 'interval'], (data) => {
        if (data.messages) {
            data.messages.forEach((msg, index) => {
                const input = document.getElementById(`msg${index + 1}`);
                if (input) input.value = msg;
            });
        }
        if (data.interval) {
            document.getElementById('interval').value = data.interval;
        }
    });

    // Set up the click listener for the "Start Schedule" button
    document.getElementById('startButton').addEventListener('click', () => {
        const messages = [];
        for (let i = 1; i <= 6; i++) {
            const message = document.getElementById(`msg${i}`).value;
            if (message) messages.push(message);
        }

        const interval = parseFloat(document.getElementById('interval').value);

        if (messages.length === 0 || isNaN(interval) || interval <= 0) {
            alert("Please enter at least one message and a valid interval (in minutes).");
            return;
        }

        // Store messages and interval in chrome storage and start the schedule
        chrome.storage.local.set({ messages, interval }, () => {
            chrome.runtime.sendMessage({ action: 'startSchedule' });
            alert("Schedule started with the specified messages and interval.");
        });
    });
});
