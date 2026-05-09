// Fetch and display course details on the course page
document.addEventListener('DOMContentLoaded', async () => {
    // Extract course ID from URL
    const pathParts = window.location.pathname.split('/');
    const courseId = parseInt(pathParts[2]); // /course/:id

    if (isNaN(courseId)) {
        window.location.href = '/404.html';
        return;
    }

    try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
            if (response.status === 404) {
                window.location.href = '/404.html';
                return;
            }
            throw new Error('Failed to fetch course');
        }
        const course = await response.json();

        // Update page title
        document.title = `${course.title} - AI Courses`;

        // Display course details
        const courseDetailDiv = document.getElementById('course-detail');
        courseDetailDiv.innerHTML = `
            <h1>${course.title}</h1>
            <p>${course.description}</p>
            <h2>Chapters</h2>
            <ul class="chapters-list">
                ${course.chapters.map(chapter => `
                    <li>
                        <a href="/course/${course.id}/chapter/${chapter.id}">
                            ${chapter.title}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error loading course:', error);
        document.getElementById('course-detail').innerHTML = '<p>Error loading course. Please try again later.</p>';
    }
});