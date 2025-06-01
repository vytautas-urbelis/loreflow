import {SceneInterface} from "../../../../../../models/scene/scene.tsx";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import {RefObject, useEffect, useRef,} from "react";
import {RichTextEditor} from "@mantine/tiptap";
import {ProjectInterface} from "../../../../../../models/project";
import {ChapterInterface} from "../../../../../../models/chapter";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import {UpdateScene} from "../../../../../../axios/Scene.ts";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";

const UpdatedContent = ({scene, setUpdatedContent, updatedContentRef, project, chapter}: {
    scene: SceneInterface,
    setUpdatedContent: (content: string) => void,
    updatedContent: string,
    updatedContentRef: RefObject<string>,
    project: ProjectInterface,
    chapter: ChapterInterface,
}) => {

    // states management

    // References
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken)


    const updateSceneInChapter = useProjectsStore((state) => state.updateSceneInChapter);

    // Text editor definition
    const editor = useEditor({
        extensions: [StarterKit, TextStyle, Color],
        content: updatedContentRef?.current,
        onUpdate: ({editor}) => {
            setUpdatedContent(editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && scene?.updated_content !== editor.getHTML()) {
            editor.commands.setContent(scene.updated_content || '');
        }
    }, [scene?.id, scene?.updated_content, editor]);

    const scrollWindowsUp = () => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = container.offsetHeight;
            window.scrollBy({top: -scrollAmount * 2, behavior: 'smooth'});
        }
    }

    // Functions
    const acceptUpdatedContent = async () => {
        scrollWindowsUp()
        const updatedScene = {...scene, content: scene.updated_content, updated_content: ''}
        const res = await UpdateScene(accessToken, updatedScene, updatedScene.id)
        updateSceneInChapter(project.id, chapter.id, res.data)
    }

    const deleteUpdatedContent = async () => {
        scrollWindowsUp()
        const updatedScene = {...scene, updated_content: ''}
        const res = await UpdateScene(accessToken, updatedScene, updatedScene.id)
        updateSceneInChapter(project.id, chapter.id, res.data)
    }

    // useEffect(() => {
    //     const compareParagraphsInline = (str1: string, str2: string) => {
    //         const wrap = (text: string, color: string) => `<span style="color: ${color}">${text}</span>`;
    //
    //         // Extract paragraphs while preserving content
    //         const extractParagraphs = (html: string) => {
    //             const div = document.createElement("div");
    //             div.innerHTML = html;
    //             return Array.from(div.querySelectorAll("p")).map(p => p.innerHTML.trim());
    //         };
    //
    //         const paras1 = extractParagraphs(str1);
    //         const paras2 = extractParagraphs(str2);
    //
    //         console.log(paras1, paras2);
    //
    //         const set1 = new Set(paras1);
    //         const set2 = new Set(paras2);
    //
    //         const highlightedStr1 = paras1.map(p => {
    //             return set2.has(p) ? p : wrap(p, "#D32F2F"); // Red for str1-only
    //         }).join("<br><br>");
    //
    //         const highlightedStr2 = paras2.map(p => {
    //             return set1.has(p) ? p : wrap(p, "#388E3C"); // Green for str2-only
    //         }).join("<br><br>");
    //
    //         const updatedScene = {...scene, content: highlightedStr1, updated_content: highlightedStr2}
    //         // console.log(updatedScene)
    //
    //         if (highlightedStr1 !== '' || highlightedStr2 !== '') {
    //             updateSceneInChapter(project.id, chapter.id, updatedScene)
    //         }
    //
    //         // return {
    //         //     highlightedStr1,
    //         //     highlightedStr2
    //         // };
    //
    //
    //     }
    //     // compareParagraphsInline(scene.content, scene.updated_content)
    //
    // }, [scene.updated_content, scene.content]);


    return (<>
        {scene.updated_content && scene.updated_content !== '' && scene.updated_content !== '<p></p>' &&
            <div ref={containerRef}
                 className={"rounded-md border border-dashed border-orange-300 border-dashed w-full mt-4"}>
                <div className={" text-xs border border-orange-200 rounded-md w-fit px-2 bg-orange-50 m-2"}>Updated
                    content
                </div>
                <RichTextEditor style={{border: "none", padding: "0", margin: "0"}} key={scene.id} editor={editor}
                                className={""}>
                    <RichTextEditor.Content style={{margin: "0", padding: "0"}}
                                            className={" rounded-md text-base"}>
                    </RichTextEditor.Content>
                </RichTextEditor>
                <div className={"w-full flex justify-end"}>
                    <div onClick={deleteUpdatedContent}
                         className={" text-sm border border-red-300 rounded-md w-fit px-2 bg-red-50 m-2 text-red-700 cursor-pointer"}>Delete
                    </div>
                    <div onClick={acceptUpdatedContent}
                         className={" text-sm border border-green-300 rounded-md w-fit px-2 bg-green-50 m-2 text-green-700 cursor-pointer"}>Accept
                    </div>
                </div>
            </div>
        }</>)
}

export default UpdatedContent