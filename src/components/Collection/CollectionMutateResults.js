import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const CollectionMutateResults = ({queryParams}) => {
    console.log("CollectionMutateResults");
    console.log(queryParams);
    //console.log(queryParams.specimens);

    const global = useContext(GlobalContext);

    const collectionID = queryParams.metadata.identifiers.perm_id ? 
        queryParams.metadata.identifiers.perm_id :
        (queryParams.metadata.identifiers.supersedes && queryParams.metadata.identifiers.supersedes.length > 0) ? 
            queryParams.metadata.identifiers.supersedes[0] : 
            null


    queryParams.metadata.identifiers.supersedes = queryParams.supersedes.map((oldID) => { return oldID.permID });
    console.log(JSON.parse(JSON.stringify(queryParams)))

    if (queryParams.mode === "edit") {
        queryParams.metadata = jsonMergePatch.generate(queryParams.originalMetadata, queryParams.metadata);
        console.log(JSON.parse(JSON.stringify(queryParams.metadata)))
    }

    const formData = new FormData();
    formData.append('azgs', JSON.stringify(queryParams.metadata));
    //TODO: Consider sending the metadata as a blob to enable per-part mimetype. Like this:
    //const blob = new Blob([JSON.stringify(this.metadata)], { type: "application/merge-patch+json"});
    //formData.append('patchmeta', blob);
    if (queryParams.documentFiles) {
        for (let i = 0; i < queryParams.documentFiles.length; i++) {					
            console.log("appending doc file ");
            console.log(queryParams.documentFiles[i]);
            formData.append('documents', queryParams.documentFiles[i]);
        };
    }
    if (queryParams.imageFiles) {
        for (let i = 0; i < queryParams.imageFiles.length; i++) {					
            console.log("appending image file ");
            console.log(queryParams.imageFiles[i]);
            formData.append('images', queryParams.imageFiles[i]);
        };
    }
    if (queryParams.noteFiles) {
        for (let i = 0; i < queryParams.noteFiles.length; i++) {					
            console.log("appending note misc file ");
            console.log(queryParams.noteFiles[i]);
            formData.append('notes:misc', queryParams.noteFiles[i]);
        };
    }
    if (queryParams.metadataFiles) {
        for (let i = 0; i < queryParams.metadataFiles.length; i++) {					
            console.log("appending metadata file ");
            console.log(queryParams.metadataFiles[i]);
            formData.append('metadata', queryParams.metadataFiles[i]);
        };
    }
    if (queryParams.gems2Files) {
        for (let i = 0; i < queryParams.gems2Files.length; i++) {					
            console.log("appending gisdata:gems2 file ");
            console.log(queryParams.gems2Files[i]);
            formData.append('gisdata:gems2', queryParams.gems2Files[i]);
        };
    }
    if (queryParams.ncgmp09Files) {
        for (let i = 0; i < queryParams.ncgmp09Files.length; i++) {					
            console.log("appending gisdata:ncgmp09 file ");
            console.log(queryParams.ncgmp09Files[i]);
            formData.append('gisdata:ncgmp09', queryParams.ncgmp09Files[i]);
        };
    }
    if (queryParams.legacyFiles) {
        for (let i = 0; i < queryParams.legacyFiles.length; i++) {					
            console.log("appending gisdata:legacy file ");
            console.log(queryParams.legacyFiles[i]);
            formData.append('gisdata:legacy', queryParams.legacyFiles[i]);
        };
    }
    if (queryParams.layerFiles) {
        for (let i = 0; i < queryParams.layerFiles.length; i++) {					
            console.log("appending gisdata:layers file ");
            console.log(queryParams.layerFiles[i]);
            formData.append('gisdata:layers', queryParams.layerFiles[i]);
        };
    }
    if (queryParams.rasterFiles) {
        for (let i = 0; i < queryParams.rasterFiles.length; i++) {					
            console.log("appending gisdata:raster file ");
            console.log(queryParams.rasterFiles[i]);
            formData.append('gisdata:raster', queryParams.rasterFiles[i]);
        };
    }
    
    console.log("formData = ");console.log(formData);
    console.log("queryParams.mode = " + queryParams.mode);


    return (
        <Mutator
            data={formData} 
            entity="collections"
            id={collectionID}
            mode={queryParams.mode}
        />
    );
};

export default CollectionMutateResults;
