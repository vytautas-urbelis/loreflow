import {ChatMessage} from "../../../../zustand/Chat.ts";
import {motion} from "framer-motion";
import LoadingThreeDotsPulse from "../Thinking";
import {RefObject} from "react"; // Framer Motion for animations
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm'

const handleResponseArray = (array: string[]) => {
    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i];
        // Add a separator (e.g., comma) between elements, except after the last one
        if (i < array.length - 1) {
            result += '';
        }
    }
    const newResults = result.replace(/\\n/g, '  \n');

    return newResults.replace(/```/g, '');
}

const ProcessTimeline = ({messages, messagesRef}: {
    messages: ChatMessage[];
    messagesRef: RefObject<HTMLDivElement | null>
}) => {
    return (
        <div className="w-full flex flex-col space-y-2">
            {messages.map((message, index) => (
                <div
                    key={index}>{message.type === "stream_message" || message.type === "answer_the_question" || message.type === "ask_the_question" ?
                    <>{message.stream_message.length !== 0 &&
                        <div key={index} className="mb-6 borders border-indigo-100 rounded-lg">
                            {/* Response*/}
                            <div className="flex w-full justify-start">
                                <div
                                    className="text-left  tracking-wide px-4 py-2 rounded-xl flex  text-zinc-700 text-[14px]">
                                <span
                                    className={"whitespace-pre-wrap"}>
                                    <Markdown
                                        // remarkPlugins={[remarkGfm]}>{message.stream_message.map((word) => word)}</Markdown>
                                        remarkPlugins={[remarkBreaks, remarkGfm]}>{handleResponseArray(message.stream_message)}</Markdown>

                                    {message.status === "in_progress" &&
                                        <div className={""}><LoadingThreeDotsPulse/></div>}</span>

                                </div>
                            </div>
                        </div>}</>

                    : message.type === "user_prompt" ?
                        <div key={index} className="flex justify-end mt-4">
                            {/* User Prompt */}
                            <div className="flex max-w-140 justify-end ">
                                <div
                                    className="text-left text-[16px] tracking-wide px-4 py-2  text-zinc-800 rounded-lg bg-zinc-100">
                                    {message.user_prompt}
                                </div>
                            </div>
                        </div>
                        :
                        <div key={index} className="mb-3">
                            {/* Subprocesses */}
                            <motion.div
                                key={index}
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.3}}
                                className="rounded-lg  borders border-gray-200"
                            >
                                <div
                                    className="flex items-center gap-4  rounded-lg  borders border-gray-200 ml-4">
                                    {/* Process Description */}
                                    {/*<div className="text-sm flex-grow">{process.description.slice(0, 60)}...*/}
                                    {/*</div>*/}

                                    {/* Status Indicator */}
                                    {message.status === "in_progress" && (
                                        <div className="flex items-center gap-2">
                                            <div className={"mt-2 ml-2"}><LoadingThreeDotsPulse/></div>
                                        </div>
                                    )}
                                    {message.status === "failed" && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <span className="text-xs">Failed</span>
                                        </div>
                                    )}
                                    {message.status === "canceled" && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <span className="text-xs">Canceled</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            <div className="text-gray-600 font-semibold ">
                                {message.processes.map((process) => (
                                    <motion.div
                                        key={process.id}
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{duration: 0.3}}
                                        className="rounded-lg  borders border-gray-200  mt-3 ml-2"
                                    >
                                        <div
                                            className="flex items-center gap-4 p-3  rounded-lg  borders border-gray-200">
                                            {/* Process Description */}
                                            <div className="text-sm flex-grow">{process.description.slice(0, 60)}...
                                            </div>

                                            {/* Status Indicator */}
                                            {process.status === "in_progress" && (
                                                <div className="flex items-center gap-2">
                                                    <div className={"mt-2"}><LoadingThreeDotsPulse/></div>
                                                    {/*<Loader size={14} color="gray"/>*/}
                                                    {/*<span className="text-xs text-gray-500">In Progress</span>*/}
                                                </div>
                                            )}
                                            {process.status === "succeeded" && (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {/*<span className="text-xs">Succeeded</span>*/}
                                                </div>
                                            )}
                                            {process.status === "failed" && (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    <span className="text-xs">Failed</span>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="text-xs text-indigo-500 font-normal max-w-130 pl-2 flex items-start gap-4 ml-2">
                                            {process.stream_text && process.stream_text.length > 0 && <>
                                                <div className={"mt-2"}><LoadingThreeDotsPulse/></div>
                                                {/*<div>{process.stream_text.slice(1).slice(-1)}</div>*/}
                                                {/*{process.stream_text}*/}
                                            </>}


                                        </div>


                                    </motion.div>
                                ))}
                            </div>
                        </div>
                }</div>

            ))}
            <div ref={messagesRef}/>
        </div>
    );
};

export default ProcessTimeline;
