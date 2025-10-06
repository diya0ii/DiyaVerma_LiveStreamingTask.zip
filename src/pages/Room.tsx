import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [peers, setPeers] = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (!storedUsername) {
      navigate("/");
      return;
    }
    setUsername(storedUsername);

    initializeMedia();
    setupRealtimeChannel(storedUsername);

    return () => {
      cleanup();
    };
  }, [roomId]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Failed to access camera/microphone");
    }
  };

  const setupRealtimeChannel = (username: string) => {
    const channel = supabase.channel(`room:${roomId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const allPeers: Peer[] = [];
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.username !== username) {
              allPeers.push({
                id: presence.id,
                username: presence.username,
              });
            }
          });
        });
        setPeers(allPeers);
      })
      .on("presence", { event: "join" }, ({ newPresences }: any) => {
        console.log("User joined:", newPresences);
        toast.success(`${newPresences[0]?.username || "User"} joined`);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }: any) => {
        console.log("User left:", leftPresences);
        toast.info(`${leftPresences[0]?.username || "User"} left`);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: Math.random().toString(36).substring(7),
            username,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanup();
    sessionStorage.removeItem("username");
    navigate("/");
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId || "");
    toast.success("Room code copied!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 glass-card">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Room:</div>
          <code className="px-3 py-1 rounded-md bg-secondary text-foreground font-mono text-sm">
            {roomId}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyRoomCode}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {peers.length + 1} participant{peers.length !== 0 ? "s" : ""}
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        <div
          className={`grid gap-4 h-full ${
            peers.length === 0
              ? "grid-cols-1"
              : peers.length === 1
              ? "grid-cols-2"
              : "grid-cols-2"
          }`}
        >
          {/* Local Video */}
          <div className="relative rounded-xl overflow-hidden bg-secondary">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/50 text-white text-sm backdrop-blur-sm">
              {username} (You)
            </div>
            {isMuted && (
              <div className="absolute top-4 right-4 p-2 rounded-full bg-destructive">
                <MicOff className="h-4 w-4 text-destructive-foreground" />
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="relative rounded-xl overflow-hidden bg-secondary flex items-center justify-center"
            >
              <div className="text-6xl text-muted-foreground">
                {peer.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/50 text-white text-sm backdrop-blur-sm">
                {peer.username}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleMute}
          className="h-14 w-14 rounded-full"
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleVideo}
          className="h-14 w-14 rounded-full"
        >
          {isVideoOff ? (
            <VideoOff className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
          className="h-14 w-14 rounded-full ml-4"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Room;
