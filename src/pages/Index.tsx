import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    toast.success("Room code generated!");
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Please generate or enter a room code");
      return;
    }
    
    sessionStorage.setItem("username", username);
    navigate(`/room/${roomCode}`);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    
    sessionStorage.setItem("username", username);
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">VideoChat</h1>
          <p className="text-muted-foreground">Connect with anyone, anywhere</p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6 animate-scale-in">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Your Name
              </Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50 border-glass-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="roomCode" className="text-foreground">
                  Room Code
                </Label>
                <button
                  onClick={generateRoomCode}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Generate Code
                </button>
              </div>
              <Input
                id="roomCode"
                placeholder="Enter or generate room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="bg-secondary/50 border-glass-border font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
            >
              Create Room
            </Button>
            <Button
              onClick={handleJoinRoom}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              Join Room
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          Supports up to 4 participants per room
        </div>
      </div>
    </div>
  );
};

export default Index;
