export const Intro = ({ startQuiz }: { startQuiz: () => void }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Swim Rules Quiz</h1>
      <p>
        <b>Competition Regulations Version 25 June 2025</b>
      </p>
      <a href="https://www.worldaquatics.com/rules/competition-regulations">
        See here for more info
      </a>
      <button
        style={{ width: "100%", maxWidth: "500px", marginTop: "64px" }}
        onClick={() => startQuiz()}
      >
        Start!
      </button>
    </div>
  );
};
