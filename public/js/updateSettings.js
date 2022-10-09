import axios from 'axios';
import { showAlert } from './alerts';

//type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const urlType = type === 'password' ? 'updateMyPassword' : 'updateMe';

    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${urlType}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => location.reload(), 2500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
