import jwtDecode from 'jwt-decode';

export function isTokenExp(token) {
  return jwtDecode(token).exp < Date.now() / 1000;
}
export function getUserName(token) {
  return jwtDecode(token).sub;
}
