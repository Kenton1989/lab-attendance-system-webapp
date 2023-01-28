import React, { ErrorInfo, PropsWithChildren } from "react";
import InternalServerError500 from "./internal-server-error";

type PropType = PropsWithChildren;

type StateType = {
  error?: Error;
  errorInfo?: ErrorInfo;
};

export class ErrorBoundary extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <InternalServerError500 />;
    }

    return this.props.children;
  }
}
