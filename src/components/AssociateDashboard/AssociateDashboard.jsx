import { useState, useEffect } from 'react';
import useStore from "../../zustand/store";



function AssociateDashboard() {
    const user = useStore((store) => store.user);

    const likertQuestions = [
        'Reflecting on this past week, how satisfied did you feel in your role?',
        'Looking back on this week, how manageable did your workload feel?',
        'Over the past week, how motivated did you feel to do your best work?',
        'This past week, how supported did you feel by your manager?',
        'Thinking about this week, did you feel like you had opportunities to grow and develop in your role?'
    ];

    const textQuestions = [
        'Any further comments or context here to your ratings above?',
        'What are your top priorities this week? Are there any goals or key projects you want to make progress on?',
        'Looking back at last week’s 1-1, what progress have you made on your goals or action items? Are there any updates or unresolved issues we should revisit?',
        'Are there any challenges, obstacles, or roadblocks slowing you down? What kind of support or resources would help you move forward?',
        'How are you feeling about your workload this week? Is it manageable, or are there areas where you need help prioritizing?',
        'Are there any skills you’re looking to improve or areas where you’d like additional coaching or mentorship?',
        'What feedback do you have for me? Is there anything I can do differently to better support you?',
        'This Week’s Tasks & Projects:',
    ];

    const [likertResponses, setLikertResponses] = useState({});
    const [textResponses, setTextResponses] = useState({});

    const handleLikertChange = (question, value) => {
        setLikertResponses(prev => ({
            ...prev,
            [question]: value
        }));
    };

    const handleTextChange = (question, value) => {
        setTextResponses(prev => ({
            ...prev,
            [question]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            likertResponses,
            textResponses
        };
        console.log('Form Data Submitted:', formData);
        
    };

    // const { associates } = useStore((state) => ({
    //     associates: state.associates,
    // }));

    
    
    return (
        <div>
        <h1>{user.username}'s Dashboard</h1>
        <h1>Weekly 1:1 with ManagerName</h1>
        <h2>Connection & Development</h2>
        <p>Start your meeting with the question: 
        “How are we both doing today?”  Use the 
        ratings below to guide the conversation (0= Poor, 10= Excellent)</p>

        <form onSubmit={handleSubmit}>
                {likertQuestions.map((question, index) => (
                    <div key={index}>
                        <p>{question}</p>
                        <div style={{ display: 'flex', columnGap: '10px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <label key={value} style={{ marginRight: '5px' }}>
                                    <input
                                        type="radio"
                                        name={`likert-${index}`}
                                        value={value}
                                        onChange={() => handleLikertChange(question, value)}
                                        required
                                    />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                {textQuestions.map((question, index) => (
                    <div key={index}>
                        <label>
                            {question}
                            <input
                                type="text"
                                name={`text-${index}`}
                                onChange={(e) => handleTextChange(question, e.target.value)}
                                required
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Update Week</button>
                <button type="button">End Week</button>
            </form>
        </div>
    );
}
        {/*<ul>
            {/* {associates.map((associate) => (
            <li key={associate.id}>{associate.name}</li>
            ))} */}
       {/*} </ul> 
        
        </div>
    );
} 
    */}

export default AssociateDashboard;