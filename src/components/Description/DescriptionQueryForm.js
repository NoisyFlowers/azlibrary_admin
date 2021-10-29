import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup } from 'formik-material-ui';


const OTUQueryForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                type: "all",
                descriptionID: '', 
                family: '', 
                genus: '', 
                species: '',
                includeComplex: false}}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                descriptionID: Yup.string()
                .uuid('Must be a valid uuid'),
                family: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                genus: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                species: Yup.string()
                .max(30, 'Must be 30 characters or less'),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values)
                setShowResult(true);
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <InputLabel htmlFor="type" style={{ marginTop: "10px" }}>Type</InputLabel>
                <Field 
                    component={RadioGroup} 
                    name="type" 
                    label="Type"
                >
                    <Grid container>
                        <Grid item>
                            <FormControlLabel
                                value="OTU"
                                control={<Radio />}
                                label="OTU"
                                disabled={false}
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                value="specimen"
                                control={<Radio />}
                                label="Specimen"
                                disabled={false}
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                value=""
                                control={<Radio  />}
                                label="All"
                                disabled={false}
                            />
                        </Grid>
                    </Grid>
                </Field>
            
                <Field 
                    component={TextField}
                    name="descriptionID" 
                    type="text"
                    label="Description ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                <Field 
                    component={CheckboxWithLabel}
                    name="includeComplex" 
                    type="checkbox" 
                    Label={{ label: 'Include complex' }}
                    disabled={false}
                />
                <br />
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

export default OTUQueryForm;
