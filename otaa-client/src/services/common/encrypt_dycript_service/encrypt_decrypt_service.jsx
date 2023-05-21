import * as CryptoJS from 'crypto-js'
// import crypto from 'crypto-js';

const randomChar=()=>{
  let random = Math.random().toString(36).substring(2);
  return random
}
const separator=`,`
const encrypt = (text) => {
    const parameter=randomChar()+separator+text+separator+randomChar()
    const value=CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(parameter))
    return value;
  };
const decrypt = (text) => {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if(base64regex.test(text)){
      const value=CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
      let result = value.split(",")
      return result[1]
    }
    else{
      return false
    }
  };

const TokenEncrypt = (text) => {
  const value=CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
  return value;
};
const TockenDycript =(text)=>{
  var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if(base64regex.test(text)){
    const value=CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
    return value
  }
  else{
    return false
  }
}

const E_D_service={
  decrypt,
  encrypt,
  TokenEncrypt,
  TockenDycript
}

export default E_D_service
