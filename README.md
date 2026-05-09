# AI Courses Website

A full-stack course website built with Node.js + Express backend and vanilla JavaScript frontend.

## Features

- Home page displaying list of course cards
- Course detail page showing chapters for each course
- Chapter content page displaying readable content
- Fully navigable interface with working links
- RESTful API backend serving course data from JSON
- Error handling with 404 pages

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Data Storage**: JSON file (`courses.json`)
- **API Endpoints**:
  - `GET /api/courses` - Get all courses
  - `GET /api/courses/:id` - Get a single course
  - `GET /api/courses/:id/chapters/:chapterId` - Get chapter content

## Setup and Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```
5. Open your browser and visit: `http://localhost:3000`

## Project Structure

```
ai-courses-website/
├── server.js              # Express server
├── courses.json           # Course data
├── package.json           # Project dependencies and scripts
├── README.md              # This file
└── public/
    ├── index.html         # Home page
    ├── course.html        # Course detail page
    ├── chapter.html       # Chapter content page
    ├── 404.html           # Error page
    ├── css/
    │   └── styles.css     # Styling
    └── js/
        ├── main.js        # Home page logic
        ├── course.js      # Course detail page logic
        └── chapter.js     # Chapter content page logic
```

## API Endpoints

- `GET /api/courses` - Returns array of all courses
- `GET /api/courses/:id` - Returns course object with matching ID
- `GET /api/courses/:id/chapters/:chapterId` - Returns chapter object with matching IDs

## Sample Data

The `courses.json` file contains 3 courses:
1. Introduction to Artificial Intelligence
2. Web Development Fundamentals
3. Data Science with Python

Each course has 3 chapters with 3-5 paragraphs of content each.

## How It Works

1. The Express server serves static files from the `public` directory
2. Frontend pages use `fetch()` to call the backend API for dynamic content
3. Client-side JavaScript renders the fetched data into the appropriate templates
4. All navigation is handled through standard HTML links that work with the client-side routing

## Error Handling

- 404 errors are handled by showing a custom 404 page
- API errors return appropriate status codes and error messages
- Frontend gracefully handles loading errors and displays user-friendly messages

## Development

To modify the course data, edit the `courses.json` file.
To change the styling, modify `public/css/styles.css`.
To change the frontend logic, edit the JavaScript files in `public/js/`.

## License

ISC License