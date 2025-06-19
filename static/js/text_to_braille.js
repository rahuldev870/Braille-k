document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('text-input');
    const recordButton = document.getElementById('record-button');
    const stopRecordButton = document.getElementById('stop-record-button');
    const brailleOutput = document.getElementById('braille-output');
    const detailedMapping = document.getElementById('detailed-mapping');
    const readAloudButton = document.getElementById('read-aloud-button');

    let recognition;
    let isRecording = false;

    // 🎤 Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isRecording = true;
            recordButton.classList.add('d-none');
            stopRecordButton.classList.remove('d-none');
            showNotification('Recording Started', 'Speak now...');
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            const combined = finalTranscript + interimTranscript;
            textInput.value = combined;

            if (finalTranscript.trim()) {
                convertTextToBraille(finalTranscript.trim());
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            showNotification('Error', 'Speech recognition error: ' + event.error);
            stopRecording();
        };

        recognition.onend = () => {
            isRecording = false;
            recordButton.classList.remove('d-none');
            stopRecordButton.classList.add('d-none');
        };
    } else {
        recordButton.style.display = 'none';
        stopRecordButton.style.display = 'none';
        showNotification('Unsupported', 'Speech Recognition not supported');
    }

    // 🎤 Start/Stop Mic Buttons
    recordButton?.addEventListener('click', () => {
        if (recognition && !isRecording) {
            textInput.value = '';
            recognition.start();
        }
    });

    stopRecordButton?.addEventListener('click', () => {
        if (recognition && isRecording) {
            recognition.stop();
        }
    });

    // 📥 Input listener
    textInput.addEventListener('input', () => {
        const text = textInput.value.trim();
        if (text) {
            convertTextToBraille(text);
        } else {
            brailleOutput.textContent = '';
            detailedMapping.innerHTML = '';
        }
    });

    // 🔊 Read Aloud (uses backend TTS, works in WebView + APK)
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

    // 🔤 Braille Mapping Table
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

    // 🔔 Toast Notification
    function showNotification(title, message) {
        const notification = document.getElementById('notification');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        if (notification && notificationTitle && notificationMessage) {
            notificationTitle.textContent = title;
            notificationMessage.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        } else {
            alert(`${title}: ${message}`);
        }
    }

    // 🛑 Helper for recognition
    function stopRecording() {
        if (recognition && isRecording) {
            recognition.stop();
        }
    }
});
