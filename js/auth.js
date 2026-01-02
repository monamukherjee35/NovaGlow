// NovaGlow - Authentication Functions (Google + Phone Only)
import { auth, db, googleProvider, RecaptchaVerifier, signInWithPhoneNumber, ADMIN_EMAIL } from './firebase-config.js';
import {
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// ===== Google Sign In =====
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            const role = user.email === ADMIN_EMAIL ? 'admin' : 'customer';
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'User',
                role: role,
                phone: user.phoneNumber || '',
                addresses: [],
                cart: [],
                wishlist: [],
                liked: [],
                createdAt: serverTimestamp()
            });
        }

        return { success: true, user };
    } catch (error) {
        console.error('Google sign-in error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===== Phone Auth - Setup Recaptcha =====
function setupRecaptcha(containerId) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved
        }
    });
    return window.recaptchaVerifier;
}

// ===== Phone Auth - Send OTP =====
async function sendPhoneOTP(phoneNumber) {
    try {
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        return { success: true };
    } catch (error) {
        console.error('Phone OTP error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===== Phone Auth - Verify OTP =====
async function verifyPhoneOTP(otp) {
    try {
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;

        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'User',
                role: 'customer',
                phone: user.phoneNumber || '',
                addresses: [],
                cart: [],
                wishlist: [],
                liked: [],
                createdAt: serverTimestamp()
            });
        }

        return { success: true, user };
    } catch (error) {
        console.error('OTP verification error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

// ===== Logout =====
async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// ===== Check if Admin =====
async function checkIsAdmin(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.role === 'admin' || userData.email === ADMIN_EMAIL;
        }
        return false;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}

// ===== Error Messages =====
function getAuthErrorMessage(code) {
    const errors = {
        'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
        'auth/code-expired': 'OTP has expired. Please request a new one.',
        'auth/user-disabled': 'This account has been disabled.'
    };
    return errors[code] || 'An error occurred. Please try again.';
}

export {
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOTP,
    verifyPhoneOTP,
    logoutUser,
    checkIsAdmin
};
