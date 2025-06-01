import {CharacterInterface} from "../../../../../../models/character/character.ts";
import {useState} from "react";
import CreateCharacterDialog from "../../../../Dialogs/CreateCharacterDialog";
import {ProjectInterface} from "../../../../../../models/project";

function SceneCharacters({character, index, project}: {
    character: CharacterInterface,
    index: number;
    project: ProjectInterface;
}) {

    // States
    const [charInfo, setCharacterInfo] = useState<boolean>(false)
    const [isCreateCharacterOpen, setIsCreateCharacterOpen] = useState<boolean>(false)

    return (

        <div className={""} onClick={() => setIsCreateCharacterOpen(true)}>
            <CreateCharacterDialog isCreateCharacterOpen={isCreateCharacterOpen}
                                   setIsCreateCharacterOpen={setIsCreateCharacterOpen}
                                   character={character} project={project}/>
            {character.image ? <img
                    src={character.image}
                    alt={character.name}
                    onMouseEnter={() => setCharacterInfo(true)}
                    onMouseLeave={() => setCharacterInfo(false)}
                    style={{left: `${index * 11}px`}}
                    className={`size-4 bg-zinc-100 rounded-md border border-zinc-300 absolute hover:z-20 hover:border-zinc-400 object-cover`}>
                </img>
                :
                <div
                    onMouseEnter={() => setCharacterInfo(true)}
                    onMouseLeave={() => setCharacterInfo(false)}
                    style={{left: `${index * 11}px`}}
                    className={`size-4 bg-zinc-100 rounded-md border border-zinc-300 absolute hover:z-20 hover:border-zinc-400`}>
                </div>}
            <div className={"relative w-full"}>
                {charInfo && <div style={{left: `${index * 11}px`}}
                                  className={"absolute text-xs bg-zinc-100 top-5 min-w-30 py-1 px-2 rounded-lg z-50"}>{character.name}</div>}
            </div>
        </div>

    );
}

export default SceneCharacters;