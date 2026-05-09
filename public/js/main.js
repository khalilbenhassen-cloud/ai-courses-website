// Fetch and display courses on the home page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        const courses = await response.json();

        const container = document.getElementById('courses-container');
        container.innerHTML = ''; // Clear loading state

        courses.forEach(course => {
            const card = document.createElement('a');
            card.href = `/course/${course.id}`;
            card.className = 'course-card';
            card.innerHTML = `
                <div class="thumbnail">${course.thumbnail}</div>
                <h2>${course.title}</h2>
                <p>${course.description}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courses-container').innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
});