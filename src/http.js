import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Config from './config';

export async function postFetch (url,data){
    url = Config.url+url;
    const cookies = (Cookies.get("state") === undefined) ? "" : JSON.parse(CryptoJS.AES.decrypt(Cookies.get("state"), Config.secretPhrase).toString(CryptoJS.enc.Utf8)).token;
    console.log(cookies);
    const res = await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin":"*",
            'Authorization':'Bearer '+ cookies
        },
        body:JSON.stringify(data)
    });
    const json = await res.json();
    return json;
}

export default {postFetch};