export default function authHeader() {
  const jwtToken = localStorage.getItem('token');
  if (jwtToken) {
    return {
      Authorization: 'Bearer ' + jwtToken,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
  } else {
    return {};
  }
}
