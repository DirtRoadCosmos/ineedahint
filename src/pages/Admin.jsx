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
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const Admin = () => {
  const [bots, setBots] = useState([]);
  const [botName, setBotName] = useState("");

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    const response = await axios.get("/api/bots");
    setBots(response.data);
  };

  const createBot = async () => {
    await axios.post("/api/bots", { name: botName });
    setBotName("");
    fetchBots();
  };

  const deleteBot = async (id) => {
    await axios.delete(`/api/bots/${id}`);
    fetchBots();
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
    </Container>
  );
};

export default Admin;
