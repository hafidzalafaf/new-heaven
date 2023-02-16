// use this file to set the API URL and SOCKET URL on prod
const USE_SSL = window.location.protocol === 'https:'
const BASE_URL = 'api.heavenexchange.io';

// use this file to set the API URL and SOCKET URL on dev
// const USE_SSL = true
// const BASE_URL = 'dev.heavenexchange.io';

export const API_URL = USE_SSL ? 'https://' + BASE_URL : 'http://' + BASE_URL;
export const SOCKET_URL = USE_SSL ? 'wss://' + BASE_URL : 'ws://' + BASE_URL;