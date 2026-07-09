import { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-ink-500">
          <FiAlertTriangle size={28} className="text-amber-500" />
          <p className="text-sm">Something went wrong rendering this section.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;