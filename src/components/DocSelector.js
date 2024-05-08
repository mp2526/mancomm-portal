import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function DocSelector() {
    const [open, setOpen] = useState(false);
    const [option, setOption] = useState({key:"", value:"", date:""});
    const [options, setOptions] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);
    const [snackPack, setSnackPack] = useState([]);

    useEffect( () => {
        getOptions();
    }, []);

    async function getOptions() {
        const res = await axios.get("https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/docs");
        const data = res.data;

        const options = data.map(d => ({
            "key" : d.number,
            "label" : `${d.number}. ${d.name}`,
            "date" : d.date
        }));

        setOptions(options);
    }

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const handleChange = (event, value, reason) => {
        switch (reason) {
            case "selectOption":
                setOption({key:value.key, label:value.label, date:value.date});
                break;
            case "clear":
            default:
                setOption({key:"", label:"", date:""});
                break;
        }
    };

    const handleClick = async () => {
        if(!isClicked)
            setIsClicked(true);

        const data = {
            id: option.key,
            date: option.date
        };

        const res = await axios.post("https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/title",
            data);

        let message = "Error occurred while saving document.";
        if(res.status === 200) {
            message = "Document saved successfully."
        }

        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
        setIsClicked(false);
    }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    )

    return (
        <div>
            <Box sx={{minWidth: 120, margin: 2}}>
                <FormControl fullWidth>
                    <Autocomplete
                        id="doc-select"
                        options={options}
                        sx={{width: 400}}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Select a document to process"/>}
                    />

                    {option.key !== "" ? (
                        <p>You have selected <strong>{option.label}</strong>&nbsp;&nbsp;&nbsp;
                            <Button
                                variant="contained"
                                size="small"
                                disabled = {isClicked}
                                onClick={handleClick}
                            >
                                Save Doc
                            </Button>
                        </p>
                    ) : (
                        <p></p>
                    )}
                </FormControl>
            </Box>
            <Snackbar
                key={messageInfo ? messageInfo.key : undefined}
                open={open}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                action={action}
                TransitionProps={{ onExited: handleExited }}
                message={messageInfo ? messageInfo.message : undefined}
            />
        </div>
    );
}

export default DocSelector;