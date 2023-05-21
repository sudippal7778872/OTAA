import axios from "axios";
import E_D_service from "../common/encrypt_dycript_service/encrypt_decrypt_service";
// const MasterApi = "http://localhost:7000/";
import appConfiguration from "../../Config/Config";
import authHeader from "../../Utils/auth-header";
// User Key For Token
//const MainKey=`tf23pt5bt2so98so80sk2ippmfyvzagyi6qck8h5naj74cpit63226p79oz77asix9juom1cykod5rnmjjxce5awk4n2ovnsf40ayxlimiltf23pt5bt2so98so80sk2ippmfyvzagyi6qck8h5naj74cpit63226p79oz77asix9juom1cykod5rnmjjxce5awk4n2ovnsf40ayxlimil`

const randomChar=()=>{
  let random = Math.random().toString(36).substring(2);
  return random
}

function getRandomArbitrary() {
  const RandomNumber=(Math.random() * (65 - 20) + 10);
  return parseInt(RandomNumber)
}

const authentication={

    onAuthentication(UserName,Password){
     return axios.post(appConfiguration.MasterApi + "api/auth/signin",{UserName,Password}).then(
        res=>{
          // Orginal User DATA
          const StringData= JSON.stringify(res.data)
          const StoreLocal=E_D_service.TokenEncrypt(StringData)
          localStorage.setItem(appConfiguration.MainKey, StoreLocal);
          localStorage.setItem(res.data.UserPID,StoreLocal);
          // Orginal Detail stored 

          // Fake Generator Not for use in application
          for (let index = 0; index < 25; index++) {
            let FakeValue=randomChar()
            let FakeKey=randomChar()
            for (let i =0 ; i < getRandomArbitrary()+5; i++ ) {
              FakeKey=FakeKey+randomChar()
              FakeValue=FakeValue+randomChar()
            }
            localStorage.setItem(FakeKey, FakeValue);
          }
        }
      )      
    },


    getLogInStatus(){
      // return localStorage.getItem('user')?true:false;
      return localStorage.getItem(appConfiguration.MainKey)?true:false;
    },

    logout(){
      // localStorage.removeItem("user");
      const UserName=this.getLogInUserName();
      return axios.post(appConfiguration.MasterApi + "api/auth/signout",{UserName},{ headers: authHeader() }).then(
        res=>{
              localStorage.removeItem(appConfiguration.MainKey);
              localStorage.clear();
      //this.isLoggedIn=false;
        });
    },

    getLogInUserID(){
      // return localStorage.getItem('user')?true:false;
      const encryptUserData=localStorage.getItem(appConfiguration.MainKey);
      const decryptUserDate=E_D_service.TockenDycript(encryptUserData)
      const objUser = JSON.parse(decryptUserDate);
      return objUser.UserPID;
    },

    getLogInUserName()
    {
      const encryptUserData=localStorage.getItem(appConfiguration.MainKey);
      const decryptUserDate=E_D_service.TockenDycript(encryptUserData)
      const objUser = JSON.parse(decryptUserDate);
      return objUser.UserName;
    },

    getLogInUserFullName()
    {
      const encryptUserData=localStorage.getItem(appConfiguration.MainKey);
      const decryptUserDate=E_D_service.TockenDycript(encryptUserData)
      const objUser = JSON.parse(decryptUserDate);
      return objUser.FullName;
    }
  }

  export default authentication