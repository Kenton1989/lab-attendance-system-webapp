import useMessage from "antd/es/message/useMessage";
import { useAuth } from "../auth-context";
import { useRootPageTitle } from "../root-page-context";

export function Home(props: {}) {
  const { auth, authOk } = useAuth({ loginRequired: true });
  const [message, msgCtx] = useMessage();
  useRootPageTitle("home");

  const haha = () => {
    message.open({
      type: "info",
      content: "haha",
    });
  };

  return (
    <>
      {authOk && (
        <>
          {msgCtx}
          <h1>Home</h1>
          <p>Hello, {auth.user?.display_name}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sequi
            minima molestiae expedita vel, distinctio voluptatibus, modi
            consectetur cumque ex rem, voluptates ratione quibusdam assumenda
            laborum doloribus. Eius, incidunt facilis.
          </p>
          <button onClick={haha}>Haha</button>
        </>
      )}
    </>
  );
}
