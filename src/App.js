import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from "@mui/icons-material/Launch";
import DownloadIcon from "@mui/icons-material/Download";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { JSONTree } from "react-json-tree";
import Divider from "@mui/material/Divider";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [open, setOpen] = useState(false);
  const [openTitle, setOpenTitle] = React.useState(false);
  const [options, setOptions] = useState([]);
  const [option, setOption] = useState({key:"", value:"", date:""});
  const [snackPack, setSnackPack] = useState([]);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const [isClicked, setIsClicked] = useState(false)
  const [titles, setTitles] = useState([]);
  const [title, setTitle] = useState({});


  const deleteTitle = React.useCallback(
      (id) => () => {
        setTimeout(async () => {
          const res = await axios.delete(`https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/title/${id}`);

          let message = "Error occurred while deleting title.";
          if(res.status === 200 && res.data.acknowledged) {
            await getTitles();
            message = "Title deleted successfully."
          }

          setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);

        });
      },
      [],
  );

  const openTitleDialog = React.useCallback(
      (id) => () => {
        setTimeout(async () => {
          const res = await axios.get(`https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/title/${id}`);

          if(res.status === 200) {
            setTitle(res.data);
            setOpenTitle(true);
          }
        });
      },
      [],
  );

  const downloadTitle = React.useCallback(
      (id) => () => {
        setTimeout(async () => {
          const res = await axios.get(`https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/download/title/${id}`);
          if(res.status === 200) {
            window.location.href = res.data;
          }
        });
      },
      [],
  );

  useEffect( () => {
    getOptions();
    getTitles();
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

  async function getTitles() {
    const res = await axios.get("https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/titles");
    const data = res.data;

    const titles = data.map(d => ({
      "id" : d["_id"],
      "label" : d.label
    }));

    setTitles(titles);
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

  const handleDocClick = async () => {
    if(!isClicked)
      setIsClicked(true);

    const data = {
      id: option.key,
      date: option.date
    };

    const res = await axios.post("https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1/title",
        data);

    let message = "Error occurred while saving document.";
    if(res.status === 200 && res.data.acknowledged) {
      await getTitles();
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

  const handleTitleClose = (event, reason) => {
    setOpenTitle(false);
    setTitle({});
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

  const columns = React.useMemo(
      () => [
        { field: 'id', headerName: 'ID', type: 'string', width: 300 },
        { field: 'label', headerName: 'Name', type: 'string', width: 600 },
        {
          field: 'actions',
          type: 'actions',
          width: 80,
          getActions: (params) => [
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={deleteTitle(params.id)}
            />,
            <GridActionsCellItem
                icon={<LaunchIcon />}
                label="Open"
                onClick={openTitleDialog(params.id)}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DownloadIcon />}
                label="Download"
                onClick={downloadTitle(params.id)}
                showInMenu
            />
          ],
        },
      ],
      [deleteTitle, openTitleDialog, downloadTitle],
  );

  const theme = {
    scheme: 'google',
    author: 'seth wright (http://sethawright.com)',
    base00: '#1d1f21',
    base01: '#282a2e',
    base02: '#373b41',
    base03: '#969896',
    base04: '#b4b7b4',
    base05: '#c5c8c6',
    base06: '#e0e0e0',
    base07: '#ffffff',
    base08: '#CC342B',
    base09: '#F96A38',
    base0A: '#FBA922',
    base0B: '#198844',
    base0C: '#3971ED',
    base0D: '#3971ED',
    base0E: '#A36AC7',
    base0F: '#3971ED'
  };

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
                      onClick={handleDocClick}
                  >
                    Save Doc
                  </Button>
                </p>
            ) : (
                <p></p>
            )}
          </FormControl>
        </Box>
        <Divider>Saved Titles</Divider>
        <Box sx={{minWidth: 120, margin: 2}}>
          <DataGrid rows={titles} columns={columns} />
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
        <Dialog
            fullScreen
            open={openTitle}
            onClose={handleTitleClose}
            TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleTitleClose}
                  aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {title.label}
              </Typography>
            </Toolbar>
          </AppBar>
          <JSONTree data={title} theme={theme} invertTheme={true}/>
        </Dialog>
      </div>
  );
}

export default App;