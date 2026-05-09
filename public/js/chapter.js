// Fetch and display chapter content on the chapter page
document.addEventListener('DOMContentLoaded', async () => {
    // Extract course ID and chapter ID from URL
    const pathParts = window.location.pathname.split('/');
    // URL format: /course/:id/chapter/:chapterId
    const courseId = parseInt(pathParts[2]);
    const chapterId = parseInt(pathParts[4]);

    if (isNaN(courseId) || isNaN(chapterId)) {
        window.location.href = '/404.html';
        return;
    }

    try {
        const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`);
        if (!response.ok) {
            if (response.status === 404) {
                window.location.href = '/404.html';
                return;
            }
            throw new Error('Failed to fetch chapter');
        }
        const chapter = await response.json();

        // Update page title
        document.title = `${chapter.title} - AI Courses`;

        // Display chapter content
        const chapterContentDiv = document.getElementById('chapter-content');
        chapterContentDiv.innerHTML = `
            <h1>${chapter.title}</h1>
            <div class="chapter-content-text">
                ${chapter.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
            <div class="chapter-nav">
                <a href="/course/${courseId}" class="back-button">← Back to Course</a>
                <!-- Previous/Next chapter navigation could be added here -->
            </div>
        `;
    } catch (error) {
        console.error('Error loading chapter:', error);
        document.getElementById('chapter-content').innerHTML = '<p>Error loading chapter. Please try again later.</p>';
    }
});