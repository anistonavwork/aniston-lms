import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { assessments } from "../../data/assessments";
import { toast } from "react-toastify";

const Assessments = () => {
  const [level1Unlocked, setLevel1Unlocked] = useState(false);
  const [level2Unlocked, setLevel2Unlocked] = useState(false);

  const [currentLevel, setCurrentLevel] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const checkLevelCompletion = async () => {
      try {
        const tree = await axiosInstance.get("/courses/tree/all");

        const levels = tree.data;

        let level1Modules = 0;
        let level1Completed = 0;

        let level2Modules = 0;
        let level2Completed = 0;

        for (const level of levels) {
          for (const category of level.categories) {
            for (const course of category.courses) {
              const progress = await axiosInstance.get(
                `/progress/course/${course.id}`,
              );

              const completed = progress.data.filter((p) => p.completed).length;

              const total = course.modules.length;

              if (level.id === 1) {
                level1Modules += total;
                level1Completed += completed;
              }

              if (level.id === 2) {
                level2Modules += total;
                level2Completed += completed;
              }
            }
          }
        }

        if (level1Modules > 0 && level1Completed === level1Modules) {
          setLevel1Unlocked(true);
        }

        if (level2Modules > 0 && level2Completed === level2Modules) {
          setLevel2Unlocked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLevelCompletion();
  }, []);

  const questions = currentLevel ? assessments[`level${currentLevel}`] : [];

  const handleAnswer = (qid, optionIndex) => {
    setAnswers({
      ...answers,
      [qid]: optionIndex,
    });
  };

  const submitAssessment = async () => {
    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);

    try {
      const res = await axiosInstance.post("/assessment/submit", {
        level: currentLevel,
        score,
      });

      setResult({
        score,
        passed: res.data.passed,
      });

      toast.success("Assessment submitted");
    } catch {
      toast.error("Submission failed");
    }
  };

  if (!currentLevel) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Assessments</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border p-6 rounded-lg">
            <h3 className="font-semibold">Level 1 Assessment</h3>

            {level1Unlocked ? (
              <button
                onClick={() => setCurrentLevel(1)}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                Start Assessment
              </button>
            ) : (
              <button disabled className="mt-4 bg-gray-300 px-4 py-2 rounded">
                Locked (Complete Level 1 Training)
              </button>
            )}
          </div>

          <div className="border p-6 rounded-lg">
            <h3 className="font-semibold">Level 2 Assessment</h3>

            {level2Unlocked ? (
              <button
                onClick={() => setCurrentLevel(2)}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                Start Assessment
              </button>
            ) : (
              <button disabled className="mt-4 bg-gray-300 px-4 py-2 rounded">
                Locked (Complete Level 2 Training)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Assessment Result</h2>

        <p>
          Score: <strong>{result.score}%</strong>
        </p>

        <p className={result.passed ? "text-green-600" : "text-red-600"}>
          {result.passed ? "Passed" : "Failed"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Level {currentLevel} Assessment
      </h2>

      {questions.map((q) => (
        <div key={q.id} className="mb-6 border p-4 rounded">
          <p className="font-medium">{q.question}</p>

          <div className="mt-3 space-y-2">
            {q.options.map((opt, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  onChange={() => handleAnswer(q.id, i)}
                />

                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={submitAssessment}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit Assessment
      </button>
    </div>
  );
};

export default Assessments;
