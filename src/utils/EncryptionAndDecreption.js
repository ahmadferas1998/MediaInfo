import CryptoJS from 'crypto-js';


const secretKey =process.env.REACT_APP_INCREPTION_KEY;
export const encrypt = (text) => {
  if(text){
     return CryptoJS.AES.encrypt(text, secretKey).toString();
  }
 
};

export const decrypt = (cipherText) => {
  if(cipherText){
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
  }
};
