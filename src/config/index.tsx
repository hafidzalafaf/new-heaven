const USE_SSL = true;
const BASE_URL = 'api.heavenexchange.io';

export const API_URL = USE_SSL ? 'https://' + BASE_URL : 'http://' + BASE_URL;
export const SOCKET_URL = USE_SSL ? 'wss://' + BASE_URL : 'ws://' + BASE_URL;
