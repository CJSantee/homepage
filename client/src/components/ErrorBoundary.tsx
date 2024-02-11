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
      return (
        <div className="d-flex flex-column justify-content-center vh-100">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <span className="threed threed-sm text-center">well... sh*t.</span>
            <h3 className="text-uppercase">Something went wrong.</h3>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
