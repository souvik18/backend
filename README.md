
# csv/xml file upload validator

This backend service processes customer transaction records from uploaded .csv or .xml files. It validates each record for correctness, detects duplicates, and returns a structured summary of valid and invalid entries.


## Features
- Accepts .csv and .xml file uploads
- Parses and validates transaction records
- Detects duplicate references and incorrect balances
- Returns detailed validation results in JSON format
- Includes global error handling
- Configured with Jest for testing and coverage


## Installation

Install backend with npm

```bash
set node version to 22.18.0
git clone https://github.com/souvik18/backend.git
cd backend
npm install
```
After complete the project setup 

```bash
bash
npm run dev
📤 File Upload Endpoint
URL: POST /file-upload
```
Upload Type 

```bash
Form field: file
Accepted formats: .csv, .xml
Max size: 5MB
```


## Project Structure

```text
src/
├── utils/             # CSV and XML parsing
├── validation/        # Record validation logic
├── schemas/           # Zod schema definitions
├── middleware/        # Error handling
├── routes/            # Upload endpoint
├── constant.ts        # Message constants
├── uploads            # Temporary file folder

tests/                 # Jest test files
```
## Tech Stack

- Node.js
- Express
- TypeScript
- Zod
- Multer
- Jest
