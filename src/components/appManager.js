import React, {useState } from "react";
import { postFetch } from "../http";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";


export default function AppManager(props){
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = React.useState({email:null, firstName: null, lastName: null, password: null});
    const [onInit, setOnInit] = React.useState(true);
    const [loader, setLoader] = useState({
        loader: false,
        notification: false,
        message: "success",
        validationMessage: "Success",
      });

    React.useEffect(() =>{
        const loadPage = async () => {
        const request = {
                "firstName" : "dee",
                "lastName" : "d",
                "email" : localStorage.getItem("user-name")

            }
            await postFetch("/loadpage", request).then((data) =>{
                if(!data.message){
                    //console.log(data);
                    setSummaryData({...data});
                }else{
                    setTimeout(() => {
                        setLoader({...loader, loader:false, notification:true,message:"error",validationMessage:data.message});
                      },1000);
                }
            }).catch((e)=>{
                console.log(e);
                setTimeout(() => {
                  setLoader({...loader, loader:false, notification:true,message:"error",validationMessage:"System Error: Please contact help."});
                },1000);
              });  
        }
       // 
        if(onInit){
            setOnInit(false);
            console.log("setOnInit")
            loadPage();
            
        }
    },[props, onInit, summaryData, navigate]);
       
    const loaderAction = async () => {
        setLoader({ ...loader, notification: false });
      };

    return(
        <div>
             <Loader
        loader={loader.loader}
        notification={loader.notification}
        message={loader.message}
        action={loaderAction}
        validationMessage={loader.validationMessage}
      />
      {console.log(JSON.stringify(summaryData))}
     <h3>hello {summaryData.email}</h3>
        </div>
       
    );
}