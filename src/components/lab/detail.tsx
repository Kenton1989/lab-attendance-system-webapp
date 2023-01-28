import { useParams } from "react-router-dom";

export function LabDetail(props: {}) {
  const { labId } = useParams();

  return <p>Lab: {labId}</p>;
}
