import {toast} from "react-toastify";
import {CharacterInterface} from "../models/character/character.ts";
import {IoIosCheckmarkCircle} from "react-icons/io";
import {ItemInterface} from "../models/item/item.tsx";
import {LocationInterface} from "../models/location/location.tsx";
import {SceneInterface} from "../models/scene/scene.tsx";

export const characterNotification = (character: CharacterInterface) => {
    toast(<><IoIosCheckmarkCircle className={"text-2xl mr-2 text-green-600"}/>
        <div className={"text-sm"}>The Character <span className={"font-semibold"}>{character.name} </span>was created.
        </div>
    </>);
}

export const itemNotification = (item: ItemInterface) => {
    toast(<><IoIosCheckmarkCircle className={"text-2xl mr-2 text-green-600"}/>
        <div className={"text-sm"}>The Item <span className={"font-semibold"}>{item.name} </span>was created.
        </div>
    </>);
}

export const locationNotification = (location: LocationInterface) => {
    toast(<><IoIosCheckmarkCircle className={"text-2xl mr-2 text-green-600"}/>
        <div className={"text-sm"}>The Location <span className={"font-semibold"}>{location.name} </span>was created.
        </div>
    </>);
}

export const sceneNotification = (scene: SceneInterface) => {
    toast(<><IoIosCheckmarkCircle className={"text-2xl mr-2 text-green-600"}/>
        <div className={"text-sm"}>The Scene <span className={"font-semibold"}>{scene.title} </span>was created.
        </div>
    </>);
}