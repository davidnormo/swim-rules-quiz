import { useLayoutEffect, useRef, useState } from "react";
import rules from "./rules-2025-06-25.json";

const randomInt = (min = 0, max = 10) => Math.floor(Math.random() * max) + min;

const inputStr = '<input placeholder="?" />';
const inputStrClean = inputStr.replaceAll(/([?])/g, "\\$1");
const inputRE = new RegExp(inputStrClean, "i");

type Subs = { word: string; index: number }[];

type Question = {
  ruleIdx: number;
  ruleNum: string;
  ruleTitle: string;
  subruleIdx: number;
  subruleNum: string;
  subruleContent: string;
  questionContent: string;
  subs: Subs;
  correct: boolean | undefined;
};

const generateRandomQuestions = () => {
  const qs: Question[] = [];
  const visited: string[] = [];
  for (let i = 0; i < 10; i++) {
    console.log("i", i);
    const ruleIdx = randomInt(0, rules.rules.length - 1);
    const { subrules } = rules.rules[ruleIdx];
    const subruleIdx = randomInt(0, subrules.length - 1);

    if (visited.includes(`${ruleIdx}:${subruleIdx}`)) {
      i--;
      continue;
    }
    visited.push(`${ruleIdx}:${subruleIdx}`);

    const switchWords = [
      "arms",
      "legs",
      "turn",
      "start",
      "finish",
      "head",
      "single",
      "hands",
      "backstroke",
      "breaststroke",
      "butterfly",
      "freestyle",
    ];
    const switchRE = new RegExp(switchWords.join("\\b|\\b"), "i");
    let questionContent = subrules[subruleIdx].content;

    const subs = [];
    for (let j = 0; j < 3; j++) {
      const match = questionContent.match(switchRE);
      if (!match || typeof match.index !== "number") break;

      const { 0: word, index } = match;
      subs.push({ word, index });
      const start = questionContent.slice(0, index);
      const end = questionContent.slice(index + word.length);
      questionContent = `${start}${inputStr}${end}`;
    }

    qs.push({
      ruleIdx,
      ruleNum: rules.rules[ruleIdx].number,
      ruleTitle: rules.rules[ruleIdx].title,
      subruleIdx,
      subruleNum: subrules[subruleIdx].number,
      subruleContent: subrules[subruleIdx].content,
      questionContent: questionContent,
      subs,
      correct: undefined,
    });
  }
  return qs;
};

const getInputValue = (e: any, i: number) =>
  e.target[i] instanceof HTMLInputElement
    ? e.target[i].value.trim() || "..."
    : "";

const caseInsensCheck = (target: string, input: string) =>
  new RegExp(target, "i").test(input);

const getCheckedContent = (sub: string | undefined, value: string) => {
  if (!sub) return "";

  const match = caseInsensCheck(sub, value);
  const matchColor = match ? "green" : "red";
  const matchDecor = match ? "normal" : "line-through";

  return `<span style="color: ${matchColor};text-decoration: ${matchDecor};">${value}</span>${
    !match ? ` <span style="color: green;">${sub}</span>` : ""
  }`;
};

const replaceInputsWithText = ({
  subs,
  e,
  questionContent,
}: {
  questionContent: string;
  e: any;
  subs: { word: string }[];
}) => {
  const one = getCheckedContent(subs[0]?.word, getInputValue(e, 0));
  const two = getCheckedContent(subs[1]?.word, getInputValue(e, 1));
  const three = getCheckedContent(subs[2]?.word, getInputValue(e, 2));

  return questionContent
    .replace(inputRE, one)
    .replace(inputRE, two)
    .replace(inputRE, three);
};

const isCorrect = (subs: { word: string }[], e: any) => {
  for (let i = 0; i < 3; i++) {
    if (subs[i]?.word) {
      if (!caseInsensCheck(subs[i]?.word, e.target[i].value)) return false;
    }
  }
  return true;
};

export const Quiz = ({
  finish,
}: {
  finish: (opts: { correct: number; total: number }) => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [questions, setQuestions] = useState(() => generateRandomQuestions());
  const [currentQ, setCurrentQ] = useState(0);
  const [currentState, setCurrentState] = useState<"INPUTTING" | "CHECKING">(
    "INPUTTING"
  );
  const { ruleTitle, subruleNum, questionContent, subs } = questions[currentQ];
  const [content, setContent] = useState(questionContent);

  useLayoutEffect(() => {
    if (currentState === "INPUTTING") {
      document.querySelector("input")?.focus();
    }
  }, [currentState]);

  return (
    <div
      id="quiz-root"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "25vh",
        maxWidth: "800px",
      }}
    >
      <div style={{ fontSize: "0.6em" }}>
        QUESTION {currentQ + 1}/{questions.length}
      </div>
      <div style={{ fontWeight: "bold" }}>
        Rule {subruleNum} {ruleTitle}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentState === "INPUTTING") {
            setQuestions((qs) => {
              qs = qs.slice();
              qs[currentQ] = {
                ...qs[currentQ],
                correct: isCorrect(subs, e),
              };
              return qs;
            });
            setContent(replaceInputsWithText({ subs, e, questionContent }));
            setCurrentState("CHECKING");
            buttonRef.current?.focus();
          } else if (currentQ === questions.length - 1) {
            finish({
              correct: questions.reduce(
                (acc, q) => acc + (q.correct ? 1 : 0),
                0
              ),
              total: questions.length,
            });
          } else {
            setCurrentState("INPUTTING");
            setCurrentQ((n) => n + 1);
            setContent(questions[currentQ + 1].questionContent);
          }
        }}
      >
        <style>{`
        @media (max-width: 480px) {
          #quiz-root { margin-top: 30px!important; }
        }
        input { border: 1px solid #ccc; padding: 8px; border-radius: 5px; width: 100px }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <button
          ref={buttonRef}
          type="submit"
          style={{
            maxWidth: "500px",
            width: "calc(100% - 32px)",
            position: "absolute",
            bottom: "64px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {currentState === "INPUTTING" ? "Check" : "Next"}
        </button>
      </form>
    </div>
  );
};
