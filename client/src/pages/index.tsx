// src/pages/index.tsx
import AppShell from "@/components/AppShell.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store.ts";
import { increment } from "@/features/counter/counterSlice";
import VoiceInput from "@/components/VoiceInput.tsx";

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </div>
  );
}

const Home: React.FC = () => {
  return (
    <AppShell>
      <div>
        <h1>Home</h1>
        <Counter />
        <VoiceInput />
      </div>
    </AppShell>
  );
};

export default Home;
