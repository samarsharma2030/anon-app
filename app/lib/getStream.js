// lib/getStream.js
import { StreamChat } from 'stream-chat';

const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY);

export default client;
