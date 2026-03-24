import React from 'react';

function FrequentView({ frequentFunctions, recentFunctions, loading }) {
    return (
        <div className='frequent-functions-container'>
            <h2>자주 쓰는 기능</h2>

            {loading ? (
                <div className='few-loading'>로딩 중...</div>
            ) : (
                <>
                    <div className='frequent-functions-grid'>
                        {frequentFunctions.map((func, index) => (
                            <div key={index} className='function-card'>
                                <div className='function-icon'>{func.icon}</div>
                                <div className='function-title'>{func.title}</div>
                                <div className='function-description'>{func.description}</div>
                                <div className='function-shortcut'>{func.shortcut}</div>
                            </div>
                        ))}
                    </div>

                    <div className='recent-functions-section'>
                        <h3>최근 쓴 기능들</h3>
                        <p className='subtitle'>가장 최근에 한 질문들</p>

                        <div className='recent-functions-list'>
                            {recentFunctions.map((func, index) => (
                                <div key={index} className='recent-function-item'>
                                    <div className='recent-function-title'>{func.title}</div>
                                    <div className='recent-function-time'>{func.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default FrequentView;
