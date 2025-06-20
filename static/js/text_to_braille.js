// ✅ Full FIXED JavaScript: Text to Braille with Backend TTS (WebView Compatible)
document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('text-input');
    const recordButton = document.getElementById('record-button');
    const stopRecordButton = document.getElementById('stop-record-button');
    const brailleOutput = document.getElementById('braille-output');
    const detailedMapping = document.getElementById('detailed-mapping');
    const readAloudButton = document.getElementById('read-aloud-button');

    let recognition;
    let isRecording = false;

    // ✅ Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            isRecording = true;
            recordButton.classList.add('d-none');
            stopRecordButton.classList.remove('d-none');
            showNotification('Recording Started', 'Speak now...');
        };

        recognition.onresult = function (event) {
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
            if (finalTranscript.trim()) convertTextToBraille(finalTranscript.trim());
        };

        recognition.onerror = function (event) {
            showNotification('Error', 'Speech recognition error: ' + event.error);
            stopRecording();
        };

        recognition.onend = function () {
            isRecording = false;
            recordButton.classList.remove('d-none');
            stopRecordButton.classList.add('d-none');
        };
    } else {
        recordButton.style.display = 'none';
        stopRecordButton.style.display = 'none';
        showNotification('Unsupported', 'Speech Recognition not supported');
    }

    // ✅ Typing Input
    textInput.addEventListener('input', () => {
        const text = textInput.value.trim();
        if (text) convertTextToBraille(text);
        else {
            brailleOutput.textContent = '';
            detailedMapping.innerHTML = '';
        }
    });

    // 🎤 Start / Stop
    recordButton?.addEventListener('click', () => {
        if (recognition && !isRecording) {
            textInput.value = '';
            recognition.start();
        }
    });

    stopRecordButton?.addEventListener('click', () => {
        if (recognition && isRecording) recognition.stop();
    });

    // ✅ Read Aloud (backend TTS)
    readAloudButton?.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text) return showNotification('Error', 'No text to read');

        fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, language: 'english' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) return showNotification('Error', data.error);
                const audio = new Audio(data.audio_url);
                audio.play();
                showNotification('Success', 'Reading text aloud');
            })
            .catch(err => {
                console.error('TTS error:', err);
                showNotification('Error', 'Text-to-speech failed');
            });
    });

    // ✅ Braille Convert API
    function convertTextToBraille(text) {
        fetch('/api/text-to-braille', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) return showNotification('Error', data.error);
                brailleOutput.textContent = data.braille || '';
                displayDetailedMapping(data.detailed_mapping || []);
            })
            .catch(err => {
                console.error('Braille API error:', err);
                showNotification('Error', 'Braille conversion failed');
            });
    }

    // ✅ Mapping Table
    function displayDetailedMapping(mapping) {
        detailedMapping.innerHTML = '';
        if (!mapping.length) return;

        const table = document.createElement('table');
        table.className = 'table table-dark table-bordered';
        table.innerHTML = '<thead><tr><th>Character</th><th>Braille</th></tr></thead>';
        const tbody = document.createElement('tbody');

        mapping.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.original}</td><td style="font-size:24px;">${item.braille}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        detailedMapping.appendChild(table);
    }

    // ✅ Toast
    function showNotification(title, message) {
        const n = document.getElementById('notification');
        const nt = document.getElementById('notification-title');
        const nm = document.getElementById('notification-message');

        if (n && nt && nm) {
            nt.textContent = title;
            nm.textContent = message;
            n.classList.add('show');
            setTimeout(() => n.classList.remove('show'), 3000);
        } else {
            console.log(`${title}: ${message}`);
        }
    }

    // ✅ WebView bridge
    window.convertTextToBraille = convertTextToBraille;
});
