import React, { useState }from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import Result from './Result';
import Action from './Action';
import {publicGroupID, GroupSelect} from './Group/GroupSelect.js';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';

import {ApolloProvider} from "@apollo/client";
import {client} from '../ApolloClientSetup.js';
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import { Outlet } from "react-router-dom";

const PBOTInterface = (props) => {
    console.log("----------PBOTInterface--------------");
    console.log(props);
    const navigate = useNavigate();
    
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [showResult, setShowResult] = useState(false); 
    
    const handleFormClass = (event, newFormClass) => {
        setShowResult(false);
         navigate(`/${newFormClass}`);
    };

   const handleFormChange = (event) => {
        console.log(event.target.value);
        setShowResult(false);
        navigate(`/${props.formClass}/${event.target.value.replace("-mutate", "").toLowerCase()}`);
    };

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const handleSubmit = (values) => {
        console.log("handleSubmit");
        console.log(values);
        setQueryParams(values);
        setShowResult(true);
        setSelectedTab(1);
    };
        
    //Figure out what we're doing from the path, massage it, and send to Result as queryEntity
    const location = useLocation();
    let form = location.pathname.split("/")[2];
    let result = showResult ? (
                    <Result queryParams={queryParams} type={props.formClass} queryEntity={form}/>
                 ) :
                 '';
  
    const style = {textAlign: "left"}
    //Note: The use of hidden for display of result is critical for avoiding repeat executions of that code.
    return (
        <ApolloProvider client={client}>
        <div style={style}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                <Tab label="Action"  />
                <Tab label="Results"  disabled={!showResult}/>
            </Tabs>
            </Box>

            <div style={{margin: "10px"}}>
                <div hidden={selectedTab !== 0}>
                    <Outlet context={[handleSubmit, props.formClass, handleFormChange, setShowResult, setSelectedTab]} />
                </div>
                <div hidden={selectedTab !== 1}>
                    {result}
                </div>
            </div>
        </div>
        </ApolloProvider>

    );
};

export default PBOTInterface;
