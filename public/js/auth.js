// Firebase Authentication and Firestore functions

// Check if user is logged in and update UI accordingly
function updateUI(user) {
    const userNameElement = document.getElementById('user-name');
    const userPicElement = document.getElementById('user-pic');
    const loginLogoutElement = document.getElementById('login-logout');
    const authMessageElement = document.getElementById('auth-message'); // For login page messages

    if (user) {
        // User is logged in
        if (userNameElement) userNameElement.textContent = user.displayName || user.email;
        if (userPicElement) {
            userPicElement.src = user.photoURL || '/images/default-profile.png';
            userPicElement.style.display = 'block';
        }
        if (loginLogoutElement) {
            loginLogoutElement.innerHTML = `
                <button id="logout-btn" class="btn-logout">Logout</button>
            `;
            // Add event listener to logout button
            document.getElementById('logout-btn').addEventListener('click', () => {
                auth.signOut().then(() => {
                    window.location.href = '/login';
                });
            });
        }
        // Hide any auth buttons that are for logged out state (if we had them)
        const authButtons = document.getElementById('auth-buttons');
        if (authButtons) authButtons.style.display = 'none';
    } else {
        // User is logged out
        if (userNameElement) userNameElement.textContent = '';
        if (userPicElement) {
            userPicElement.style.display = 'none';
            userPicElement.src = '';
        }
        if (loginLogoutElement) {
            loginLogoutElement.innerHTML = `
                <a href="/login" class="btn-login">Login</a>
            `;
        }
        // Show auth buttons for logged out state (if we had them)
        const authButtons = document.getElementById('auth-buttons');
        if (authButtons) authButtons.style.display = 'flex';

        // Clear any auth messages on login page
        if (authMessageElement) authMessageElement.textContent = '';
    }
}

// Show message in auth forms
function showAuthMessage(message, isError = false) {
    const messageElement = document.getElementById('auth-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${isError ? 'error' : 'success'}`;
    }
}

// Handle login form submission
async function handleLogin(email, password) {
    try {
        showAuthMessage('Signing in...');
        await auth.signInWithEmailAndPassword(email, password);
        showAuthMessage('Signed in successfully!', false);
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage(`Login failed: ${error.message}`, true);
    }
}

// Handle registration form submission
async function handleRegister(name, email, password, confirmPassword) {
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showAuthMessage('Please fill in all fields', true);
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', true);
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', true);
        return;
    }

    try {
        showAuthMessage('Creating account...');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Update profile with display name
        // Generate Gravatar URL from email
    const emailHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()));
    const hashArray = Array.from(new Uint8Array(emailHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const gravatarUrl = `https://www.gravatar.com/avatar/${hashHex}?d=identicon`;

    await userCredential.user.updateProfile({
    displayName: name,
    photoURL: gravatarUrl
});

        showAuthMessage('Account created successfully! Please sign in.', false);

        // Switch to login tab after a short delay
        setTimeout(() => {
            document.getElementById('login-tab').click();
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        showAuthMessage(`Registration failed: ${error.message}`, true);
    }
}

// Handle Google sign-in
async function handleGoogleSignIn() {
    try {
        showAuthMessage('Signing in with Google...');
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        showAuthMessage('Signed in with Google successfully!', false);
    } catch (error) {
        console.error('Google sign-in error:', error);
        showAuthMessage(`Google sign-in failed: ${error.message}`, true);
    }
}

// Protect route: if not logged in and not on login page, redirect to login
function protectRoute() {
    const currentPath = window.location.pathname;
    // Allow access to login page and static assets (css, js, images, firebase-config) without auth
    const allowedPaths = ['/login', '/firebase-config.js'];
    const allowedPrefixes = ['/css/', '/js/', '/images/'];

    if (allowedPaths.includes(currentPath)) return;
    if (allowedPrefixes.some(prefix => currentPath.startsWith(prefix))) return;

    // If not on an allowed path and not logged in, redirect to login
    if (!auth.currentUser) {
        window.location.href = '/login';
    }
}

// Save user visit to a course/chapter in Firestore
async function trackUserVisit(courseId, chapterId = null) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = db.collection('users').doc(user.uid);
    const visitData = {
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        lastVisit: firebase.firestore.FieldValue.serverTimestamp()
    };

    // If we have a courseId, update the user's course visits
    if (courseId) {
        visitData[`courseVisits.${courseId}`] = firebase.firestore.FieldValue.serverTimestamp();
        if (chapterId) {
            visitData[`chapterVisits.${courseId}.${chapterId}`] = firebase.firestore.FieldValue.serverTimestamp();
        }
    }

    try {
        await userRef.set(visitData, { merge: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
    }
}

// Check if a chapter has been visited by the user
async function isChapterVisited(courseId, chapterId) {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            return !!data.chapterVisits?.[courseId]?.[chapterId];
        }
    } catch (error) {
        console.error('Error checking visit status:', error);
    }
    return false;
}

// Initialize Firebase Auth listener and form handlers
function initAuth() {
    // Handle auth state changes
    auth.onAuthStateChanged((user) => {
    updateUI(user);

    if (user) {
        db.collection('users').doc(user.uid).set({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(console.error);

        // Redirect to home if on login page
        if (window.location.pathname === '/login') {
            window.location.href = '/';
        }
    } else {
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
});

    // Handle form submissions on login page
    const loginForm = document.getElementById('auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isLoginMode = document.getElementById('login-tab').classList.contains('active');

            if (isLoginMode) {
                // Login mode
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                handleLogin(email, password);
            } else {
                // Register mode
                const name = document.getElementById('register-name').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                handleRegister(name, email, password, confirmPassword);
            }
        });
    }

    // Handle tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginMode = document.getElementById('login-mode');
    const registerMode = document.getElementById('register-mode');
    const switchToLoginLink = document.getElementById('switch-to-login');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', (e) => {
            e.preventDefault();
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginMode.style.display = 'block';
            registerMode.style.display = 'none';
        });

        registerTab.addEventListener('click', (e) => {
            e.preventDefault();
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerMode.style.display = 'block';
            loginMode.style.display = 'none';
        });
    }

    if (switchToLoginLink) {
        switchToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginTab.click();
        });
    }

    // Handle Google sign-in button
    const googleSignInBtn = document.getElementById('google-signin');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
}

// Export functions for use in other scripts
window.trackUserVisit = trackUserVisit;
window.isChapterVisited = isChapterVisited;
window.initAuth = initAuth;

// Initialize auth when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});