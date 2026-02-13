import ValentineGame from "../components/game/ValentineGame";

const Index = () => {
  return (
    <div className="min-h-[100svh] w-full bg-slate-900 flex justify-center">
      <div className="relative w-full max-w-[420px] h-[100svh]">
        <ValentineGame girlfriendName="Shahina" />
      </div>
    </div>
  );
};

export default Index;
