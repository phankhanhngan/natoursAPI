import Tour from '../../models/tourModel';
import { showAlert } from './alerts';
import axios from 'axios';

export const likeTour = async (tourId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}/likeTour`
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour liked successfully!');
    }
    return res.data.data.type;
  } catch (err) {
    showAlert('error', err.response.data.message);
    return false;
  }
};
