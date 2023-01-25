import { useRequireLogin } from "../auth-context";

export function Home(props: {}) {
  const auth = useRequireLogin();
  return (
    <>
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sequi
        minima molestiae expedita vel, distinctio voluptatibus, modi consectetur
        cumque ex rem, voluptates ratione quibusdam assumenda laborum doloribus.
        Eius, incidunt facilis.
      </p>
    </>
  );
}
