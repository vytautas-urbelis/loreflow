import {useState} from "react";
import {ItemInterface} from "../../../../../../models/item/item.tsx";
import CreateItemDialog from "../../../../Dialogs/CreateItemDialog";
import {ProjectInterface} from "../../../../../../models/project";

function SceneItems({item, index, project}: {
    item: ItemInterface,
    index: number;
    project: ProjectInterface;
}) {

    // States
    const [charInfo, setCharacterInfo] = useState<boolean>(false)
    const [isCreateItemOpen, setIsCreateItemOpen] = useState<boolean>(false)

    return (

        <div key={item.id} className={""} onClick={() => setIsCreateItemOpen(true)}>
            <CreateItemDialog isCreateItemOpen={isCreateItemOpen}
                              setIsCreateItemOpen={setIsCreateItemOpen}
                              item={item} project={project}/>
            {item.image ? <img
                    src={item.image}
                    alt={item.name}
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
                                  className={"absolute text-xs bg-zinc-100 top-5 min-w-30 py-1 px-2 rounded-lg z-50"}>{item.name}</div>}
            </div>
        </div>

    );
}

export default SceneItems;