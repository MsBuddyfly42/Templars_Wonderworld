window.ACADEMY_MANUALS={
  "basic-reading": {
    "title": "Find evidence in a passage",
    "concepts": "Passage = the text you read. Evidence = exact words that support an answer. Inference = a conclusion supported by clues, rather than a sentence copied from the text.",
    "tools": "Use the passage panel as your source, the response boxes as your notebook, and the check button to compare your work with an explained answer.",
    "example": "Mina saw dark clouds. She put a raincoat in her bag before leaving.",
    "worked": "What weather does Mina expect? Rain. The clouds and raincoat support that inference; the text does not say rain has started.",
    "steps": [
      "Read the passage once for the whole idea.",
      "Read again and underline a useful clue in your notebook.",
      "Answer in your own words.",
      "Return to the text to check whether your answer is supported."
    ],
    "tasks": [
      {
        "prompt": "Find the setting",
        "model": "The place and time of the events",
        "feedback": "A setting tells where and when; a character is who."
      },
      {
        "prompt": "Explain why Mina packed a raincoat",
        "model": "She expects rain because she saw dark clouds",
        "feedback": "Connect both the clue and the action rather than guessing her feelings."
      },
      {
        "prompt": "Write the main idea in one sentence",
        "model": "Mina prepares for possible rainy weather before leaving",
        "feedback": "A main idea covers the whole short passage, not only the bag."
      }
    ]
  },
  "basic-english": {
    "title": "Build and revise clear sentences",
    "concepts": "A sentence expresses a complete thought. Its subject tells who or what; its predicate tells what happens or what is true. Start with a capital and finish with suitable punctuation. Revision changes meaning or clarity; proofreading checks spelling and punctuation.",
    "tools": "Use the sentence builder to see how a subject and action form a complete thought. Use the editor boxes to rewrite sentences.",
    "example": "the lost boys plants seeds",
    "worked": "The Lost Boys plant seeds. The plural subject needs plant, not plants. Capitalize the name and add a period.",
    "steps": [
      "Identify who or what the sentence describes.",
      "Find the action and match the verb to the subject.",
      "Rewrite the whole sentence, keeping the intended meaning.",
      "Read it aloud, then check capitals and punctuation."
    ],
    "tasks": [
      {
        "prompt": "Correct: wendy teach the class",
        "model": "Wendy teaches the class.",
        "feedback": "A singular subject takes teaches in this present-tense sentence."
      },
      {
        "prompt": "Join with because: The path is wet. It rained.",
        "model": "The path is wet because it rained.",
        "feedback": "Because introduces the reason; avoid a sentence fragment."
      },
      {
        "prompt": "Revise the vague sentence: She put it there. Name Wendy, a book and a desk.",
        "model": "Wendy put the book on the desk.",
        "feedback": "Specific nouns let the reader understand who, what and where."
      }
    ]
  },
  "basic-math": {
    "title": "Use equal groups and check calculations",
    "concepts": "Multiplication counts equal groups. Four groups of three means 3 + 3 + 3 + 3 = 12, written 4 × 3 = 12. Division undoes multiplication. Units tell what the number measures.",
    "tools": "The group-count slider controls how many groups are drawn. Each group contains three counters. Your notebook records the equation and units.",
    "example": "Three tables need four chairs each.",
    "worked": "3 × 4 = 12 chairs. Check: 12 ÷ 3 = 4 chairs per table. Addition 3 + 4 would combine unlike quantities instead of counting chairs.",
    "steps": [
      "Name what you need to find and its unit.",
      "Identify the number of groups and the amount in each.",
      "Draw equal groups or write repeated addition.",
      "Calculate, label the unit, and check with the inverse operation."
    ],
    "tasks": [
      {
        "prompt": "Five baskets hold three apples each. How many apples? Write an equation.",
        "model": "5 × 3 = 15 apples",
        "feedback": "There are five equal groups of three, not five plus three."
      },
      {
        "prompt": "Share 18 pencils equally among 6 learners. How many each?",
        "model": "18 ÷ 6 = 3 pencils each",
        "feedback": "Check with 6 × 3 = 18."
      },
      {
        "prompt": "A 7 cm by 4 cm rectangle covers how much area? Explain.",
        "model": "7 × 4 = 28 square centimetres",
        "feedback": "Area counts unit squares. Perimeter would add side lengths instead."
      }
    ]
  },
  "basic-science": {
    "title": "Plan a fair investigation",
    "concepts": "An observation describes what you notice or measure. A prediction says what you expect. The independent variable is what you deliberately change; the dependent variable is what you measure. Keep other important conditions the same for a fair comparison.",
    "tools": "Use the trial recorder to enter repeated observations and calculate a mean. A ruler measures length; a measuring cup measures water volume; a timer measures duration.",
    "example": "Investigate whether light affects bean-plant growth.",
    "worked": "Change light exposure; measure height in centimetres after seven days. Keep bean type, soil, water, pot size and measurement time alike. Several plants per condition reduce the effect of an unusual plant.",
    "steps": [
      "Ask one testable question.",
      "Choose one factor to change and one outcome to measure.",
      "List what you will keep the same and plan repeated trials.",
      "Record measurements with units; compare results without claiming more than the evidence supports."
    ],
    "tasks": [
      {
        "prompt": "For a water-amount experiment, name the changed variable and two controls.",
        "model": "Change water volume; keep light exposure and bean type the same",
        "feedback": "If both water and light change, you cannot isolate the effect of water."
      },
      {
        "prompt": "Three plant heights are 6, 8 and 10 cm. Find their mean.",
        "model": "(6 + 8 + 10) ÷ 3 = 8 cm",
        "feedback": "Add the observations and divide by the number of observations."
      },
      {
        "prompt": "One plant grew taller. Does that prove light caused it? Explain.",
        "model": "No. Repeat with multiple plants and control other conditions.",
        "feedback": "One observation can suggest a pattern but does not establish a cause."
      }
    ]
  },
  "basic-geography": {
    "title": "Read a map and plan a route",
    "concepts": "A map is a simplified representation of a place. A legend explains symbols. A compass shows direction. A scale connects map distance to real distance. A route follows available paths, which can be longer than a straight line.",
    "tools": "The route demonstration uses a scale of one map segment to two kilometres. North is up; east is right. Use the segment control to estimate distance.",
    "example": "The library is two map segments east and one segment north of the school. Each segment represents 2 km.",
    "worked": "A path following those three segments is 3 × 2 = 6 km. Its direction changes from east to north; it is not the straight-line distance.",
    "steps": [
      "Read the legend and compass before choosing a route.",
      "Locate the starting point and destination.",
      "Count the segments along the available path.",
      "Multiply by the scale and label the distance unit."
    ],
    "tasks": [
      {
        "prompt": "A route has four segments at 2 km per segment. Find its length.",
        "model": "4 × 2 = 8 km",
        "feedback": "Apply the scale to every segment."
      },
      {
        "prompt": "A destination is left of the school on a north-up map. Which direction?",
        "model": "West",
        "feedback": "North is up, east right, south down and west left."
      },
      {
        "prompt": "Why might a road route be longer than a straight line?",
        "model": "Roads follow available paths and may turn around obstacles",
        "feedback": "A scale alone does not tell you which route can actually be travelled."
      }
    ]
  },
  "basic-social": {
    "title": "Make a fair community decision",
    "concepts": "A community shares places and responsibilities. A rule guides behaviour; a right protects a freedom or entitlement; a responsibility is something people should do. Decisions are stronger when people hear evidence, consider different needs and explain a fair process.",
    "tools": "Use the vote counter to explore majority decisions. The discussion notebook records who is affected and why a proposal is fair. A majority alone does not make a decision fair to everyone.",
    "example": "The class must choose a quiet reading space or a noisy music space for a shared room.",
    "worked": "Ask readers and musicians what they need, then propose separate times or spaces. A vote can choose a schedule, but the plan should still give both groups access.",
    "steps": [
      "Identify the problem without blaming a person.",
      "List everyone affected, including quieter voices.",
      "Compare at least two choices and their consequences.",
      "Explain a fair rule and how the class will review it."
    ],
    "tasks": [
      {
        "prompt": "Name two groups affected by the shared-room decision.",
        "model": "Readers and musicians",
        "feedback": "Include the people whose activities need different noise levels."
      },
      {
        "prompt": "Propose a plan that gives both groups access.",
        "model": "Schedule quiet reading and music at different times",
        "feedback": "A workable plan specifies how the conflict will be handled."
      },
      {
        "prompt": "Why should a majority listen to a smaller group?",
        "model": "The smaller group also has needs and rights",
        "feedback": "Counting votes helps a decision but does not replace fair treatment."
      }
    ]
  },
  "basic-art": {
    "title": "Design with contrast and communicate an idea",
    "concepts": "Contrast is a noticeable difference, such as light against dark or large against small. Composition is the arrangement of elements. A focal point attracts attention. A design should communicate its purpose, rather than merely include many decorations.",
    "tools": "The contrast demonstration changes the background behind a fixed title. Use the design brief and response boxes to plan an actual poster; describe choices and evaluate readability.",
    "example": "Create a poster inviting learners to a garden clean-up.",
    "worked": "A large dark title on a pale background is easy to read. Put date, time and place below it. One leaf illustration supports the message without covering essential details.",
    "steps": [
      "Write the audience and purpose.",
      "Choose one focal point and a limited palette.",
      "Arrange title, practical details and one supporting image.",
      "Check contrast and ask whether a viewer can find the event details quickly."
    ],
    "tasks": [
      {
        "prompt": "Write a useful title and list three essential event details.",
        "model": "Garden Clean-up: date, time and meeting place",
        "feedback": "An invitation needs information a visitor can act on."
      },
      {
        "prompt": "Explain one contrast choice for readable text.",
        "model": "Dark text on a light background",
        "feedback": "Contrast should make essential content easy to distinguish."
      },
      {
        "prompt": "How would you test the poster before displaying it?",
        "model": "Ask someone to identify the purpose, time and place quickly",
        "feedback": "Judge communication, not whether the viewer likes the same colours."
      }
    ]
  },
  "basic-music": {
    "title": "Count beats and compose a rhythm",
    "concepts": "A beat is a steady pulse. Rhythm is the pattern of sounds and silences over that pulse. In this lesson, a quarter note lasts one beat, a half note two beats and a quarter rest one silent beat. A four-beat bar must total four beats.",
    "tools": "The beat demonstration highlights four beats at an adjustable tempo. BPM means beats per minute. Tap your desk softly or clap; no microphone or music software is needed.",
    "example": "Compose one four-beat bar using two quarter notes and one half note.",
    "worked": "1 + 1 + 2 = 4 beats. Clap on beats 1 and 2, then hold the final sound over beats 3 and 4. A longer note still occupies time.",
    "steps": [
      "Count four steady pulses aloud.",
      "Choose note and rest lengths that total four.",
      "Write the durations before performing the pattern.",
      "Clap the rhythm while keeping the underlying pulse steady."
    ],
    "tasks": [
      {
        "prompt": "Two quarter notes and one half note last how many beats?",
        "model": "1 + 1 + 2 = 4 beats",
        "feedback": "Add durations, not the number of note symbols."
      },
      {
        "prompt": "Write a four-beat bar containing a one-beat rest.",
        "model": "Quarter note, quarter rest, half note: 1 + 1 + 2 = 4",
        "feedback": "The rest occupies one beat even though it is silent."
      },
      {
        "prompt": "Explain the difference between beat and rhythm.",
        "model": "Beat is the steady pulse; rhythm is the pattern of sounds and silences",
        "feedback": "Try counting evenly while clapping an uneven pattern."
      }
    ]
  },
  "greek-mythology": {
    "title": "Interpret a myth and its symbols",
    "concepts": "A myth is a traditional narrative connected to a culture. Greek stories vary by author, place and period. An attribute is a symbol associated with a figure: Athena with wisdom, crafts and the owl; Poseidon with the sea and trident. A symbol suggests an identification but should be checked against context.",
    "tools": "Use the symbol selector to compare possible identifications. The evidence notebook separates what a source depicts from your interpretation. Museum objects and ancient texts can offer different kinds of evidence.",
    "example": "A painted scene shows a figure holding a trident beside waves.",
    "worked": "Poseidon is a reasonable identification because both the trident and sea setting fit his associations. Confirm using the object description; do not claim the image proves the story happened.",
    "steps": [
      "Describe only what you can observe first.",
      "Connect attributes to possible figures.",
      "Support your interpretation with at least two details.",
      "Check the source and acknowledge that traditions have different versions."
    ],
    "tasks": [
      {
        "prompt": "Identify a likely figure shown with an owl and explain.",
        "model": "Athena, because the owl is one of her attributes",
        "feedback": "An attribute supports an identification; an object caption can help confirm it."
      },
      {
        "prompt": "A trident appears beside waves. Name two clues and a likely deity.",
        "model": "Trident and waves suggest Poseidon",
        "feedback": "Use both the object and the setting as evidence."
      },
      {
        "prompt": "Why can two ancient authors tell a myth differently?",
        "model": "Different places, periods and authors developed different versions",
        "feedback": "A difference is not automatically an error; identify each source and compare it."
      }
    ]
  }
};
