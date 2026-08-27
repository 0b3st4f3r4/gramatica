/**
 * Caderno de Margem: camada mínima da aplicação para privilegiar a leitura estática e clara.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Laboratory from "@/pages/Laboratory";
import Cave from "@/pages/Cave";
import Cosmus from "@/pages/Cosmus";
import Info from "@/pages/Info";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/lab" component={Laboratory} />
            <Route path="/cave" component={Cave} />
            <Route path="/cosmus" component={Cosmus} />
            <Route path="/info" component={Info} />
            <Route component={Home} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
