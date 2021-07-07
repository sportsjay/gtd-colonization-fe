import React from "react";
import socketio from "socket.io-client";
import { config } from "./config";

const { SOCKET_URL } = config;

export const socket = socketio(SOCKET_URL, { transports: ["websocket"] });
export const SocketContext = React.createContext();
