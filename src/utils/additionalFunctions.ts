import CryptoJS from "crypto-js";

export function generateMD5Hash(input: string) {
  return CryptoJS.MD5(input).toString();
}
