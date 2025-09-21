"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { User } from "@prisma/client";

export default function Socket() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:3000/api/user");
      if (!res.ok) throw new Error("User not found");
      const parsedUser: User = await res.json();
      setUser(parsedUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      if (user !== undefined) {
        socket.emit("newUser", user.username);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  return <span></span>;
}
