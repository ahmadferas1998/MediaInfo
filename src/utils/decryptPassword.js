import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_INCREPTION_KEY;
export const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
