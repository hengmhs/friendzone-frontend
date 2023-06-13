const Button = ({ onClick, id, label, className }) => {
  return (
    <button onClick={onClick} id={id} className={className ? className : ""}>
      <h5>{label}</h5>
    </button>
  );
};

export default Button;
