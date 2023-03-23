﻿import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import CharacterInstanceMutateForm from '../CharacterInstance/CharacterInstanceMutateForm.js';
import CharacterInstanceMutateResults from '../CharacterInstance/CharacterInstanceMutateResults.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.values);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                  	schema {
                      pbotID
                    }
                  	specimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    references {
                        Reference {
                            pbotID
                        }
                        order
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    //TODO: This was necessary because we initially did not have name fields in specimen Descriptions.
    //I require that now, but there are still some that do not have this.
    descriptions = descriptions.reduce((acc, description) => {
        const newDesc = {...description};
        console.log(newDesc);

        if (newDesc.name) {
            acc.push(newDesc);
        } else {
            if (description.specimen) {
                console.log(description.specimen.Specimen.name);
                newDesc.name = description.specimen.Specimen.name;
                acc.push(newDesc);
            } 
        }
        return acc;
    }, []);
    
    console.log(descriptions);
    descriptions = alphabetize(descriptions, "name");
    console.log(descriptions);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="description"
            label="Description"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log(child.props);
                console.log(child.props.dtype);
                props.values.schema = child.props.dschema;
                props.values.name = child.props.dname;
                props.values.specimens = child.props.dspecimens ? JSON.parse(child.props.dspecimens) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {descriptions.map((description) => (
                <MenuItem 
                    key={description.pbotID} 
                    value={description.pbotID} 
                    dschema={description.schema.pbotID} 
                    dname={description.name} 
                    dspecimens={description.specimens ? JSON.stringify(description.specimens.map(specimen => specimen.Specimen.pbotID)) : []}
                    dpublic={description.elementOf && description.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={description.elementOf ? JSON.stringify(description.elementOf.map(group => group.pbotID)) : null}
                    dreferences={description.references ? JSON.stringify(description.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                >{description.name}</MenuItem>
            ))}
        </Field>
    )
        
}

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const schemaGQL = gql`
            query {
                Schema {
                    pbotID
                    title
                }            
            }
        `;

    const { loading: schemaLoading, error: schemaError, data: schemaData } = useQuery(schemaGQL, {fetchPolicy: "cache-and-network"});

    if (schemaLoading) return <p>Loading...</p>;
    if (schemaError) return <p>Error :(</p>;
                                 
    console.log(schemaData.Schema);
    const schemas = alphabetize([...schemaData.Schema], "title");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="schema"
            label="Schema"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
    )
}

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    const specimenGQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading) return <p>Loading...</p>;
    if (specimenError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    const specimens = alphabetize([...specimenData.Specimen], "name");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="specimens"
            label="Specimens"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            onChange={(event,child) => {
                props.handleChange(event);
                //props.setFieldValue("name", child.props.dname) TODO:With multiple:true, this no longer works properly
            }}
        >
            {specimens.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
            ))}
        </Field>
    )
}

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
                <Button onClick={props.handleClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

const DescriptionMutateForm = ({handleSubmit, mode}) => {
    const [open, setOpen] = React.useState(false);
    const [desc, setDesc] = React.useState('');
    const [sch, setSch] = React.useState('');
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (characterInstance) => {
        console.log("handleSelect")
        console.log(characterInstance);
        setOpen(false);
    };

    const initValues = {
                description: '',
                schema: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                specimens: [],
                name: '',
                public: true,
                groups: [],
                cascade: false,
                mode: mode,
    };
            
    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    });
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                schema: Yup.string().required(),
                //TODO: decide if specimen is required for specimen types                         
                //specimen: Yup.string().when("type", {
                //    is: (val) => val === "specimen",
                //    then: Yup.string().required()
                //}),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                name: Yup.string().nullable().required(),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                values.specimen = null;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <DescriptionSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.description !== '')) &&
                <div>
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    fullWidth
                    disabled={false}
                />
                <br />
                
                <SchemaSelect />
                <br />
                
                <ReferenceManager values={props.values}/>

              <div>
                <SpecimenSelect handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                <br />
                </div>
                          
                <Field 
                    component={CheckboxWithLabel}
                    name="public" 
                    type="checkbox"
                    Label={{label:"Public"}}
                    disabled={(mode === "edit" && props.values.origPublic)}
                />
                <br />
                
                {!props.values.public &&
                <div>
                    <GroupSelect />
                    <br />
                </div>
                }
                
                </div>
                }

                {(mode === "edit" && props.values.description !== '') &&
                    <>
                        <InputLabel>
                        Character instances
                        </InputLabel>
                        <Button
                            type="button"
                            variant="text" 
                            color="secondary" 
                            onClick={()=>{console.log("click"); console.log(props.values); setDesc(props.values.description); setSch(props.values.schema); setOpen(true)}}
                            disabled={false}
                        >
                            Add character instance
                        </Button>
                    </>
                }
                {open && 
                    <CharacterInstanceDialog description={desc} schema={sch} open={open} handleClose={handleClose} handleSelect={handleSelect} />
                }

                  
                
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />

                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
                  <br />
                </div>
                }
                
               <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default DescriptionMutateForm;
