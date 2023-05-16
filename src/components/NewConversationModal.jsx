// NewConversationModal.jsx
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewConversationModal = ({
  open,
  handleClose,
  bots,
  handleNewConversation,
}) => {
  const [selectedBot, setSelectedBot] = React.useState("");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Start a New Conversation
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="select-bot-label">Select Bot</InputLabel>
          <Select
            labelId="select-bot-label"
            value={selectedBot}
            label="Select Bot"
            onChange={(e) => setSelectedBot(e.target.value)}
          >
            {bots.map((bot) => (
              <MenuItem key={bot._id} value={bot._id}>
                {bot.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => handleNewConversation(selectedBot)}
        >
          Start Conversation
        </Button>
      </Box>
    </Modal>
  );
};

export default NewConversationModal;
