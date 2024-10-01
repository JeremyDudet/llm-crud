import { useAppSelector, useAppDispatch } from "@/hooks";

export default function Chat() {
  const chat = useAppSelector((state) => state.chat.value);
  const dispatch = useAppDispatch();

  return <div>Chat</div>;
}
