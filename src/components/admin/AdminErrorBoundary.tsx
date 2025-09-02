import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Eroare în Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A apărut o eroare neașteptată în panoul de administrare. 
                Te rugăm să încerci să reîmprospătezi pagina.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <h4 className="font-medium text-destructive mb-2">Detalii eroare:</h4>
                  <p className="text-sm text-destructive/80 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-destructive/60 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="text-xs text-destructive/60 mt-1 whitespace-pre-wrap break-all">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Încearcă din nou
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="default" 
                  className="flex-1"
                >
                  Reîmprospătează pagina
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default AdminErrorBoundary
