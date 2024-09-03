// src/pages/index.tsx
import AppShell from "@/components/AppShell";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import VoiceInput from "@/components/VoiceInput.tsx";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <AppShell>
      <div>
        <h1>{user.currentUser?.username}</h1>
        <VoiceInput />
      </div>
    </AppShell>
  );
};

export default Home;
