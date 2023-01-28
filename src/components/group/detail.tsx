import { useParams } from "react-router-dom";

export function GroupDetail(props: {}) {
  const { groupId } = useParams();

  return <p>Group: {groupId}</p>;
}
