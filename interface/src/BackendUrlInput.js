import React, {useEffect, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Grid, TextField} from "@material-ui/core";
import {isValidURL} from "./utils";
import {PulseLoader} from "react-spinners";
import qs from "qs";
import {checkIfValidBackend} from "./backend_api";

const useStyles = () => ({
    inputBackend: {
        minWidth: '220px',
    },
    loadingSpinner: {
        paddingTop: '20px !important',
    }
})

const BackendUrlInput = ({
                             classes, setBackendValidUrl,
                             isValidBackendEndpoint, setIsValidBackendEndpoint,
                             isCheckingBackendEndpoint, setIsCheckingBackendEndpoint,
                         }) => {
    const [backendUrl, setBackendUrl] = useState('');

    useEffect(() => {
        const qsBackendUrl = qs.parse(window.location.search, {ignoreQueryPrefix: true}).backendUrl
        if (qsBackendUrl) {
            onChange(qsBackendUrl)
        }
    }, [setBackendUrl])

    function onChange(newBackendUrl) {
        if (isValidURL(newBackendUrl)) {
            setIsCheckingBackendEndpoint(true)
            checkIfValidBackend(newBackendUrl).then((isValid) => {
                setIsValidBackendEndpoint(isValid)
                if (isValid) {
                    setBackendValidUrl(newBackendUrl)
                }
                setIsCheckingBackendEndpoint(false)
            }).catch(() => {
                setIsCheckingBackendEndpoint(false)
            })
        } else {
            setIsValidBackendEndpoint(false)
        }

        setBackendUrl(newBackendUrl)
    }

    return (
        <Grid container spacing={1} alignContent="center">
            <Grid item xs={10}>
                <TextField className={classes.inputBackend} id="standard-basic" label="Backend URL"
                           value={backendUrl} fullWidth
                           error={!isValidBackendEndpoint && backendUrl !== ''}
                           helperText={!isValidBackendEndpoint && backendUrl !== '' && "Make sure this is a valid URL"}
                           onChange={(event) => onChange(event.target.value)}/>
            </Grid>
            <Grid item className={classes.loadingSpinner} xs={2}>
                <PulseLoader sizeUnit={"px"} size={5} color="purple"
                             loading={isCheckingBackendEndpoint}/>
            </Grid>
        </Grid>
    )
}

export default withStyles(useStyles)(BackendUrlInput);
