import axios from 'axios'
export const axi= axios.create({
baseURL: 'http://dimitri/usupso/activities/activity/public/',
  headers: {
      'Content-Type': 'application/json',
      'X-Requested-With':'XMLHttpRequest',
    },
});
