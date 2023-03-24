import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import CharacterInstanceMutateForm from '../CharacterInstance/CharacterInstanceMutateForm.js';
import CharacterInstanceMutateResults from '../CharacterInstance/CharacterInstanceMutateResults.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';

/*
const CharacterInstanceDialog = (props) => {
    console.log("CharacterInstanceDialog")
    console.log(props)

    return (
        <Dialog fullWidth={true} open={props.open}>
            <DialogTitle>
                Create character instance             
            </DialogTitle>
            <DialogContent>
                Hi there
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}
*/

const CharacterInstanceDialog = (props) => {
    console.log("CharacterInstanceDialog")
    console.log(props)
    const [showResult, setShowResult] = useState(false);
    const [queryParams, setQueryParams] = useState([]);

    const handleSubmit = (values) => {
        setQueryParams(values);
        setShowResult(true);
    }

    return (
        <Dialog fullWidth={true} open={props.open}>
            <DialogTitle>
                Create character instance             
            </DialogTitle>
            <DialogContent>
                {!showResult &&
                <CharacterInstanceMutateForm handleSubmit={handleSubmit} mode="create" description={props.description} schema={props.schema}/>
                }
                {showResult &&
                <CharacterInstanceMutateResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect}/>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="secondary">
                    {showResult ? "OK" : "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const CharacterInstanceList = (props) => {
    console.log("CharacterInstanceList");
    console.log(props);

    let descriptionGQL = gql`
            query ($pbotID: ID) {
                Description (pbotID: $pbotID) {
                    characterInstances {
                        pbotID
                        character {
                            name
                        }
                        state {
                            State {
                                name
                            }
                            value
                            order
                        }
                    }
                }
            }
        `;
    
    const { loading, error, data } = useQuery(descriptionGQL, {
        variables: {
            pbotID: props.description
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <CharacterInstances characterInstances={data.Description[0].characterInstances} />
    );

}

const CharacterInstanceCreator = (props) => {
    //const formikProps = useFormikContext();

    const [open, setOpen] = React.useState(false);
   
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (characterInstance) => {
        console.log("handleSelect")
        console.log(characterInstance);
        setOpen(false);
    };

    const accstyle = {textAlign: "left", width: "70%"}
    return (
        <>
            {props.values.schema &&
                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Character instances
                    </AccordionSummary>
                    <AccordionDetails>
                        <CharacterInstanceList description={props.values.description}/>
                        <Button
                            style={{marginTop:"1.5em"}}
                            type="button"
                            variant="text" 
                            color="secondary" 
                            onClick={()=>{console.log("click"); console.log(props.values); /*setDesc(props.values.description); setSch(props.values.schema);*/ setOpen(true)}}
                            disabled={false}
                        >
                            Add character instance
                        </Button>
                    </AccordionDetails>
                </Accordion>
            }

            {open && 
                <CharacterInstanceDialog description={props.values.description} schema={props.values.schema} open={open} handleClose={handleClose} handleSelect={handleSelect} />
            }
        </>
    );
};

export default CharacterInstanceCreator;
