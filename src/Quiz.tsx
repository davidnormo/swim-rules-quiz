import { useState } from "react";
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
  for (let i = 0; i < 1; i++) {
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
  e.target[i] instanceof HTMLInputElement ? e.target[i].value : "";

const caseInsensCheck = (target: string, input: string) =>
  new RegExp(target, "i").test(input);

const getCheckedContent = (sub: string | undefined, value: string) =>
  sub
    ? `<span style="color: ${
        caseInsensCheck(sub, value) ? "green" : "red"
      }">${value}</span>`
    : "";

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

export const Quiz = () => {
  const [questions, setQuestions] = useState(() => generateRandomQuestions());
  const [currentQ, setCurrentQ] = useState(0);
  const [currentState, setCurrentState] = useState("INPUTTING");
  const { ruleTitle, subruleNum, questionContent, subs } = questions[currentQ];
  const [content, setContent] = useState(questionContent);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        {subruleNum} {ruleTitle}
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
          } else {
            setCurrentState("INPUTTING");
            setCurrentQ((n) => n + 1);
            setContent(questions[currentQ + 1].questionContent);
          }
        }}
      >
        <style>{`input { border: 1px solid #ccc; padding: 8px; border-radius: 5px }`}</style>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <button
          type="submit"
          style={{
            maxWidth: "500px",
            width: "calc(100% - 32px)",
            position: "absolute",
            bottom: "64px",
          }}
        >
          {currentState === "INPUTTING" ? "Check" : "Next"}
        </button>
      </form>
    </div>
  );
};
