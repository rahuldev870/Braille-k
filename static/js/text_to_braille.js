document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('text-input');
    const recordButton = document.getElementById('record-button');
    const stopRecordButton = document.getElementById('stop-record-button');
    const brailleOutput = document.getElementById('braille-output');
    const detailedMapping = document.getElementById('detailed-mapping');
    const readAloudButton = document.getElementById('read-aloud-button');

    // ✅ Android WebView Mic Integration
    recordButton?.addEventListener('click', () => {
        if (typeof AndroidInterface !== 'undefined' && AndroidInterface.startSpeech) {
            AndroidInterface.startSpeech(); // triggers MainActivity mic
            showNotification('Mic Started', 'Speak now...');
        } else {
            showNotification('Error', 'Mic not supported on this browser.');
        }
    });

    stopRecordButton?.addEventListener('click', () => {
        showNotification('Mic', 'Stop not required. It auto-stops in Android.');
    });

    // ✅ Detect input change from Android's speech and auto-convert to Braille
    const observer = new MutationObserver(() => {
        const text = textInput.value.trim();
        if (text) convertTextToBraille(text);
    });
    observer.observe(textInput, { attributes: true, childList: true, subtree: true });

    // 🔊 Read Aloud
    readAloudButton?.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text) {
            showNotification('Error', 'No text to read');
            return;
        }
        fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: 'english' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.audio_url) {
                const audio = new Audio(data.audio_url);
                audio.play();
                showNotification('Success', 'Reading text aloud...');
            } else {
                showNotification('Error', 'Failed to generate audio');
            }
        })
        .catch(err => {
            console.error('TTS Error:', err);
            showNotification('Error', 'Text-to-Speech failed');
        });
    });

    // 🔡 Convert Text to Braille
    function convertTextToBraille(text) {
        fetch('/api/text-to-braille', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: 'english' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showNotification('Error', data.error);
                return;
            }
            brailleOutput.textContent = data.braille || '';
            displayDetailedMapping(data.detailed_mapping || []);
        })
        .catch(err => {
            console.error('Braille Conversion Error:', err);
            showNotification('Error', 'Failed to convert to Braille');
        });
    }

    function displayDetailedMapping(mapping) {
        detailedMapping.innerHTML = '';
        if (!mapping.length) return;

        const table = document.createElement('table');
        table.className = 'table table-dark table-bordered';
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>Character</th><th>Braille</th></tr>';
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        mapping.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.original}</td><td style="font-size:24px;">${item.braille}</td>`;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        detailedMapping.appendChild(table);
    }

    function showNotification(title, message) {
        const notification = document.getElementById('notification');
        const titleEl = document.getElementById('notification-title');
        const msgEl = document.getElementById('notification-message');

        if (notification && titleEl && msgEl) {
            titleEl.textContent = title;
            msgEl.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        } else {
            alert(`${title}: ${message}`);
        }
    }
});
