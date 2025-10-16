import { useState } from "react";
import { Intro } from "./Intro";
import { Quiz } from "./Quiz";

function App() {
  const [quizzing, setQuizzing] = useState(false);
  return quizzing ? <Quiz /> : <Intro startQuiz={() => setQuizzing(true)} />;
}

export default App;
