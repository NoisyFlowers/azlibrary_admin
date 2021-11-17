import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  useMutation,
  gql,
  useApolloClient
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('PBOTMutationToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
//Create new client. This will be passed explicitly to useMutation, since we already have a 
//client defined in the context from ApolloProvider. 
//TODO: Look into loading the ApolloProvider client on the fly using something like the 
//method described in https://github.com/apollographql/apollo-client/issues/2897.
const mclient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function CharacterInstanceMutate(props) {
    console.log("CharacterInstanceMutate");
    console.log(props);
    
    const qclient = useApolloClient();

    let gQL;
    gQL = props.params.characterInstanceID ?
        gql`
            mutation ($data: CharacterInstanceInput!) {
                CustomUpdateCharacterInstance(data: $data) {
                    characterInstanceID
                }      
            }
        ` :
        gql`
            mutation ($data: CharacterInstanceInput!) {
                CustomCreateCharacterInstance(data: $data) {
                    characterInstanceID
                }      
            }
        `;
    
    const [mutateCharacterInstance, { data, loading, error }] = useMutation(gQL, {variables: {data: props.params}, client: mclient});

    //Apollo client mutations are a little weird. Rather than executing automatically on render, 
    //the hook returns a function we have to manually execute, in this case addDescription.
    //The idea is that this would be attached to a submit event, I guess, but that's not 
    //how this current architecture works. Instead, I'm using the useEffect hook with the empty 
    //array option that causes it to only execute once.
    useEffect(() => {
            mutateCharacterInstance().catch((err) => {
                //Just eat it. The UI will get what it needs below through the error field defined on the hook.
                console.log("catch");
                console.log(err);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        console.log("ERROR!");
        console.log(error);
        return <p>Error: {error.message}</p>;
    } else if (data) {
        console.log(data);
        
        //Force reload of cache
        qclient.resetStore();

        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return props.params.characterInstanceID ?
            (
                <div key={data.CustomUpdateCharacterInstance.characterInstanceID} style={style}>
                    {data.CustomUpdateCharacterInstance.characterInstanceID} <br />
                    <br />
                </div>
            ) :
            (
                <div key={data.CustomCreateCharacterInstance.characterInstanceID} style={style}>
                    {data.CustomCreateCharacterInstance.characterInstanceID} <br />
                    <br />
                </div>
            );
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

const CharacterInstanceMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let characterInstances = queryEntity === "CharacterInstance-mutate" ? (
                    <CharacterInstanceMutate 
                        params={{
                            characterInstanceID: queryParams.characterInstance || null,
                            descriptionID: queryParams.description || null,
                            characterID: queryParams.character || null, 
                            stateID: queryParams.state.split(",")[1] || null,
                            quantity: queryParams.quantity || null,
                        }}
                    />
                ) : 
                '';
    
    return (
        <div>
            {characterInstances}
        </div>
    );
};

export default CharacterInstanceMutateResults;
