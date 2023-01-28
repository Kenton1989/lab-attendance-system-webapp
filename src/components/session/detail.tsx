import { useParams } from "react-router-dom";

export function SessionDetail(props: {}) {
  const { sessionId } = useParams();

  return <p>Session: {sessionId}</p>;
}
