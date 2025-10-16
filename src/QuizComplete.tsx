export const QuizComplete = ({
  correct,
  total,
  startNextQuiz,
}: {
  correct: number;
  total: number;
  startNextQuiz: () => void;
}) => {
  let message: string = "Try again! You can only get better...";
  if (correct / total >= 0.9) {
    message = "Congratulations, you nailed it! 🎉";
  } else if (correct / total >= 0.7) {
    message = "Good job! 👍";
  } else if (correct / total >= 0.5) {
    message = "Not terrible, not great.";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>You scored</h2>
      <h1>
        {correct} / {total}!
      </h1>
      <p>
        <b>{message}</b>
      </p>
      <button onClick={startNextQuiz} autoFocus>
        Go again!
      </button>
    </div>
  );
};
