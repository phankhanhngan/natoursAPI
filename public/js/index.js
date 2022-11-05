import '@babel/polyfill';
import { login, logout, signup } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { reviewTour } from './reviewTour';
import { showAlert } from './alerts';

// this file get data from user interface and delegate the action

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.form--review');
const logoutButton = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-tour');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const submitReviewButton = document.getElementById('submit-review-button');
const date = document.getElementById('selectedDate');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    document.querySelector('.btn-save-password').textContent = 'Updating...';
    document.querySelector('.btn-save-password').enable = false;

    e.preventDefault();
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn-save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookButton) {
  bookButton.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId, date.value);
  });
}

if (loginButton) {
  loginButton.addEventListener('click', (e) => {
    e.target.textContent = 'Logging you in...';
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        // VALUES
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password);
      });
    }
  });
}

if (signupButton) {
  signupButton.addEventListener('click', (e) => {
    e.target.textContent = 'Signing you up...';
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
          document.getElementById('password-confirm').value;
        e.preventDefault();
        signup(name, email, password, passwordConfirm);
      });
    }
  });
}

if (submitReviewButton) {
  submitReviewButton.addEventListener('click', (e) => {
    e.target.textContent = 'Submitting...';
    if (reviewForm) {
      const { tourId } = e.target.dataset;
      const review = document.getElementById('review').value;
      const rating = document.getElementById('rating').value;
      e.preventDefault();
      reviewTour(tourId, review, rating);
    }
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
