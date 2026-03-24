import React from 'react';
import ChatBody from '../ChatBody';
import ChatInput from '../ChatInput';

function HomeView({
    messages,
    guideHistory,
    ui,
    agentLoading,
    goToExecution,
    submitMissingParams,
    confirmExecution,
    cancelExecution,
    inputText,
    setInputText,
    sendMessage,
    mode,
    setMode,
}) {
    return (
        <>
            <ChatBody
                messages={messages}
                guideHistory={guideHistory}
                ui={ui}
                loading={agentLoading}
                onGoToExecution={goToExecution}
                onSubmitMissing={submitMissingParams}
                onConfirm={confirmExecution}
                onCancel={cancelExecution}
            />

            <div className='input-container'>
                <ChatInput
                    value={inputText}
                    onChange={setInputText}
                    onSend={sendMessage}
                    mode={mode}
                    onModeChange={setMode}
                    disabled={agentLoading}
                />
            </div>
        </>
    );
}

export default HomeView;
