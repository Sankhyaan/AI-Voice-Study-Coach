import ReactMarkdown from "react-markdown";

function AnswerBox({ answer }) {
  return (
    <div>
      <h2>Answer</h2>

      <ReactMarkdown>
        {answer}
      </ReactMarkdown>
    </div>
  );
}

export default AnswerBox;