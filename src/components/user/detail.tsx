import { useParams } from "react-router-dom";

export function UserDetail(props: {}) {
  const { userId } = useParams();

  return <p>User: {userId}</p>;
}
