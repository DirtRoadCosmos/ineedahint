import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Admin = () => {
  const [bots, setBots] = useState([]);
  const [botName, setBotName] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bots`
      );
      setBots(response.data);
    } catch (error) {
      setOpen(true);
      setMessage("An error occurred while fetching bots.");
    }
  };

  const createBot = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/bots`, {
        name: botName,
      });
      setBotName("");
      fetchBots();
    } catch (error) {
      setOpen(true);
      setMessage("An error occurred while creating bot.");
    }
  };

  const deleteBot = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bots/${id}`);
      fetchBots();
    } catch (error) {
      setOpen(true);
      setMessage("An error occurred while deleting bot.");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h3">Admin</Typography>
      <Box component="form" onSubmit={createBot} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="botName"
          label="New Bot Name"
          name="botName"
          autoComplete="botName"
          autoFocus
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Bot
        </Button>
      </Box>
      <Typography variant="h4">Existing Bots</Typography>
      <List>
        {bots.map((bot) => (
          <ListItem key={bot._id}>
            <ListItemText primary={bot.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteBot(bot._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
