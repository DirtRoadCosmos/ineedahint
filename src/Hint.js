const Hint = (props) => {
  const hint = props.hint;
  return (
    <div className="card mt-2">
      <div className="card-body">
        <h5 className="card-title">Hint #{hint.id + 1}</h5>
        <p className="card-text">{hint.text}</p>
      </div>
    </div>
  );
};

export default Hint;
