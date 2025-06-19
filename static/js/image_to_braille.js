// ✅ FINAL Image to Braille JS (Read Aloud fully working)

document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const previewContainer = document.getElementById('preview-container');
    const extractedTextElement = document.getElementById('extracted-text');
    const brailleOutputElement = document.getElementById('braille-output');
    const detailedMapping = document.getElementById('detailed-mapping');
    const languageSelect = document.getElementById('language-select');
    const uploadForm = document.getElementById('upload-form');
    const loadingSpinner = document.getElementById('loading-spinner');
    const readAloudButton = document.getElementById('read-aloud-button');

    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            previewContainer.classList.add('d-none');
        }
    });

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            showNotification('Error', 'Please select an image file.');
            return;
        }

        const language = languageSelect.value || 'english';
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', language);

        loadingSpinner.classList.remove('d-none');

        fetch('/api/image-to-text', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) throw new Error('Server error');
                return response.json();
            })
            .then(data => {
                loadingSpinner.classList.add('d-none');
                if (data.error) {
                    showNotification('Error', data.error);
                    return;
                }

                extractedTextElement.textContent = data.text;
                brailleOutputElement.textContent = data.braille;
                displayDetailedMapping(data.detailed_mapping);

                readAloudButton.classList.remove('d-none');
                showNotification('Success', 'Text extracted and converted to Braille.');
            })
            .catch(err => {
                loadingSpinner.classList.add('d-none');
                console.error(err);
                showNotification('Error', 'Failed to process image.');
            });
    });

    // ✅ Android WebView-Compatible Read Aloud
    if (readAloudButton) {
        readAloudButton.addEventListener('click', function () {
            const text = extractedTextElement.textContent.trim();
            const language = languageSelect.value || 'english';

            if (!text) {
                showNotification('Error', 'No text available to read aloud.');
                return;
            }

            fetch('/api/text-to-speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        showNotification('Error', data.error);
                        return;
                    }

                    const audio = new Audio(data.audio_url);
                    audio.play().then(() => {
                        showNotification('Success', 'Reading aloud...');
                    }).catch(err => {
                        console.error('Audio play error:', err);
                        showNotification('Error', 'Unable to play audio.');
                    });
                })
                .catch(err => {
                    console.error('TTS Error:', err);
                    showNotification('Error', 'Failed to convert text to speech.');
                });
        });
    }

    function displayDetailedMapping(mapping) {
        detailedMapping.innerHTML = '';
        if (!Array.isArray(mapping)) return;

        const table = document.createElement('table');
        table.className = 'table table-dark table-bordered';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Character</th><th>Braille</th>';
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        mapping.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.original}</td><td style="font-size: 24px;">${item.braille}</td>`;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        detailedMapping.appendChild(table);
    }

    function showNotification(title, message) {
        const notification = document.getElementById('notification');
        const titleElem = document.getElementById('notification-title');
        const messageElem = document.getElementById('notification-message');

        if (!notification || !titleElem || !messageElem) {
            alert(`${title}: ${message}`);
            return;
        }

        titleElem.textContent = title;
        messageElem.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 4000);
    }
});
