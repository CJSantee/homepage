// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode,
}
interface ErrorBoundaryState {
  hasError: boolean,
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error);
    console.log(errorInfo);
  }

  render() {
    if(this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;