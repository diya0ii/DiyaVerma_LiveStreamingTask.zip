import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const useWebRTC = (
  roomId: string | undefined,
  username: string,
  localStream: MediaStream | null
) => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);
  const myIdRef = useRef<string>("");

  useEffect(() => {
    if (!roomId || !username || !localStream) return;

    const myId = Math.random().toString(36).substring(7);
    myIdRef.current = myId;

    const channel = supabase.channel(`room:${roomId}`);

    // Handle presence sync
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const allPeers: Peer[] = [];
      
      Object.values(state).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          if (presence.id !== myId) {
            allPeers.push({
              id: presence.id,
              username: presence.username,
            });
          }
        });
      });

      setPeers(allPeers);
    });

    // Handle new peer joining
    channel.on("presence", { event: "join" }, ({ newPresences }: any) => {
      newPresences.forEach((presence: any) => {
        if (presence.id !== myId) {
          createPeerConnection(presence.id, true);
        }
      });
    });

    // Handle peer leaving
    channel.on("presence", { event: "leave" }, ({ leftPresences }: any) => {
      leftPresences.forEach((presence: any) => {
        closePeerConnection(presence.id);
      });
    });

    // Handle WebRTC signaling
    channel.on("broadcast", { event: "offer" }, ({ payload }: any) => {
      if (payload.to === myId) {
        handleOffer(payload.from, payload.offer);
      }
    });

    channel.on("broadcast", { event: "answer" }, ({ payload }: any) => {
      if (payload.to === myId) {
        handleAnswer(payload.from, payload.answer);
      }
    });

    channel.on("broadcast", { event: "ice-candidate" }, ({ payload }: any) => {
      if (payload.to === myId) {
        handleIceCandidate(payload.from, payload.candidate);
      }
    });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          id: myId,
          username,
          online_at: new Date().toISOString(),
        });
      }
    });

    channelRef.current = channel;

    return () => {
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      channel.unsubscribe();
    };
  }, [roomId, username, localStream]);

  const createPeerConnection = (peerId: string, shouldCreateOffer: boolean) => {
    if (!localStream || peerConnections.current.has(peerId)) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle incoming stream
    pc.ontrack = (event) => {
      setPeers((prev) =>
        prev.map((peer) =>
          peer.id === peerId ? { ...peer, stream: event.streams[0] } : peer
        )
      );
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: {
            from: myIdRef.current,
            to: peerId,
            candidate: event.candidate,
          },
        });
      }
    };

    peerConnections.current.set(peerId, pc);

    if (shouldCreateOffer) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (channelRef.current) {
            channelRef.current.send({
              type: "broadcast",
              event: "offer",
              payload: {
                from: myIdRef.current,
                to: peerId,
                offer: pc.localDescription,
              },
            });
          }
        });
    }
  };

  const handleOffer = async (peerId: string, offer: RTCSessionDescriptionInit) => {
    if (!localStream) return;

    const pc = peerConnections.current.get(peerId) || new RTCPeerConnection(ICE_SERVERS);

    if (!peerConnections.current.has(peerId)) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        setPeers((prev) =>
          prev.map((peer) =>
            peer.id === peerId ? { ...peer, stream: event.streams[0] } : peer
          )
        );
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "ice-candidate",
            payload: {
              from: myIdRef.current,
              to: peerId,
              candidate: event.candidate,
            },
          });
        }
      };

      peerConnections.current.set(peerId, pc);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "answer",
        payload: {
          from: myIdRef.current,
          to: peerId,
          answer: pc.localDescription,
        },
      });
    }
  };

  const handleAnswer = async (peerId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peerConnections.current.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (peerId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnections.current.get(peerId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const closePeerConnection = (peerId: string) => {
    const pc = peerConnections.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(peerId);
    }
    setPeers((prev) => prev.filter((peer) => peer.id !== peerId));
  };

  return { peers, channel: channelRef.current };
};
