import { useParams } from "react-router-dom";

export function WeekDetail(props: {}) {
  const { weekId } = useParams();

  return <p>Week: {weekId}</p>;
}
