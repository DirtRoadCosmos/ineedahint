const Hint = (props) => {
    const hint = props.hint
    return (
        <li>{hint.id}: {hint.text}</li>
    )
}

export default Hint