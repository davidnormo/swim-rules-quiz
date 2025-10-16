import { useState } from "react";
import { Intro } from "./Intro";
import { Quiz } from "./Quiz";
import { QuizComplete } from "./QuizComplete";

function App() {
  const [quizzing, setQuizzing] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const onFinish = ({ correct, total }: { correct: number; total: number }) => {
    setQuizzing(false);
    setScore({ correct, total });
  };

  if (quizzing) {
    return <Quiz finish={onFinish} />;
  }

  if (score.total > 0) {
    return (
      <QuizComplete
        {...score}
        startNextQuiz={() => {
          setScore({ correct: 0, total: 0 });
          setQuizzing(true);
        }}
      />
    );
  }

  return <Intro startQuiz={() => setQuizzing(true)} />;
}

export default App;
