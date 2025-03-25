import React from 'react';
import Likert from 'react-likert-scale';

const LikertScale = ({ question, onChange }) => {
  const likertOptions = {
    question: question,
    responses: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
    ],
    onChange: onChange,
  };

  return <Likert {...likertOptions} />;
};

export default LikertScale;
