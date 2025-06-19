# BrailleConnect - Integrated Accessibility Platform

## Overview

BrailleConnect is a comprehensive web-based accessibility platform designed to assist visually impaired users through various conversion services between text, Braille, speech, and images. The application provides a user-friendly interface for converting text to Braille, extracting text from images, converting Braille back to text, and generating speech from text.

## System Architecture

### Frontend Architecture
- **Framework**: HTML5 with Bootstrap 5 (Dark Theme)
- **Styling**: Custom CSS with Font Awesome icons for enhanced visual appeal
- **JavaScript**: Vanilla JavaScript for client-side interactions
- **Theme**: Dark theme optimized for accessibility
- **Responsive Design**: Mobile-first approach using Bootstrap grid system

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Application Server**: Gunicorn for production deployment
- **Development Server**: Flask development server with hot reload
- **Middleware**: ProxyFix for handling reverse proxy headers
- **Session Management**: Flask sessions with configurable secret key

### Deployment Strategy
- **Platform**: Replit with Nix environment
- **Containerization**: Autoscale deployment target
- **Process Management**: Gunicorn with bind configuration
- **Port Configuration**: Internal port 5000, external port 80

## Key Components

### Core Services
1. **Text to Braille Converter** (`/text-to-braille`)
   - Converts regular text to Braille Unicode characters
   - Provides detailed character mapping
   - Supports speech input via Web Speech API

2. **Image to Braille Converter** (`/image-to-braille`)
   - Extracts text from images using Tesseract OCR
   - Converts extracted text to Braille
   - Supports multiple languages (English, Hindi)

3. **Braille Image Recognition** (`/braille-image-to-text`)
   - Detects Braille patterns from images using OpenCV
   - Converts Braille patterns back to readable text
   - Provides visual feedback of detected patterns

4. **Speech Synthesis**
   - Converts text to speech using Google Text-to-Speech (gTTS)
   - Returns base64 encoded audio data
   - Supports multiple languages

### Utility Modules
- **Braille Converter** (`utils/braille_converter.py`): Core Braille conversion logic
- **Image Processor** (`utils/image_processor.py`): OCR text extraction
- **Speech Processor** (`utils/speech_processor.py`): Text-to-speech conversion
- **Braille Image Processor** (`utils/braille_image_processor.py`): Braille pattern recognition

## Data Flow

### Text to Braille Flow
1. User inputs text via form or speech recognition
2. Text is processed through character mapping dictionary
3. Each character is converted to corresponding Braille Unicode
4. Detailed mapping is provided for educational purposes
5. Audio playback available via text-to-speech

### Image Processing Flow
1. User uploads image file
2. Image is temporarily stored and processed
3. Tesseract OCR extracts text content
4. Extracted text is converted to Braille
5. Temporary files are cleaned up automatically

### Braille Recognition Flow
1. User uploads image containing Braille patterns
2. OpenCV processes image for pattern detection
3. Detected patterns are mapped to text characters
4. Processed image with highlighted patterns is returned
5. Text output is provided with speech synthesis option

## External Dependencies

### Python Libraries
- **Flask**: Web framework and routing
- **OpenCV**: Computer vision for Braille pattern recognition
- **Pillow**: Image processing and manipulation
- **Tesseract OCR**: Optical character recognition
- **gTTS**: Google Text-to-Speech service
- **Gunicorn**: WSGI HTTP server for production

### System Dependencies
- **Tesseract**: OCR engine for text extraction
- **PostgreSQL**: Database support (configured but not actively used)
- **OpenGL**: Graphics libraries for image processing

### Frontend Dependencies
- **Bootstrap 5**: CSS framework with dark theme
- **Font Awesome**: Icon library for visual elements
- **Web Speech API**: Browser-based speech recognition

## Deployment Strategy

### Development Environment
- **Runtime**: Python 3.11 with Nix package management
- **Hot Reload**: Automatic server restart on code changes
- **Debug Mode**: Enabled for development with detailed error reporting

### Production Environment
- **Server**: Gunicorn with multiple worker processes
- **Scaling**: Autoscale deployment on Replit infrastructure
- **Load Balancing**: Built-in through Replit's platform
- **SSL/TLS**: Automatically handled by Replit

### Configuration Management
- **Environment Variables**: Session secrets and configuration
- **Port Binding**: Configurable port settings
- **Proxy Headers**: Handled via ProxyFix middleware

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 18, 2025. Initial setup