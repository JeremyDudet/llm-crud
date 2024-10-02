// src/pages/index.tsx
import AppShell from "@/components/AppShell";
import { useSelector } from "react-redux";
import { RootState } from "@/store.ts";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <AppShell>
      <div>
        <h1>{user.currentUserName}</h1>
      </div>
    </AppShell>
  );
};

export default Home;
