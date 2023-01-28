import { useParams } from "react-router-dom";

export function CourseDetail(props: {}) {
  const { courseId } = useParams();

  return <p>Course: {courseId}</p>;
}
