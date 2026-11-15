import { jwtDecode } from 'jwt-decode';

export function decodeJwt<T>(token:string):T{
    return jwtDecode<T>(token);
}

export  function isTokenExpired(decoded:{exp?:number}):boolean {
    const now = new Date().getTime() / 1000;
    return (decoded.exp ?? 0) <= now;
}