import React, { useState } from "react";
import { postFetch } from "../http";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";
import GridTable from "./gridtable";
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

export default function Search(props) {
    const navigate = useNavigate();
    const [searchData, setSearchData] = React.useState([]);
    const [onInit, setOnInit] = React.useState(true);
    const [loader, setLoader] = useState({
      loader: false,
      notification: false,
      message: "success",
      validationMessage: "Success",
    });

    const loaderAction = async () => {
        setLoader({ ...loader, notification: false });
      };

      React.useEffect(() => {
        const loadPage = async () => {
          const request = {
            firstName: "dee",
            lastName: "d",
            email: localStorage.getItem("user-name"),
          };
          await postFetch("/search", request)
            .then((data) => {
              if (!data.message) {
                //console.log(data);
                setSearchData([...data]);
              } else {
                setTimeout(() => {
                  setLoader({
                    ...loader,
                    loader: false,
                    notification: true,
                    message: "error",
                    validationMessage: data.message,
                  });
                }, 1000);
              }
            })
            .catch((e) => {
              console.log(e);
              setTimeout(() => {
                setLoader({
                  ...loader,
                  loader: false,
                  notification: true,
                  message: "error",
                  validationMessage: "System Error: Please contact help.",
                });
              }, 1000);
            });
        };
        //
        if (onInit) {
            setOnInit(false);
          loadPage();
        }
      }, [props, onInit, searchData, navigate]);

      const navigateFunction = (row)=>{
        return (<div style={{cursor:'pointer', color:'rgb(51, 51, 255)'}} onClick={()=>viewFunction(row)}>{row.id}</div>);
      }

      const viewFunction = (value)=>{
        localStorage.setItem("requestId", value.id);
        navigate('/tr1');
      }

      const renderViewButton = (row)=>{
        return (<div style={{cursor:'pointer'}}><EditRoundedIcon style={{fontSize:20}}></EditRoundedIcon> <AccessTimeRoundedIcon style={{fontSize:20}}></AccessTimeRoundedIcon> <DeleteIcon style={{fontSize:20}}></DeleteIcon></div>);
      }

      const searchColumns=[{
        name:"Request Id",
        field:"id",
        type:"input",
        renderView:navigateFunction
      },
      {
        name:"Submitted By",
        field:"submittedBy",
        type:"text"
      },
      {
        name:"Submitted Date",
        field:"submittedDate",
        type:"date"
      },
      {
        name:"Travel Start Date",
        field:"travelStartDate",
        type:"date"
      },
      {
        name:"Travel End Date",
        field:"travelEndDate",
        type:"date"
      },
      {
        name:"Assigned To",
        field:"assignedTo",
        type:"text"
      },
      {
        name:"Division",
        field:"division",
        type:"text"
      },
      {
        name:"Request Status",
        field:"status",
        type:"text"
      },
      {
        name:"Action",
        field:"action",
        type:"input",
        renderView:renderViewButton
      }
     
    ];


      return (
        <div>
          <Loader
            loader={loader.loader}
            notification={loader.notification}
            message={loader.message}
            action={loaderAction}
            validationMessage={loader.validationMessage}
          />
        <Box mb={5}></Box>
        <Paper elevation={6}>
          { searchData.length > 0 ?  <GridTable columns={searchColumns} data={searchData}></GridTable> : null }  
        </Paper>
        </div>
      ); 

}