const fs = require('fs');
const path = require('path');
const dir = 'D:/Development/EducationPlatform/modules/science-explorer/seeds';

const A1 = [
  {
    "id": "se-a1-001",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "plant-life",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.08,
    "prompt": "What do plants need to grow?",
    "choices": [
      { "key": "A", "text": "Sunlight and water only" },
      { "key": "B", "text": "Sunlight, water, and air" },
      { "key": "C", "text": "Just water" },
      { "key": "D", "text": "Just soil" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "Plants need more than just sunlight and water. They also need air!",
      "C": "Water alone is not enough. Think about what else plants get from their environment.",
      "D": "Soil provides nutrients, but plants need sunlight, water, and air too!"
    },
    "explanation": "Plants need sunlight (for photosynthesis), water (to transport nutrients), and air (carbon dioxide for making food). Soil provides minerals and support.",
    "explanationSteps": [
      "Plants use sunlight to make their own food through photosynthesis.",
      "Water carries nutrients from the soil throughout the plant.",
      "Plants take in carbon dioxide from the air to help make food."
    ],
    "hints": [
      "Think about what happens to a plant if you leave it in a dark closet.",
      "What do we need to give a potted plant to keep it alive?"
    ],
    "tags": ["plants", "basic-needs", "biology"],
    "estimatedTimeSec": 25
  },
  {
    "id": "se-a1-002",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "animal-classification",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.1,
    "prompt": "Which animal has fur and feeds its babies milk?",
    "choices": [
      { "key": "A", "text": "A snake" },
      { "key": "B", "text": "A fish" },
      { "key": "C", "text": "A cat" },
      { "key": "D", "text": "A bird" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "Snakes are reptiles. They have scales, not fur, and lay eggs.",
      "B": "Fish live in water, have scales and fins, and do not feed their babies milk.",
      "D": "Birds have feathers and lay eggs. They do not have fur or make milk."
    },
    "explanation": "Mammals like cats have fur or hair and produce milk to feed their babies. Snakes are reptiles, fish are fish, and birds are birds.",
    "explanationSteps": [
      "Animals with fur that feed milk to their babies are called mammals.",
      "Cats, dogs, and humans are all mammals.",
      "Snakes, fish, and birds are not mammals."
    ],
    "hints": [
      "Think about animals that are warm and fuzzy.",
      "Which of these animals can you find living inside peoples homes as a pet?"
    ],
    "tags": ["animals", "mammals", "classification"],
    "estimatedTimeSec": 20
  },
  {
    "id": "se-a1-003",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "plant-life",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.12,
    "prompt": "What part of a plant takes in water from the soil?",
    "choices": [
      { "key": "A", "text": "The leaves" },
      { "key": "B", "text": "The roots" },
      { "key": "C", "text": "The flower" },
      { "key": "D", "text": "The stem" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "Leaves use sunlight to make food, but they do not soak up water from the ground.",
      "C": "Flowers help the plant make seeds and reproduce, they do not take in water.",
      "D": "The stem carries water up, but it is the roots that first collect it from the soil."
    },
    "explanation": "Roots grow underground and absorb water and minerals from the soil. The stem then carries the water up to the rest of the plant.",
    "explanationSteps": [
      "Roots are the part of the plant that grows underground.",
      "Roots soak up water and nutrients from the soil.",
      "The water travels up the stem to reach the leaves and flowers."
    ],
    "hints": [
      "Which part of a plant is hidden under the ground?",
      "Think about what holds a plant in place when you try to pull it."
    ],
    "tags": ["plants", "roots", "plant-parts"],
    "estimatedTimeSec": 20
  },
  {
    "id": "se-a1-004",
    "moduleId": "science.explorer",
    "skill": "earth-space",
    "subSkill": "solar-system",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.1,
    "prompt": "What is the big, bright star that gives us light and warmth during the day?",
    "choices": [
      { "key": "A", "text": "The Moon" },
      { "key": "B", "text": "The Sun" },
      { "key": "C", "text": "Venus" },
      { "key": "D", "text": "A flashlight" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "The Moon shines at night, but it does not give off its own light. It reflects the Sun light.",
      "C": "Venus is a planet you can sometimes see at night, but it is not bright enough to light up our day.",
      "D": "A flashlight is not a star in the sky! The Sun is the real source of daytime light."
    },
    "explanation": "The Sun is a star - a huge ball of hot, glowing gas. It gives Earth light and heat, which makes life possible.",
    "explanationSteps": [
      "The Sun is the closest star to Earth.",
      "It gives off light and heat that reaches our planet.",
      "Without the Sun, Earth would be dark and cold."
    ],
    "hints": [
      "What warms your face when you go outside on a sunny day?",
      "What wakes up the rooster in the morning?"
    ],
    "tags": ["sun", "solar-system", "daytime"],
    "estimatedTimeSec": 15
  },
  {
    "id": "se-a1-005",
    "moduleId": "science.explorer",
    "skill": "earth-space",
    "subSkill": "weather-climate",
    "level": "A1",
    "questionType": "true-false",
    "difficulty": 0.05,
    "prompt": "True or False: Rain falls from clouds in the sky.",
    "choices": [
      { "key": "A", "text": "True" },
      { "key": "B", "text": "False" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "B": "Rain actually does come from clouds! Clouds are made of tiny water droplets that join together and fall as rain."
    },
    "explanation": "When water droplets in clouds get heavy enough, they fall to the ground as rain. This is part of the water cycle.",
    "explanationSteps": [
      "Clouds are made of tiny water drops.",
      "When the drops get big and heavy, they fall as rain.",
      "This is how we get rain to water the plants and fill our rivers."
    ],
    "hints": [
      "What do you see in the sky before it starts raining?",
      "Where do puddles come from after a storm?"
    ],
    "tags": ["weather", "rain", "clouds", "water-cycle"],
    "estimatedTimeSec": 10
  },
  {
    "id": "se-a1-006",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "animal-classification",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "Which of these animals lives in water and has gills to breathe?",
    "choices": [
      { "key": "A", "text": "A whale" },
      { "key": "B", "text": "A fish" },
      { "key": "C", "text": "A frog" },
      { "key": "D", "text": "A duck" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "Whales live in water but they are mammals and breathe air through lungs, not gills.",
      "C": "Frogs can live in water, but they breathe through their skin and have lungs, not gills (as adults).",
      "D": "Ducks are birds. They have lungs and breathe air. They visit water but do not live in it full time."
    },
    "explanation": "Fish have gills that let them take in oxygen from water. Whales are mammals that must come to the surface to breathe air.",
    "explanationSteps": [
      "Gills are special body parts that let fish breathe underwater.",
      "Fish take water into their mouths and pass it over their gills.",
      "The gills take oxygen out of the water so the fish can breathe."
    ],
    "hints": [
      "Think of a pet that lives in a fish tank or bowl.",
      "Which animal has fins and a tail instead of legs?"
    ],
    "tags": ["fish", "gills", "aquatic-animals"],
    "estimatedTimeSec": 25
  },
  {
    "id": "se-a1-007",
    "moduleId": "science.explorer",
    "skill": "physical-science",
    "subSkill": "states-of-matter",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.18,
    "prompt": "Ice is water that has turned into a __________.",
    "choices": [
      { "key": "A", "text": "liquid" },
      { "key": "B", "text": "solid" },
      { "key": "C", "text": "gas" },
      { "key": "D", "text": "juice" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "Liquid water flows and takes the shape of its container. Ice is hard and keeps its shape.",
      "C": "A gas is invisible like steam. Ice is definitely not a gas!",
      "D": "Juice is a drink. Ice is frozen water, not juice."
    },
    "explanation": "Ice is water in its solid state. When water gets very cold (below 0 C or 32 F) it freezes and becomes solid ice.",
    "explanationSteps": [
      "Water can be a liquid (what we drink), a solid (ice), or a gas (steam).",
      "When liquid water gets cold enough, it freezes into solid ice.",
      "When ice warms up, it melts back into liquid water."
    ],
    "hints": [
      "What happens to water in an ice cube tray when you put it in the freezer?",
      "Is an ice cube hard or soft? Can you hold it in your hand?"
    ],
    "tags": ["ice", "states-of-matter", "solid", "freezing"],
    "estimatedTimeSec": 20
  },
  {
    "id": "se-a1-008",
    "moduleId": "science.explorer",
    "skill": "earth-space",
    "subSkill": "seasons",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.1,
    "prompt": "In which season do leaves change color and fall off trees?",
    "choices": [
      { "key": "A", "text": "Spring" },
      { "key": "B", "text": "Summer" },
      { "key": "C", "text": "Fall (Autumn)" },
      { "key": "D", "text": "Winter" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "In spring, new leaves grow and flowers bloom. Leaves do not fall off in spring.",
      "B": "Summer is warm and sunny with lots of green leaves on trees.",
      "D": "In winter, trees are bare and cold. The leaves already fell in autumn."
    },
    "explanation": "In autumn (also called fall) the weather gets cooler and days get shorter. Trees stop making food and their leaves change color before falling off.",
    "explanationSteps": [
      "In fall, there is less sunlight for trees to use.",
      "Trees stop making green chlorophyll, so other colors show through.",
      "The leaves turn red, orange, and yellow, then fall to the ground."
    ],
    "hints": [
      "What season comes after summer?",
      "When do you see piles of colorful leaves on the ground?"
    ],
    "tags": ["seasons", "fall", "autumn", "leaves", "trees"],
    "estimatedTimeSec": 15
  },
  {
    "id": "se-a1-009",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "food-chains",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.2,
    "prompt": "In a food chain, which living thing makes its own food using sunlight?",
    "choices": [
      { "key": "A", "text": "A rabbit" },
      { "key": "B", "text": "A mushroom" },
      { "key": "C", "text": "A plant" },
      { "key": "D", "text": "A fox" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "Rabbits eat plants, they do not make their own food.",
      "B": "Mushrooms are decomposers that break down dead things for food.",
      "D": "Foxes hunt and eat other animals. They do not make their own food."
    },
    "explanation": "Plants are called producers because they use sunlight, water, and air to make their own food through photosynthesis. Animals are consumers that eat plants or other animals.",
    "explanationSteps": [
      "Plants use sunlight to make their own food - this is called photosynthesis.",
      "Animals cannot make their own food, so they must eat plants or other animals.",
      "That is why plants are at the start of almost every food chain."
    ],
    "hints": [
      "Think about who makes dinner for the rest of the food chain!",
      "Which living thing can sit in one spot and still get all the food it needs?"
    ],
    "tags": ["food-chain", "producers", "photosynthesis", "plants"],
    "estimatedTimeSec": 25
  },
  {
    "id": "se-a1-010",
    "moduleId": "science.explorer",
    "skill": "physical-science",
    "subSkill": "forces-motion",
    "level": "A1",
    "questionType": "true-false",
    "difficulty": 0.08,
    "prompt": "True or False: A ball will keep rolling forever if nobody stops it.",
    "choices": [
      { "key": "A", "text": "True" },
      { "key": "B", "text": "False" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "In real life, forces like friction and air resistance slow things down and make them stop."
    },
    "explanation": "Forces like friction (rubbing against the ground) and air resistance slow the ball down.",
    "explanationSteps": [
      "When a ball rolls, it rubs against the ground - this is called friction.",
      "Friction creates heat and slows the ball down.",
      "Air also pushes against the ball, slowing it down a little."
    ],
    "hints": [
      "What happens to a toy car when you push it on the carpet? Does it stop by itself?",
      "Think about why you need to keep pushing a swing to keep it going."
    ],
    "tags": ["motion", "forces", "friction"],
    "estimatedTimeSec": 15
  },
  {
    "id": "se-a1-011",
    "moduleId": "science.explorer",
    "skill": "earth-space",
    "subSkill": "moon-phases",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "What shape is the Moon when it is full?",
    "choices": [
      { "key": "A", "text": "A half circle" },
      { "key": "B", "text": "A complete circle" },
      { "key": "C", "text": "A crescent (banana shape)" },
      { "key": "D", "text": "A square" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "A half circle is called a half moon, not a full moon.",
      "C": "A crescent moon is a thin sliver shape, like a banana. That is not a full moon.",
      "D": "The Moon is always round, not square! Its shape does not change, just how much we can see."
    },
    "explanation": "A full moon looks like a complete circle in the sky. The Moon itself is always round but we only see the part lit up by the Sun.",
    "explanationSteps": [
      "The Moon is always a round ball, like a sphere.",
      "During a full moon, the Sun lights up the entire side facing Earth.",
      "That is why we see a complete bright circle in the night sky."
    ],
    "hints": [
      "Think about when the Moon looks like a big, round pizza in the sky.",
      "What shape is a ball? The Moon is like a ball in space."
    ],
    "tags": ["moon", "moon-phases", "full-moon"],
    "estimatedTimeSec": 20
  },
  {
    "id": "se-a1-012",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "human-body-systems",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.12,
    "prompt": "Which body part pumps blood all around your body?",
    "choices": [
      { "key": "A", "text": "Your brain" },
      { "key": "B", "text": "Your heart" },
      { "key": "C", "text": "Your stomach" },
      { "key": "D", "text": "Your lungs" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "The brain controls thinking and tells your body what to do, but it does not pump blood.",
      "C": "The stomach helps digest food, not pump blood.",
      "D": "Lungs help you breathe by taking in oxygen, but they do not pump blood."
    },
    "explanation": "Your heart is a powerful muscle that pumps blood through blood vessels to every part of your body. It beats about 100,000 times every day!",
    "explanationSteps": [
      "The heart is a special muscle located in your chest.",
      "It squeezes and relaxes to push blood through tubes called blood vessels.",
      "Blood carries oxygen and nutrients to all parts of your body."
    ],
    "hints": [
      "Put your hand on your chest. Can you feel something going bump-bump?",
      "Which organ works harder when you run and play?"
    ],
    "tags": ["heart", "human-body", "circulatory-system"],
    "estimatedTimeSec": 20
  },
  {
    "id": "se-a1-013",
    "moduleId": "science.explorer",
    "skill": "earth-space",
    "subSkill": "water-cycle",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.2,
    "prompt": "When the Sun heats puddles after rain, where does the water go?",
    "choices": [
      { "key": "A", "text": "It sinks into a worm hole" },
      { "key": "B", "text": "It disappears forever" },
      { "key": "C", "text": "It turns into vapor and goes into the air" },
      { "key": "D", "text": "It turns into ice" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "There are no worm holes! Water actually evaporates into the air.",
      "B": "Water does not disappear forever. It just changes into vapor and goes into the air.",
      "D": "The Sun is hot, so it would not turn water into ice. Heat makes ice melt!"
    },
    "explanation": "The Sun heat causes water to evaporate - it turns from a liquid into an invisible gas called water vapor that rises into the air. This is part of the water cycle.",
    "explanationSteps": [
      "The Sun heats the water in the puddle.",
      "The water turns into water vapor (a gas).",
      "The vapor rises into the sky and forms clouds."
    ],
    "hints": [
      "Have you seen steam rise from a hot sidewalk after rain?",
      "Think about what happens to a wet towel left outside on a sunny day."
    ],
    "tags": ["water-cycle", "evaporation", "puddles"],
    "estimatedTimeSec": 25
  },
  {
    "id": "se-a1-014",
    "moduleId": "science.explorer",
    "skill": "physical-science",
    "subSkill": "simple-machines",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.22,
    "prompt": "A seesaw on a playground is an example of what simple machine?",
    "choices": [
      { "key": "A", "text": "A pulley" },
      { "key": "B", "text": "A lever" },
      { "key": "C", "text": "A wheel" },
      { "key": "D", "text": "A ramp" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "A pulley uses a rope and wheel to lift things. A seesaw does not have a rope.",
      "C": "A seesaw does not roll! Wheels help things move by rolling.",
      "D": "A ramp is a slanted surface that helps move things up and down. A seesaw goes up and down in place."
    },
    "explanation": "A seesaw is a lever - a simple machine that has a bar that pivots on a point called a fulcrum. When one person pushes down, the other goes up.",
    "explanationSteps": [
      "A seesaw has a board that rests on a middle point called a fulcrum.",
      "When you push down on your end, the other end goes up.",
      "This makes it easier to lift someone on the other side."
    ],
    "hints": [
      "Think about how you make your friend go up when you are on a seesaw.",
      "What happens if you sit very close to the middle versus at the very end?"
    ],
    "tags": ["simple-machines", "lever", "seesaw", "playground"],
    "estimatedTimeSec": 25
  },
  {
    "id": "se-a1-015",
    "moduleId": "science.explorer",
    "skill": "life-science",
    "subSkill": "ecosystems",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "Where would you find a fish, seaweed, and crabs living together?",
    "choices": [
      { "key": "A", "text": "In a desert" },
      { "key": "B", "text": "In a forest" },
      { "key": "C", "text": "In the ocean" },
      { "key": "D", "text": "On a mountain" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "Deserts are very dry and sandy. Fish, seaweed, and crabs need water to live.",
      "B": "Forests have trees and land animals. Seaweed and crabs do not live in forests.",
      "D": "Mountains are high and rocky with cold air. They are not a place for fish or seaweed."
    },
    "explanation": "The ocean is a large body of saltwater that is home to many living things like fish, seaweed, and crabs. Different habitats are home to different plants and animals.",
    "explanationSteps": [
      "A habitat is a place where plants and animals live naturally.",
      "The ocean habitat is full of saltwater.",
      "Fish, seaweed, and crabs all have special features that help them live in the ocean."
    ],
    "hints": [
      "Think about where seaweed grows - is it on land or in water?",
      "Where do you have to go to see crabs scuttling around on the sand?"
    ],
    "tags": ["ocean", "habitat", "ecosystem", "fish", "crabs"],
    "estimatedTimeSec": 20
  }
];

fs.writeFileSync(path.join(dir, 'A1.json'), JSON.stringify(A1, null, 2), 'utf8');
console.log('A1.json written: ' + A1.length + ' questions');
