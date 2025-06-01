import {Dispatch, SetStateAction, useEffect} from 'react'


const TextSelectorWrapper = ({children, setSelectedText}: {
    children: React.ReactNode;
    setSelectedText: Dispatch<SetStateAction<string | undefined>>
}) => {

    // UseEffects
    useEffect(() => {
        document.addEventListener('selectionchange', () => {
            const activeSection = document.getSelection()
            const text = activeSection?.toString()
            setSelectedText(text)
        })
    }, [])

    return (
        <>
            {children}
        </>


    )
}

export default TextSelectorWrapper