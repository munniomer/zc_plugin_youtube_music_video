import httpService, { endpoints } from "./httpService";
import { chatDispatch } from "../store/chatsSlice";
import Chat from "../types/chat";
import store from "../store";

const { commentEndpoint } = endpoints;

const getChats = async () => {
  try {
    const result = await httpService.get(commentEndpoint);
    const data = result.data.data ?? [];
    chatDispatch.set(data);
  } catch (e) {
    console.log(e.message);
  }
};

const addChat = async (chat: Chat) => {
  const newChat: any = { ...chat };
  delete newChat.id;

  chatDispatch.addChat({ ...chat });

  try {
    await httpService.post(commentEndpoint, newChat);

    const { chats } = store.getState();

    if (chats.length > 9)
      chats.slice(0, chats.length - 10).forEach((chat) => deleteChat(chat.id));
  } catch (error) {
    console.log("Chat error:", error.message);
    chatDispatch.removeChat(chat.id);
  }

  return;
};

const deleteChat = (id: string) => {
  return httpService
    .post(endpoints.deleteComment, { id })
    .then(() => chatDispatch.removeChat(id))
    .catch((e) => console.log(e.message));
};

const chatService = { addChat, getChats, deleteChat };

export default chatService;
