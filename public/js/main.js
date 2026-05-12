// Fetch and display courses on the home page
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase auth
    if (typeof initAuth === 'function') {
        initAuth();
    }

    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        const courses = await response.json();

        const container = document.getElementById('courses-container');
        container.innerHTML = ''; // Clear loading state

        for (const course of courses) {
            // Check if user has visited this course
            let hasVisited = false;
            if (typeof isChapterVisited === 'function') {
                // We'll check if they've visited any chapter in this course
                // For simplicity, we can check a specific chapter or just assume if they visited the course
                try {
                    const user = auth.currentUser;
                    if (user) {
                        const userDoc = await db.collection('users').doc(user.uid).get();
                        if (userDoc.exists) {
                            const data = userDoc.data();
                            // Check if they have any visit timestamp for this course
                            const courseVisitKey = `courseVisits.${course.id}`;
                            hasVisited = !!data.courseVisits?.[course.id];
                        }
                    }
                } catch (error) {
                    console.error('Error checking course visit status:', error);
                }
            }

            const card = document.createElement('a');
            card.href = `/course/${course.id}`;
            card.className = 'course-card';
            card.innerHTML = `
                <div class="thumbnail">${course.thumbnail}</div>
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                ${hasVisited ? '<div class="visited-badge">Visited</div>' : ''}
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courses-container').innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
});