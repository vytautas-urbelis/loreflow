import {ChapterInterface, PageInterface} from "../../../../../../models/chapter";
import {RichTextEditor} from '@mantine/tiptap';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {useEffect, useRef, useState} from "react";

import {Color} from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import {UpdatePage} from "../../../../../../axios/Page.ts";
import {UseListStateHandlers} from "@mantine/hooks";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";
import useContextStore from "../../../../../../zustand/Context.tsx";
import TextSelectorWrapper from "../../../../../../wrappers/TextSelectorWrapper.tsx";

const PageEditorSection = ({chapter, page, index, handlers, pagesState, addPage}: {
    chapter: ChapterInterface,
    page: PageInterface,
    index: number,
    handlers: UseListStateHandlers<PageInterface>,
    pagesState: PageInterface[],
    addPage: () => void,
}) => {

    // States
    const [content, setContent] = useState<string>(page.text);
    const [selectedText, setSelectedText] = useState<string | undefined>('');

    // Content references
    const contentRef = useRef(content);
    const pageTextRef = useRef(page.text);

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)
    const setContext = useContextStore((state) => state.setContext);
    const setSelectedContextText = useContextStore((state) => state.setSelectedText)

    const editor = useEditor({
        extensions: [StarterKit, TextStyle, Color, TextAlign.configure({types: ['heading', 'paragraph']}),
        ],
        content: content,
        onUpdate: ({editor}) => {
            setContent(editor.getHTML());
        },
    });

    // Update refs when state changes
    useEffect(() => {
        contentRef.current = content
    }, [content]);

    useEffect(() => {
        pageTextRef.current = page.text;
    }, [page.text]);


    // Save content on component destroy
    useEffect(() => {
        return () => {
            if (contentRef.current !== pageTextRef.current) {
                updatePage(contentRef.current)
            }
        };
    }, []);

    // Updating content when content changes itself
    useEffect(() => {
        if (editor && content) {

            if (content !== page.text) {
                // @ts-ignore
                editor.commands.setContent(page.text);
            }
        }
    }, [page.text]);

    // Update page text in database with debounce
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (content !== page.text) {
                updatePage(contentRef.current);
            }
        }, 500); // 1 second debounce delay

        // Cleanup function to clear the timeout if scene changes again before timeout completes
        return () => {
            clearTimeout(debounceTimeout)
            // updateScene()
        };
    }, [content]);

    // Functions
    const updatePage = async (content: string) => {
        try {
            // Create a copy of the page with the new scene added
            const updatedPage = {
                ...page, text: content
            };

            // Update database
            const res = await UpdatePage(accessToken, updatedPage, page.id)

            // Update page in Copied Chapter object
            const updatedChapter = {
                ...chapter,
                pages: chapter.pages.map(p =>
                    p.id.toString() === page.id.toString() ? res.data : p
                )
            };

            // Update Draggable list
            const pageIndex = pagesState.findIndex(page => page.id === res.data.id)
            handlers.setItem(pageIndex, res.data)

            // Update local store
            updateChapterInProject(chapter.project, updatedChapter)
        } catch (e) {
            console.log(e)
        }
    }

    const handleContextSet = () => {
        const updatedPage = {...page, scenes: []}
        const updatedChapter = {...chapter, pages: [updatedPage]};
        setContext(updatedChapter)
        // if (selectedText !== '') {
        setSelectedContextText(selectedText);
        // }
    }


    return (

        <div onClick={() => handleContextSet()}
             className={"flex flex-col 2xl:col-span-11  w-full border border-zinc-300 rounded-sm px-3 py-6  items-center bg-white h-fit"}>
            <RichTextEditor editor={editor} style={{border: 1, margin: 0, padding: 0, zIndex: 0}}
                            onClick={() => editor?.chain().focus()}>
                <TextSelectorWrapper setSelectedText={setSelectedText}>
                    <RichTextEditor.Content
                        className=" border border-dashed border-zinc-300 rounded-sm text-[16px] w-180 min-h-215 bg-white cursor-text">
                        <div className={"flex p-3 gap-2"}>
                            <RichTextEditor.ControlsGroup className="z-0">
                                <RichTextEditor.Color color="#F03E3E"/>
                                <RichTextEditor.Color color="#7048E8"/>
                                <RichTextEditor.Color color="#1098AD"/>
                                <RichTextEditor.Color color="#37B24D"/>
                                <RichTextEditor.Color color="#F59F00"/>
                                <RichTextEditor.Color color="#000000"/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1/>
                                <RichTextEditor.H2/>
                                <RichTextEditor.H3/>
                                <RichTextEditor.H4/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold/>
                                <RichTextEditor.Italic/>
                                <RichTextEditor.Underline/>
                                <RichTextEditor.Strikethrough/>
                                <RichTextEditor.ClearFormatting/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.AlignLeft/>
                                <RichTextEditor.AlignCenter/>
                                <RichTextEditor.AlignJustify/>
                                <RichTextEditor.AlignRight/>
                            </RichTextEditor.ControlsGroup>
                        </div>
                    </RichTextEditor.Content>
                </TextSelectorWrapper>
                <div className={"flex justify-between gap-1 mt-2"}>
                    <div onClick={() => {
                        addPage()
                    }}
                         className={"text-xs px-2 py-1 bg-white border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                        Add page
                    </div>
                    <div className={"w-fit flex  pr-6 pb-2"}>
                        <p className={"text-sm text-zinc-600"}>page {index + 1}</p>
                    </div>
                </div>

            </RichTextEditor>

        </div>

    )
}

export default PageEditorSection