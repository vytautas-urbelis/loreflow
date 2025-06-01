import {useState} from 'react';
import {Dialog, DialogPanel, Tab} from '@headlessui/react';
import {CharacterInterface} from '../../../../models/character/character.ts';
import {CgGhostCharacter} from "react-icons/cg";
import {FiUser} from "react-icons/fi";
import {BsPerson, BsPersonBadge} from "react-icons/bs";
import {GiRelationshipBounds} from "react-icons/gi";

const CharacterCard = ({character, isCharacterCardOpen, setIsCharacterCardOpen}: {
    character: CharacterInterface,
    isCharacterCardOpen: boolean,
    setIsCharacterCardOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Dialog
            open={isCharacterCardOpen}
            onClose={() => setIsCharacterCardOpen(false)}
            className="fixed inset-0 z-50 flex w-screen items-start mt-10 justify-center p-4 md:p-6"
        >
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true"/>

            <DialogPanel className="w-full max-w-4xl transform overflow-hidden transition-all">
                <div
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 transition-all duration-300">
                    {/* Character Card Header - Always visible */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex items-center space-x-4">
                        {/* Character Image/Avatar */}
                        {character.image ? (
                            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white/70 shadow-md">
                                <img
                                    src={character.image}
                                    alt={character.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="h-20 w-20 rounded-full bg-white flex items-center justify-center border-4 border-white/70 shadow-md">
                                <CgGhostCharacter className="h-10 w-10 text-indigo-500"/>
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white">{character.name}</h3>
                            <p className="text-indigo-100 text-sm mt-1">
                                {character.role.type && `${character.role.type} • `}
                                {character.demographics.age && `${character.demographics.age} • `}
                                {character.demographics.nationality}
                            </p>
                        </div>

                        <div
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                    </div>

                    {/* Expandable detailed content */}
                    {isExpanded && (
                        <div className="transition-all duration-500 ease-in-out">
                            <Tab.Group>
                                <Tab.List className="flex p-1 space-x-1 bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <Tab className={({selected}) =>
                                        `w-full py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                                        ${selected
                                            ? 'bg-white text-indigo-700 shadow-md'
                                            : 'text-gray-600 hover:text-indigo-700 hover:bg-white/60'
                                        }`
                                    }>
                                        <FiUser className="w-4 h-4"/>
                                        Basic Info
                                    </Tab>
                                    <Tab className={({selected}) =>
                                        `w-full py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                                        ${selected
                                            ? 'bg-white text-indigo-700 shadow-md'
                                            : 'text-gray-600 hover:text-indigo-700 hover:bg-white/60'
                                        }`
                                    }>
                                        <BsPerson className="w-4 h-4"/>
                                        Role & Demographics
                                    </Tab>
                                    <Tab className={({selected}) =>
                                        `w-full py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                                        ${selected
                                            ? 'bg-white text-indigo-700 shadow-md'
                                            : 'text-gray-600 hover:text-indigo-700 hover:bg-white/60'
                                        }`
                                    }>
                                        <BsPersonBadge className="w-4 h-4"/>
                                        Appearance & Traits
                                    </Tab>
                                    <Tab className={({selected}) =>
                                        `w-full py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                                        ${selected
                                            ? 'bg-white text-indigo-700 shadow-md'
                                            : 'text-gray-600 hover:text-indigo-700 hover:bg-white/60'
                                        }`
                                    }>
                                        <GiRelationshipBounds className="w-4 h-4"/>
                                        Backstory & Relations
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="mt-2">
                                    {/* Basic Info Panel */}
                                    <Tab.Panel className="p-6 focus:outline-none">
                                        <div className="space-y-6">
                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-2">Character
                                                    Arc</h4>
                                                <p className="text-gray-700 leading-relaxed">{character.character_arc || 'Not defined'}</p>
                                            </div>

                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-2">Symbolism</h4>
                                                <p className="text-gray-700 leading-relaxed">{character.symbolism || 'Not defined'}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3 ml-1">Aliases</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {character.aliases && character.aliases.length > 0 ? (
                                                        character.aliases.map((alias, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm"
                                                            >
                                                                {alias}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic ml-1">No aliases</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>

                                    {/* Role & Demographics Panel */}
                                    <Tab.Panel className="p-6 focus:outline-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3">Role</h4>
                                                <div className="space-y-3">
                                                    <div
                                                        className="flex justify-between items-center pb-2 border-b border-indigo-100">
                                                        <span className="text-sm text-gray-500 font-medium">Type:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.role.type || 'Not specified'}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center pb-2 border-b border-indigo-100">
                                                        <span
                                                            className="text-sm text-gray-500 font-medium">Importance:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.role.importance || 'Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-500 font-medium">Character Type:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.role.dynamic_static || 'Not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3">Demographics</h4>
                                                <div className="space-y-3">
                                                    <div
                                                        className="flex justify-between items-center pb-2 border-b border-indigo-100">
                                                        <span className="text-sm text-gray-500 font-medium">Age:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.demographics.age || 'Not specified'}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center pb-2 border-b border-indigo-100">
                                                        <span
                                                            className="text-sm text-gray-500 font-medium">Gender:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.demographics.gender || 'Not specified'}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center pb-2 border-b border-indigo-100">
                                                        <span
                                                            className="text-sm text-gray-500 font-medium">Ethnicity:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.demographics.ethnicity || 'Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span
                                                            className="text-sm text-gray-500 font-medium">Nationality:</span>
                                                        <span
                                                            className="text-sm font-semibold text-gray-800">{character.demographics.nationality || 'Not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>

                                    {/* Appearance & Traits Panel */}
                                    <Tab.Panel className="p-6 focus:outline-none">
                                        <div className="space-y-6">
                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3">Appearance</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Physical</h5>
                                                        <p className="text-gray-700 leading-relaxed bg-white/60 p-3 rounded-md">{character.appearance.physical || 'Not described'}</p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Attire</h5>
                                                        <p className="text-gray-700 leading-relaxed bg-white/60 p-3 rounded-md">{character.appearance.attire || 'Not described'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3 ml-1">Personality</h4>

                                                <div className="mb-5">
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">Traits</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {character.personality.traits && character.personality.traits.length > 0 ? (
                                                            character.personality.traits.map((trait, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm"
                                                                >
                                                                    {trait}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500 italic ml-1">None defined</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div
                                                        className="bg-indigo-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Motivations</h5>
                                                        {character.personality.motivations && character.personality.motivations.length > 0 ? (
                                                            <ul className="list-disc list-inside space-y-1.5">
                                                                {character.personality.motivations.map((motivation, index) => (
                                                                    <li key={index}
                                                                        className="text-gray-700">{motivation}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500 italic">None defined</p>
                                                        )}
                                                    </div>

                                                    <div
                                                        className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-100">
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Flaws</h5>
                                                        {character.personality.flaws && character.personality.flaws.length > 0 ? (
                                                            <ul className="list-disc list-inside space-y-1.5">
                                                                {character.personality.flaws.map((flaw, index) => (
                                                                    <li key={index}
                                                                        className="text-gray-700">{flaw}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500 italic">None defined</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div
                                                    className="mt-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Moral
                                                        Alignment</h5>
                                                    <p className="text-gray-800 font-medium">{character.personality.moral_alignment || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>

                                    {/* Backstory & Relations Panel */}
                                    <Tab.Panel className="p-6 focus:outline-none">
                                        <div className="space-y-6">
                                            <div
                                                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3">Backstory</h4>

                                                <div className="mb-5">
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Key
                                                        Events</h5>
                                                    {character.backstory.key_events && character.backstory.key_events.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {character.backstory.key_events.map((event, index) => (
                                                                <div key={index}
                                                                     className="bg-white p-3 rounded-md border border-indigo-100 shadow-sm">
                                                                    <p className="text-gray-700">{event}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">No key events defined</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Cultural
                                                        Context</h5>
                                                    <p className="text-gray-700 bg-white/60 p-3 rounded-md">{character.backstory.cultural_context || 'Not defined'}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-indigo-700 mb-3 ml-1">Relationships</h4>

                                                {character.relationships && character.relationships.length > 0 && character.relationships[0].name ? (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {character.relationships.map((rel, index) => (
                                                            <div key={index}
                                                                 className="border border-indigo-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                                                <div className="p-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <h5 className="font-medium text-indigo-700">{rel.name}</h5>
                                                                        <span
                                                                            className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                                                            {rel.relation}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{rel.dynamic}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                                                        <p className="text-gray-500">No relationships defined</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    )}
                </div>
            </DialogPanel>
        </Dialog>
    );
};

export default CharacterCard;
