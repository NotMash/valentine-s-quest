import ValentineGame from "../components/game/ValentineGame";

const Index = () => {
  return (
    <div className="min-h-[100svh] w-full bg-slate-900 flex items-center justify-center p-3">
      <div className="relative w-full max-w-[420px] aspect-[9/16] overflow-hidden rounded-2xl shadow-lg bg-black/10">
        <ValentineGame girlfriendName="Shahina" />
      </div>
    </div>
  );
};

export default Index;
