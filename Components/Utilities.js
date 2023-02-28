
import jwtDecode from 'jwt-decode';

export function isTokenExp(token) {
  return jwtDecode(token).exp < Date.now() / 1000;
}
