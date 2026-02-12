import React from 'react';
import GlassCard from './GlassCard';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px' }}>
                    <GlassCard style={{ borderColor: 'red' }}>
                        <h2 style={{ color: '#ef4444' }}>Something went wrong.</h2>
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: '#a0a0a0' }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </GlassCard>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
