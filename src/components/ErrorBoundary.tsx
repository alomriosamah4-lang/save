import React from 'react';

type State = {hasError: boolean};

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: any, info: any) {
    // In production route this to telemetry/secure logs
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return null; // parent App will show fallback UI
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
