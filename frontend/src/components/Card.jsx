import "./Card.css";

function Card({ title, value, color }) {
  return (
    <div className="card" style={{ background: color }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default Card;