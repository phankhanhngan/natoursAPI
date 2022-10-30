import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, selectedDate) => {
  try {
    const stripe = Stripe(
      'pk_test_51LoONOE6k0K4e9ee5vfibtnhXguab91jk5JQYHrNKtc9IoUc4Hcou68cVwgh8Rz5DKhHtmNzfjJRZJRSFJ6ubk1k00invkMgQ1'
    );
    const url = `/api/v1/bookings/checkout-session/${tourId}/${selectedDate}`;
    // const url = `/api/v1/bookings/checkout-session/${tourId}/${selectedDate.day}-${selectedDate.month}-${selectedDate.year}`;
    console.log(url);
    // 1) Get the checkout session from API
    const session = await axios(url);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
