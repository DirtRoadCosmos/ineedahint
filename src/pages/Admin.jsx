import React, { useState, useEffect } from "react";
import axios from "axios";

const BotManagement = () => {
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
    <div>
      <h1>Bot Management</h1>
      <input
        type="text"
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
        placeholder="New bot name"
      />
      <button onClick={createBot}>Create Bot</button>
      <h2>Existing Bots</h2>
      {bots.map((bot) => (
        <div key={bot._id}>
          <p>{bot.name}</p>
          <button onClick={() => deleteBot(bot._id)}>Delete Bot</button>
        </div>
      ))}
    </div>
  );
};

export default BotManagement;
