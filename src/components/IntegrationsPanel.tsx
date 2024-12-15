import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface IntegrationStatus {
  provider: string;
  connected: boolean;
}

export const IntegrationsPanel = () => {
  const { toast } = useToast();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data: tokens, error } = await supabase
        .from("oauth_tokens")
        .select("provider");

      if (error) {
        console.error("Error fetching integrations:", error);
        throw error;
      }

      const connectedProviders = new Set(tokens?.map(t => t.provider) || []);
      
      return [
        { provider: "Google Calendar", connected: connectedProviders.has("google_calendar") },
        { provider: "Todoist", connected: connectedProviders.has("todoist") },
        { provider: "Spotify", connected: connectedProviders.has("spotify") }
      ] as IntegrationStatus[];
    }
  });

  const handleConnect = async (provider: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("oauth-init", {
        body: { provider }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error initiating OAuth:", error);
      toast({
        title: "Error",
        description: "Failed to connect to service. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading integrations...</div>;
  }

  return (
    <div className="glass-panel rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Available Integrations</h2>
      <div className="space-y-4">
        {integrations?.map((integration) => (
          <div key={integration.provider} className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h3 className="font-medium">{integration.provider}</h3>
              <p className="text-sm text-muted-foreground">
                {integration.connected ? "Connected" : "Not connected"}
              </p>
            </div>
            <Button
              onClick={() => handleConnect(integration.provider.toLowerCase().replace(" ", "_"))}
              variant={integration.connected ? "secondary" : "default"}
            >
              {integration.connected ? "Reconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};