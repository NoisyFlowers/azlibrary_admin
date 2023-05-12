import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

import { gql } from "@apollo/client/core";
import { useApolloClient } from "@apollo/client/react/hooks/useApolloClient.js";
import { useMutation } from "@apollo/client/react/hooks/useMutation.js";

const SpecimenMutateResults = ({queryParams}) => {
    console.log("-------------------SpecimenMutateResults--------------------");
    console.log(queryParams);
    //console.log(queryParams.identifiers);
    //console.log(queryParams.identifiers[0].pbotID);
    //const ids = queryParams.identifiers.map(({searchName, order, ...keepAttrs}) => keepAttrs) 
    //console.log(ids)
    //console.log(queryParams.file);
    //console.log(queryParams.image)

    /*
    //TODO: 1) Move this into Mutator. 2) Can this be made part of the Specimen mutation in the API?
    const SINGLE_UPLOAD_MUTATION = gql`
    mutation singleUpload($file: Upload!) {
        singleUpload(file: $file) {
            filename
        }
    }
    `;

    const [uploadFileMutation] = useMutation(SINGLE_UPLOAD_MUTATION);
    const apolloClient = useApolloClient();
    queryParams.images.forEach (image => {
        uploadFileMutation({ variables: { file: image.image } }).then(() => {
            apolloClient.resetStore();
        });
    });
    */
    
    return (
        <Mutator
            params={{
                pbotID: queryParams.specimen || null,
                name: queryParams.name || null,
                identifiers: queryParams.identifiers.map(({pbotID}) => pbotID)  || null, 
                references: queryParams.references || null,
                partsPreservedIDs: queryParams.partsPreserved || null,
                notableFeaturesIDs: queryParams.notableFeatures || null,
                preservationModeID: queryParams.preservationMode || null,
                descriptionIDs: queryParams.describedBy || null,
                repository: queryParams.repository || null,
                otherRepositoryLink: queryParams.otherRepositoryLink || null,
                notes: queryParams.notes || null,
                gbifID: queryParams.gbifID || null,
                idigbiouuid: queryParams.idigbiouuid || null,
                pbdbcid: queryParams.pbdbcid || null,
                pbdboccid: queryParams.pbdboccid || null,
                collection: queryParams.collection || null,
                uploadImages: queryParams.images || null,
                cascade: queryParams.cascade || false,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Specimen"
            mode={queryParams.mode}
        />
    );
};

export default SpecimenMutateResults;
