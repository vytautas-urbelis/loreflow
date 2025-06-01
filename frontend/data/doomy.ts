// import {ResponseCharacterData} from "../src/models/responses/character.ts";
//
// export const characters: ResponseCharacterData[] = [
//     {
//         "name": "The Little Prince",
//         "aliases": [],
//         "role": {
//             "type": "protagonist",
//             "importance": "primary",
//             "dynamic_static": "dynamic"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "small, golden curls",
//             "attire": "green coat, white scarf, blue pants, red hat"
//         },
//         "personality": {
//             "traits": ["curious", "innocent", "imaginative"],
//             "motivations": ["exploring the universe", "understanding life"],
//             "flaws": ["naive"],
//             "moral_alignment": "neutral good"
//         },
//         "backstory": {
//             "key_events": ["left his planet", "traveled to Earth"],
//             "cultural_context": "unknown"
//         },
//         "relationships": [
//             {
//                 "name": "The Narrator",
//                 "relation": "friend",
//                 "dynamic": "supportive"
//             },
//             {
//                 "name": "The Rose",
//                 "relation": "love interest",
//                 "dynamic": "complex"
//             }
//         ],
//         "symbolism": "Represents innocence and curiosity",
//         "character_arc": "Learns about life and relationships through his journey"
//     },
//     {
//         "name": "The Narrator",
//         "aliases": ["The Aviator"],
//         "role": {
//             "type": "supporting",
//             "importance": "secondary",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["reflective", "nostalgic"],
//             "motivations": ["sharing the Little Prince's story"],
//             "flaws": ["unknown"],
//             "moral_alignment": "neutral good"
//         },
//         "backstory": {
//             "key_events": ["met the Little Prince in the desert"],
//             "cultural_context": "unknown"
//         },
//         "relationships": [
//             {
//                 "name": "The Little Prince",
//                 "relation": "friend",
//                 "dynamic": "supportive"
//             }
//         ],
//         "symbolism": "Represents the adult perspective",
//         "character_arc": "Reflects on his encounter with the Little Prince"
//     },
//     {
//         "name": "The Rose",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "secondary",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "female",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "beautiful flower",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["vain", "sensitive"],
//             "motivations": ["being admired"],
//             "flaws": ["vanity"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": ["met the Little Prince"],
//             "cultural_context": "unknown"
//         },
//         "relationships": [
//             {
//                 "name": "The Little Prince",
//                 "relation": "love interest",
//                 "dynamic": "complex"
//             }
//         ],
//         "symbolism": "Represents beauty and vanity",
//         "character_arc": "Learns about love and relationships"
//     },
//     {
//         "name": "The King",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "royal purple and ermine"
//         },
//         "personality": {
//             "traits": ["authoritative", "proud"],
//             "motivations": ["being obeyed"],
//             "flaws": ["pride"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents authority",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Conceited Man",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "hat for salutes"
//         },
//         "personality": {
//             "traits": ["conceited", "self-absorbed"],
//             "motivations": ["being admired"],
//             "flaws": ["conceit"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents conceit",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Tippler",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["sad", "ashamed"],
//             "motivations": ["forgetting his shame"],
//             "flaws": ["drinking"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents escapism",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Businessman",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["busy", "materialistic"],
//             "motivations": ["owning stars"],
//             "flaws": ["materialism"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents materialism",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Lamplighter",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["dutiful", "tired"],
//             "motivations": ["following orders"],
//             "flaws": ["fatigue"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents duty",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Geographer",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["scholarly", "curious"],
//             "motivations": ["recording geography"],
//             "flaws": ["unknown"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [],
//         "symbolism": "Represents scholarship",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Fox",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "secondary",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "unknown",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "golden fur",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["wise", "lonely"],
//             "motivations": ["being tamed"],
//             "flaws": ["unknown"],
//             "moral_alignment": "neutral good"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [
//             {
//                 "name": "The Little Prince",
//                 "relation": "friend",
//                 "dynamic": "supportive"
//             }
//         ],
//         "symbolism": "Represents wisdom and friendship",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "The Snake",
//         "aliases": [],
//         "role": {
//             "type": "supporting",
//             "importance": "minor",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "unknown",
//             "gender": "unknown",
//             "ethnicity": "unknown",
//             "nationality": "unknown"
//         },
//         "appearance": {
//             "physical": "golden, coiled",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["mysterious", "powerful"],
//             "motivations": ["helping the Little Prince"],
//             "flaws": ["unknown"],
//             "moral_alignment": "neutral"
//         },
//         "backstory": {
//             "key_events": [],
//             "cultural_context": "unknown"
//         },
//         "relationships": [
//             {
//                 "name": "The Little Prince",
//                 "relation": "acquaintance",
//                 "dynamic": "mysterious"
//             }
//         ],
//         "symbolism": "Represents power and mystery",
//         "character_arc": "unknown"
//     },
//     {
//         "name": "Antoine de Saint-Exupéry",
//         "aliases": [],
//         "role": {
//             "type": "author",
//             "importance": "primary",
//             "dynamic_static": "static"
//         },
//         "demographics": {
//             "age": "1900-1944",
//             "gender": "male",
//             "ethnicity": "unknown",
//             "nationality": "French"
//         },
//         "appearance": {
//             "physical": "unknown",
//             "attire": "unknown"
//         },
//         "personality": {
//             "traits": ["adventurous", "creative"],
//             "motivations": ["writing and flying"],
//             "flaws": ["unknown"],
//             "moral_alignment": "neutral good"
//         },
//         "backstory": {
//             "key_events": ["flew airplanes", "wrote The Little Prince"],
//             "cultural_context": "French aviator and writer"
//         },
//         "relationships": [],
//         "symbolism": "Represents adventure and creativity",
//         "character_arc": "unknown"
//     }
// ]
//
