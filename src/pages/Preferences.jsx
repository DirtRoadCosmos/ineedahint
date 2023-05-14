const Preferences = ({ user }) => {
  return (
    <div>
      <h2>Preferences</h2>
      <img src={user.image} alt="Profile" />
      <p>{user.fullName}</p>
    </div>
  );
};

export default Preferences;
