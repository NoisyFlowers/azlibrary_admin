import React, { useState } from 'react';
import logo from './PBOT-logo-transparent.png';
import './App.css';
import PBOTInterface from './components/PBOTInterface';
import Footer from "./components/Footer";
import { Button, Stack } from '@mui/material';
import OTUDirectQueryResults from './components/OTU/OTUDirectQueryResults';
import { FormControlUnstyledContext } from '@mui/base';
import { Link, Outlet, useNavigate } from "react-router-dom";

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "30vmin" }}  />
      )
}

function App(props) {
    console.log("----------------App-------------------------");
    console.log(props);
    console.log(window.location.pathname)
    //console.log(formClass);
    //console.log(form)
    const [rotatePBOT, setRotatePBOT] = useState(true);
    const navigate = useNavigate();


    //localStorage.removeItem('PBOTMutationToken');
    return (
        <div className="App">
            <header className="App-header">
                <Link to="/query">
                    <PBOTIcon rotatePBOT={rotatePBOT} />
                </Link>
            </header>
            <Outlet />
            <br />
            <Stack direction="row" spacing={5} justifyContent="center">
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/about`);}}>About</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/howto`);}}>How to use Pbot</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/resources`);}}>Resources</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/education`);}}>Go to Education & Outreach Hub</Button>
                </Stack>
            <br />
            <br />
           <Footer />
        </div>
    );
}

export default App;
