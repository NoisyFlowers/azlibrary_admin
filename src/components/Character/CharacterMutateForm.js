import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize, sort } from '../../util.js';
import {CharacterSelect} from "../Character/CharacterSelect.js";

import {
  useQuery,
  gql
} from "@apollo/client";

/*
const CharacterSelect = (props) => {
    console.log("CharacterSelect");
    console.log(props);
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid

    const gQL = gql`
        query ($schemaID: String!) {
            GetAllCharacters (schemaID: $schemaID)  {
                pbotID
                name
                definition
                order
                characterOf {
                  ... on Character {
                    pbotID
                    __typename
                  }
                  ... on Schema {
                    pbotID
                    __typename
                  }
                }
            }
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.GetAllCharacters);
    //const characters = alphabetize([...data.GetAllCharacters], "name");
    const characters = sort([...data.GetAllCharacters], "order", "name");
    console.log(characters);
    
    const label = props.parent ? "Parent character" : "Character";
    const name =  props.parent ? "parentCharacter" : "character";
    
    const style = {minWidth: "12ch"}
    return characters.length === 0 ? null : (
        <>
        <Field
            style={style}
            component={TextField}
            type="text"
            name={name}
            label={label}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                if (!props.parent) {
                    props.values.name = child.props.dname || '';
                    props.values.order = child.props.dorder || '';
                    props.values.definition = child.props.ddefinition || '';
                }
                props.values.parentCharacter = child.props.dparentcharacter || '';
                props.handleChange(event);
            }}
        >
            {characters.map((character) => (
                <MenuItem 
                    key={character.pbotID} 
                    value={character.pbotID}
                    dname={character.name}
                    ddefinition={character.definition}
                    dorder={character.order}
                    dparentcharacter={"Character" === character.characterOf.__typename ? character.characterOf.pbotID: ''}
                >{character.name}</MenuItem>
            ))}
        </Field>
        <br />
        </>
    )
}
*/

/*
const CharacterMenuItems = (props) => {
    const characters = sort([...props.characters], "order", "name");

    const indent = props.level * 2;
    const fontWeight = props.level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    return (
        <>
        {characters.map((character) => (
            <>
            <MenuItem 
                style={style}
                key={character.pbotID} 
                value={character.pbotID}
                dname={character.name}
                ddefinition={character.definition}
                dorder={character.order}
                dparentcharacter={"Character" === character.characterOf.__typename ? character.characterOf.pbotID: ''}
                onClick={(event)=> {alert('name = ' + character.name)}}
            >{character.name}</MenuItem>
            <CharacterMenuItems characters={character.characters} level={props.level+1} />
            </>
        ))}
        </>
    )
}

const flattenAndSort = (characters, level) => {
    const chars = sort([...characters], "order", "name");
    
    const indent = level * 2;
    const fontWeight = level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    let flatList = []; 
    chars.forEach((character) => {
        
        
        const {characters, ...lightCharacter} = character; // remove characters
        flatList.push({
            ...lightCharacter,
            style: style,
        });
        
        if (character.characters && character.characters.length > 0) {
            flatList = flatList.concat(flattenAndSort(character.characters, level+1));
        }
        return flatList;
        
        
    })
    return flatList
}

export const CharacterSelectx = (props) => {
    const gQL = gql`
    fragment CharacterFields on Character {
        pbotID
        name
        definition
        order
        characterOf {
            ... on Character {
                pbotID
                __typename
            }
            ... on Schema {
                pbotID
                __typename
            }
        }
    }

    fragment CharactersRecurse on Character {
        characters {
            ...CharacterFields
            characters {
                ...CharacterFields
                characters {
                    ...CharacterFields
                    characters {
                        ...CharacterFields
                        characters {
                            ...CharacterFields
                            characters {
                                ...CharacterFields
                            }
                        }
                    }
                }
            }
        }
    }

    query ($schemaID: ID) {
        Schema (pbotID: $schemaID) {
            characters {
                ...CharacterFields
                ...CharactersRecurse
            }
        }
    }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                    
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.Schema[0].characters);

    const characters = flattenAndSort(data.Schema[0].characters, 0);

    const label = props.parent ? "Parent character" : "Character";
    const name =  props.parent ? "parentCharacter" : "character";
    let level = 0;
    const style = {minWidth: "12ch"}
    return data.Schema[0].characters && data.Schema[0].characters.length === 0 ? null : (
        <>
        <Field
            style={style}
            component={TextField}
            type="text"
            name={name}
            label={label}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                if (!props.parent) {
                    props.values.name = child.props.dname || '';
                    props.values.order = child.props.dorder || '';
                    props.values.definition = child.props.ddefinition || '';
                }
                props.values.parentCharacter = child.props.dparentcharacter || '';
                props.handleChange(event);
            }}
        >

            {characters.map((character) => (
                <MenuItem 
                    style={character.style}
                    key={character.pbotID} 
                    value={character.pbotID}
                    dname={character.name}
                    ddefinition={character.definition}
                    dorder={character.order}
                    dparentcharacter={"Character" === character.characterOf.__typename ? character.characterOf.pbotID: ''}
               >{character.name}</MenuItem>

            ))}

        </Field>
        <br />
        </>
    );

}

*/





const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const gQL = gql`
            query {
                Schema {
                    pbotID
                    title
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Reference);
    
    const schemas = alphabetize([...data.Schema], "title");
    console.log(schemas)
    
    return (
        <>
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
            onChange={event => {
                //props.resetForm();
                props.values.character =  '';
                props.values.parentCharacter =  '';
                props.handleChange(event);
            }}
        >
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
        <br />
        </>
    )
}

const CharacterMutateForm = ({handleSubmit, setShowResult, mode}) => {
    const initValues = {
                character: '',
                name: '',
                definition: '',
                order: '',
                schema: '',
                parentCharacter: '',
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
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleSubmit(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                schema: Yup.string().required(),
                order: Yup.number().integer(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                <SchemaSelect values={props.values} handleChange={props.handleChange}/>
                
                {(mode === "edit" || mode === "delete") && props.values.schema !== '' &&
                    <CharacterSelect source="character" values={props.values} handleChange={props.handleChange}/>
                }
                
                {((mode === "create" && props.values.schema) || (mode === "edit" && props.values.character)) &&
                    <CharacterSelect source="character" values={props.values} parent handleChange={props.handleChange}/>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.character !== '')) &&
                    <>
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="definition"
                        label="Definition"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="order"
                        label="Order"
                        fullWidth 
                        disabled={false}
                    />
                    <br />
                     
                    </>
                }
                
                {(mode === "delete") &&
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
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

export default CharacterMutateForm;
