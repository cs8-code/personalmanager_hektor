import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-16 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Error Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Etwas ist schiefgelaufen
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={this.handleReset}
                  className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Seite neu laden
                </button>
                <Link
                  to="/siportal"
                  onClick={this.handleReset}
                  className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Zur Startseite
                </Link>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 text-left">
                  <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                      Technische Details (nur in Entwicklung sichtbar)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-red-600">Fehler:</strong>
                        <pre className="mt-1 p-2 bg-red-50 border border-red-200 rounded overflow-x-auto text-xs">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong className="text-red-600">Stack Trace:</strong>
                          <pre className="mt-1 p-2 bg-red-50 border border-red-200 rounded overflow-x-auto text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Help Text */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Falls das Problem weiterhin besteht, kontaktieren Sie bitte den Support.
                </p>
              </div>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
