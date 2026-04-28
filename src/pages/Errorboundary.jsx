import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf6ff] to-[#fff0f5] px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-pink-500 mb-6">
              <Zap className="h-16 w-16 mx-auto animate-bounce" />
            </div>

            <h1 className="text-6xl font-bold text-pink-500 mb-4">Oops!</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Something went wrong.
            </h2>
            <p className="text-gray-500 mb-6">
              An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-pink-500 text-white font-medium rounded-xl shadow-lg hover:bg-pink-600 transition"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl shadow-lg hover:bg-gray-300 transition"
              >
                Go Home
              </Link>
            </div>

            {this.state.error && (
              <pre className="text-xs text-gray-400 mt-4 overflow-x-auto max-w-md mx-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
