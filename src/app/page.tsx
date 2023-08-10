"use client"; // This is a client component 👈🏽

import { useEffect, useState, ChangeEvent } from "react";

import { IoSend } from "react-icons/io5";
import "@tensorflow/tfjs-backend-webgl";
import * as qna from "@tensorflow-models/qna";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

export default function Home() {
  interface QuestionAndAnswer {
    findAnswers(question: string, context: string): Promise<Answer[]>;
  }
  interface Answer {
    text: string;
    startIndex: number;
    endIndex: number;
    score: number;
  }
  const [passageRef, setPassageRef] = useState<string>("");
  const [questionRef, setQuestionRef] = useState<string>("");

  const [answers, setAnswers] = useState<Answer[]>();
  const [model, setModel] = useState<QuestionAndAnswer | null>(null);

  // Load model

  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
  };
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPassageRef(event.target.value);
  };
  const handleQuestionAreaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuestionRef(event.target.value);
  };

  const colorStyle = {
    color: "#5C6AC4",
  };
  // Getting Answer
  const getAnswers = async () => {
    if (model !== null) {
      console.log("Question Submitted!");

      if (passageRef && questionRef) {
        const passage = passageRef;
        const question = questionRef;
        console.log(question);
        const modelAnswers = await model.findAnswers(question, passage);
        setAnswers(modelAnswers);
        console.log(modelAnswers);
      } else {
        Swal.fire({
          title: "Error",
          text: "Please fill the passage area and Question first!",
          icon: "warning",
        });
      }
    }
  };

  // Flow
  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="bg-gray-200 h-screen w-screen flex  justify-center items-center">
      <main>
        {!model ? (
          <div>
            <div>
              <CircularProgress
                className="text-gray-500"
                style={colorStyle}
                size={180}
              />
            </div>
            <div>
              <span className="text-gray-700  font-extrabold text-2xl">
                Getting Started
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex align-middle justify-center text-xl ">
              <span className="text-4xl text-gray-700  font-extrabold">
                {" "}
                Question Me{" "}
              </span>
            </div>
            <div className="flex">
              <div className="  border-gray-500 float-left flex flex-col  gap-3  bg-white rounded-xl h-[90vh] w-[50vw] mr-24 mt-3">
                <div className=" ml-2 mt-4">
                  <span className=" text-gray-700 ">
                    Write your passage below.
                  </span>
                </div>
                <div className=" ml-2 w-[45vw] h-[50vh] rounded-md border-[1px] border-gray-300">
                  <textarea
                    name="passage"
                    onChange={handleTextareaChange}
                    id=""
                    cols={80}
                    rows={10}
                    className=" w-[43vw] h-[49vh] resize-none bg-transparent focus:outline-none ml-2 mr-2 text-[18px]"
                  ></textarea>
                </div>
                <div className="mt-10">
                  <div className="ml-2">
                    <span className="text-gray-700 ">
                      Write your questions below.
                    </span>
                  </div>

                  <div className=" flex-row flex items-center rounded-md border-[1px] border-gray-300  flex-1  h-44 w-[45vw] ml-2 mt-4">
                    <textarea
                      onChange={handleQuestionAreaChange}
                      className="w-[43vw] h-[4vh] text-[18px] ml-2 mr-2  outline-none  resize-none bg-transparent focus:outline-none "
                    ></textarea>
                    <IoSend
                      className="ml-2 mr-1 w-6 h-6 cursor-pointer active:cursor-pointer"
                      onClick={getAnswers}
                    />
                  </div>
                </div>
              </div>
              <div className=" bg-white rounded-xl  w-[20vw] mt-3  border-gray-500 ">
                <h1 className=" ml-2 mt-4  text-gray-700">Answers</h1>
                <hr className="border-t-2 border-gray-200" />
                <div className="ml-2 mt-4">
                  <ul>
                    {answers?.length
                      ? answers.map((answer, index) => {
                          return (
                            <li
                              className="text-gray-700  "
                              key={index + "answer"}
                            >
                              <b>{". " + answer.text}</b>
                              <div>
                                <p>Score:</p>
                                <p>{answer.score.toFixed(2)}</p>
                              </div>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
