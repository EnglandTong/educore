const fs = require('fs');
const path = require('path');
const dir = 'D:/Development/EducationPlatform/modules/science-explorer/seeds';

function writeFile(filename, data) {
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf8');
  console.log(filename + ': ' + data.length + ' questions');
}

// ==================== A1.json (15 questions) ====================
const A1 = [
  {
    id: "se-a1-001", moduleId: "science.explorer", skill: "life-science", subSkill: "plant-life", level: "A1", questionType: "multiple-choice", difficulty: 0.08,
    prompt: "What do plants need to grow?",
    choices: [{ key: "A", text: "Sunlight and water only" }, { key: "B", text: "Sunlight, water, and air" }, { key: "C", text: "Just water" }, { key: "D", text: "Just soil" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Plants need more than just sunlight and water. They also need air!", C: "Water alone is not enough. Think about what else plants get from their environment.", D: "Soil provides nutrients, but plants need sunlight, water, and air too!" },
    explanation: "Plants need sunlight (for photosynthesis), water (to transport nutrients), and air (carbon dioxide for making food). Soil provides minerals and support.",
    explanationSteps: ["Plants use sunlight to make their own food through photosynthesis.", "Water carries nutrients from the soil throughout the plant.", "Plants take in carbon dioxide from the air to help make food."],
    hints: ["Think about what happens to a plant if you leave it in a dark closet.", "What do we need to give a potted plant to keep it alive?"],
    tags: ["plants", "basic-needs", "biology"], estimatedTimeSec: 25
  },
  {
    id: "se-a1-002", moduleId: "science.explorer", skill: "life-science", subSkill: "animal-classification", level: "A1", questionType: "multiple-choice", difficulty: 0.1,
    prompt: "Which animal has fur and feeds its babies milk?",
    choices: [{ key: "A", text: "A snake" }, { key: "B", text: "A fish" }, { key: "C", text: "A cat" }, { key: "D", text: "A bird" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Snakes are reptiles. They have scales, not fur, and lay eggs.", B: "Fish live in water, have scales and fins, and do not feed their babies milk.", D: "Birds have feathers and lay eggs. They do not have fur or make milk." },
    explanation: "Mammals like cats have fur or hair and produce milk to feed their babies. Snakes are reptiles, fish are fish, and birds are birds.",
    explanationSteps: ["Animals with fur that feed milk to their babies are called mammals.", "Cats, dogs, and humans are all mammals.", "Snakes, fish, and birds are not mammals."],
    hints: ["Think about animals that are warm and fuzzy.", "Which of these animals can you find living inside peoples homes as a pet?"],
    tags: ["animals", "mammals", "classification"], estimatedTimeSec: 20
  },
  {
    id: "se-a1-003", moduleId: "science.explorer", skill: "life-science", subSkill: "plant-life", level: "A1", questionType: "multiple-choice", difficulty: 0.12,
    prompt: "What part of a plant takes in water from the soil?",
    choices: [{ key: "A", text: "The leaves" }, { key: "B", text: "The roots" }, { key: "C", text: "The flower" }, { key: "D", text: "The stem" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Leaves use sunlight to make food, but they do not soak up water from the ground.", C: "Flowers help the plant make seeds and reproduce, they do not take in water.", D: "The stem carries water up, but it is the roots that first collect it from the soil." },
    explanation: "Roots grow underground and absorb water and minerals from the soil. The stem then carries the water up to the rest of the plant.",
    explanationSteps: ["Roots are the part of the plant that grows underground.", "Roots soak up water and nutrients from the soil.", "The water travels up the stem to reach the leaves and flowers."],
    hints: ["Which part of a plant is hidden under the ground?", "Think about what holds a plant in place when you try to pull it."],
    tags: ["plants", "roots", "plant-parts"], estimatedTimeSec: 20
  },
  {
    id: "se-a1-004", moduleId: "science.explorer", skill: "earth-space", subSkill: "solar-system", level: "A1", questionType: "multiple-choice", difficulty: 0.1,
    prompt: "What is the big, bright star that gives us light and warmth during the day?",
    choices: [{ key: "A", text: "The Moon" }, { key: "B", text: "The Sun" }, { key: "C", text: "Venus" }, { key: "D", text: "A flashlight" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "The Moon shines at night, but it does not give off its own light. It reflects the Sun light.", C: "Venus is a planet you can sometimes see at night, but it is not bright enough to light up our day.", D: "A flashlight is not a star in the sky! The Sun is the real source of daytime light." },
    explanation: "The Sun is a star - a huge ball of hot, glowing gas. It gives Earth light and heat, which makes life possible.",
    explanationSteps: ["The Sun is the closest star to Earth.", "It gives off light and heat that reaches our planet.", "Without the Sun, Earth would be dark and cold."],
    hints: ["What warms your face when you go outside on a sunny day?", "What wakes up the rooster in the morning?"],
    tags: ["sun", "solar-system", "daytime"], estimatedTimeSec: 15
  },
  {
    id: "se-a1-005", moduleId: "science.explorer", skill: "earth-space", subSkill: "weather-climate", level: "A1", questionType: "true-false", difficulty: 0.05,
    prompt: "True or False: Rain falls from clouds in the sky.",
    choices: [{ key: "A", text: "True" }, { key: "B", text: "False" }],
    answerKey: "A",
    wrongChoiceReasons: { B: "Rain actually does come from clouds! Clouds are made of tiny water droplets that join together and fall as rain." },
    explanation: "When water droplets in clouds get heavy enough, they fall to the ground as rain. This is part of the water cycle.",
    explanationSteps: ["Clouds are made of tiny water drops.", "When the drops get big and heavy, they fall as rain.", "This is how we get rain to water the plants and fill our rivers."],
    hints: ["What do you see in the sky before it starts raining?", "Where do puddles come from after a storm?"],
    tags: ["weather", "rain", "clouds", "water-cycle"], estimatedTimeSec: 10
  },
  {
    id: "se-a1-006", moduleId: "science.explorer", skill: "life-science", subSkill: "animal-classification", level: "A1", questionType: "multiple-choice", difficulty: 0.15,
    prompt: "Which of these animals lives in water and has gills to breathe?",
    choices: [{ key: "A", text: "A whale" }, { key: "B", text: "A fish" }, { key: "C", text: "A frog" }, { key: "D", text: "A duck" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Whales live in water but they are mammals and breathe air through lungs, not gills.", C: "Frogs can live in water, but they breathe through their skin and have lungs, not gills (as adults).", D: "Ducks are birds. They have lungs and breathe air. They visit water but do not live in it full time." },
    explanation: "Fish have gills that let them take in oxygen from water. Whales are mammals that must come to the surface to breathe air.",
    explanationSteps: ["Gills are special body parts that let fish breathe underwater.", "Fish take water into their mouths and pass it over their gills.", "The gills take oxygen out of the water so the fish can breathe."],
    hints: ["Think of a pet that lives in a fish tank or bowl.", "Which animal has fins and a tail instead of legs?"],
    tags: ["fish", "gills", "aquatic-animals"], estimatedTimeSec: 25
  },
  {
    id: "se-a1-007", moduleId: "science.explorer", skill: "physical-science", subSkill: "states-of-matter", level: "A1", questionType: "multiple-choice", difficulty: 0.18,
    prompt: "Ice is water that has turned into a __________.",
    choices: [{ key: "A", text: "liquid" }, { key: "B", text: "solid" }, { key: "C", text: "gas" }, { key: "D", text: "juice" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Liquid water flows and takes the shape of its container. Ice is hard and keeps its shape.", C: "A gas is invisible like steam. Ice is definitely not a gas!", D: "Juice is a drink. Ice is frozen water, not juice." },
    explanation: "Ice is water in its solid state. When water gets very cold (below 0 C or 32 F) it freezes and becomes solid ice.",
    explanationSteps: ["Water can be a liquid, a solid (ice), or a gas (steam).", "When liquid water gets cold enough, it freezes into solid ice.", "When ice warms up, it melts back into liquid water."],
    hints: ["What happens to water in an ice cube tray when you put it in the freezer?", "Is an ice cube hard or soft? Can you hold it in your hand?"],
    tags: ["ice", "states-of-matter", "solid", "freezing"], estimatedTimeSec: 20
  },
  {
    id: "se-a1-008", moduleId: "science.explorer", skill: "earth-space", subSkill: "seasons", level: "A1", questionType: "multiple-choice", difficulty: 0.1,
    prompt: "In which season do leaves change color and fall off trees?",
    choices: [{ key: "A", text: "Spring" }, { key: "B", text: "Summer" }, { key: "C", text: "Fall (Autumn)" }, { key: "D", text: "Winter" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "In spring, new leaves grow and flowers bloom. Leaves do not fall off in spring.", B: "Summer is warm and sunny with lots of green leaves on trees.", D: "In winter, trees are bare and cold. The leaves already fell in autumn." },
    explanation: "In autumn (also called fall) the weather gets cooler and days get shorter. Trees stop making food and their leaves change color before falling off.",
    explanationSteps: ["In fall, there is less sunlight for trees to use.", "Trees stop making green chlorophyll, so other colors show through.", "The leaves turn red, orange, and yellow, then fall to the ground."],
    hints: ["What season comes after summer?", "When do you see piles of colorful leaves on the ground?"],
    tags: ["seasons", "fall", "autumn", "leaves", "trees"], estimatedTimeSec: 15
  },
  {
    id: "se-a1-009", moduleId: "science.explorer", skill: "life-science", subSkill: "food-chains", level: "A1", questionType: "multiple-choice", difficulty: 0.2,
    prompt: "In a food chain, which living thing makes its own food using sunlight?",
    choices: [{ key: "A", text: "A rabbit" }, { key: "B", text: "A mushroom" }, { key: "C", text: "A plant" }, { key: "D", text: "A fox" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Rabbits eat plants, they do not make their own food.", B: "Mushrooms are decomposers that break down dead things for food.", D: "Foxes hunt and eat other animals. They do not make their own food." },
    explanation: "Plants are called producers because they use sunlight, water, and air to make their own food through photosynthesis. Animals are consumers that eat plants or other animals.",
    explanationSteps: ["Plants use sunlight to make their own food - this is called photosynthesis.", "Animals cannot make their own food, so they must eat plants or other animals.", "That is why plants are at the start of almost every food chain."],
    hints: ["Think about who makes dinner for the rest of the food chain!", "Which living thing can sit in one spot and still get all the food it needs?"],
    tags: ["food-chain", "producers", "photosynthesis", "plants"], estimatedTimeSec: 25
  },
  {
    id: "se-a1-010", moduleId: "science.explorer", skill: "physical-science", subSkill: "forces-motion", level: "A1", questionType: "true-false", difficulty: 0.08,
    prompt: "True or False: A ball will keep rolling forever if nobody stops it.",
    choices: [{ key: "A", text: "True" }, { key: "B", text: "False" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "In real life, forces like friction and air resistance slow things down and make them stop." },
    explanation: "Forces like friction (rubbing against the ground) and air resistance slow the ball down.",
    explanationSteps: ["When a ball rolls, it rubs against the ground - this is called friction.", "Friction creates heat and slows the ball down.", "Air also pushes against the ball, slowing it down a little."],
    hints: ["What happens to a toy car when you push it on the carpet? Does it stop by itself?", "Think about why you need to keep pushing a swing to keep it going."],
    tags: ["motion", "forces", "friction"], estimatedTimeSec: 15
  },
  {
    id: "se-a1-011", moduleId: "science.explorer", skill: "earth-space", subSkill: "moon-phases", level: "A1", questionType: "multiple-choice", difficulty: 0.15,
    prompt: "What shape is the Moon when it is full?",
    choices: [{ key: "A", text: "A half circle" }, { key: "B", text: "A complete circle" }, { key: "C", text: "A crescent (banana shape)" }, { key: "D", text: "A square" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "A half circle is called a half moon, not a full moon.", C: "A crescent moon is a thin sliver shape, like a banana. That is not a full moon.", D: "The Moon is always round, not square! Its shape does not change, just how much we can see." },
    explanation: "A full moon looks like a complete circle in the sky. The Moon itself is always round, but we only see the part lit up by the Sun.",
    explanationSteps: ["The Moon is always a round ball, like a sphere.", "During a full moon, the Sun lights up the entire side facing Earth.", "That is why we see a complete bright circle in the night sky."],
    hints: ["Think about when the Moon looks like a big, round pizza in the sky.", "What shape is a ball? The Moon is like a ball in space."],
    tags: ["moon", "moon-phases", "full-moon"], estimatedTimeSec: 20
  },
  {
    id: "se-a1-012", moduleId: "science.explorer", skill: "life-science", subSkill: "human-body-systems", level: "A1", questionType: "multiple-choice", difficulty: 0.12,
    prompt: "Which body part pumps blood all around your body?",
    choices: [{ key: "A", text: "Your brain" }, { key: "B", text: "Your heart" }, { key: "C", text: "Your stomach" }, { key: "D", text: "Your lungs" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "The brain controls thinking and tells your body what to do, but it does not pump blood.", C: "The stomach helps digest food, not pump blood.", D: "Lungs help you breathe by taking in oxygen, but they do not pump blood." },
    explanation: "Your heart is a powerful muscle that pumps blood through blood vessels to every part of your body. It beats about 100,000 times every day!",
    explanationSteps: ["The heart is a special muscle located in your chest.", "It squeezes and relaxes to push blood through tubes called blood vessels.", "Blood carries oxygen and nutrients to all parts of your body."],
    hints: ["Put your hand on your chest. Can you feel something going bump-bump?", "Which organ works harder when you run and play?"],
    tags: ["heart", "human-body", "circulatory-system"], estimatedTimeSec: 20
  },
  {
    id: "se-a1-013", moduleId: "science.explorer", skill: "earth-space", subSkill: "water-cycle", level: "A1", questionType: "multiple-choice", difficulty: 0.2,
    prompt: "When the Sun heats puddles after rain, where does the water go?",
    choices: [{ key: "A", text: "It sinks into a worm hole" }, { key: "B", text: "It disappears forever" }, { key: "C", text: "It turns into vapor and goes into the air" }, { key: "D", text: "It turns into ice" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "There are no worm holes! Water actually evaporates into the air.", B: "Water does not disappear forever. It just changes into vapor and goes into the air.", D: "The Sun is hot, so it would not turn water into ice. Heat makes ice melt!" },
    explanation: "The Sun heat causes water to evaporate - it turns from a liquid into an invisible gas called water vapor that rises into the air. This is part of the water cycle.",
    explanationSteps: ["The Sun heats the water in the puddle.", "The water turns into water vapor (a gas).", "The vapor rises into the sky and forms clouds."],
    hints: ["Have you seen steam rise from a hot sidewalk after rain?", "Think about what happens to a wet towel left outside on a sunny day."],
    tags: ["water-cycle", "evaporation", "puddles"], estimatedTimeSec: 25
  },
  {
    id: "se-a1-014", moduleId: "science.explorer", skill: "physical-science", subSkill: "simple-machines", level: "A1", questionType: "multiple-choice", difficulty: 0.22,
    prompt: "A seesaw on a playground is an example of what simple machine?",
    choices: [{ key: "A", text: "A pulley" }, { key: "B", text: "A lever" }, { key: "C", text: "A wheel" }, { key: "D", text: "A ramp" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "A pulley uses a rope and wheel to lift things. A seesaw does not have a rope.", C: "A seesaw does not roll! Wheels help things move by rolling.", D: "A ramp is a slanted surface that helps move things up and down. A seesaw goes up and down in place." },
    explanation: "A seesaw is a lever - a simple machine that has a bar that pivots on a point called a fulcrum. When one person pushes down, the other goes up.",
    explanationSteps: ["A seesaw has a board that rests on a middle point called a fulcrum.", "When you push down on your end, the other end goes up.", "This makes it easier to lift someone on the other side."],
    hints: ["Think about how you make your friend go up when you are on a seesaw.", "What happens if you sit very close to the middle versus at the very end?"],
    tags: ["simple-machines", "lever", "seesaw", "playground"], estimatedTimeSec: 25
  },
  {
    id: "se-a1-015", moduleId: "science.explorer", skill: "life-science", subSkill: "ecosystems", level: "A1", questionType: "multiple-choice", difficulty: 0.15,
    prompt: "Where would you find a fish, seaweed, and crabs living together?",
    choices: [{ key: "A", text: "In a desert" }, { key: "B", text: "In a forest" }, { key: "C", text: "In the ocean" }, { key: "D", text: "On a mountain" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Deserts are very dry and sandy. Fish, seaweed, and crabs need water to live.", B: "Forests have trees and land animals. Seaweed and crabs do not live in forests.", D: "Mountains are high and rocky with cold air. They are not a place for fish or seaweed." },
    explanation: "The ocean is a large body of saltwater that is home to many living things like fish, seaweed, and crabs. Different habitats are home to different plants and animals.",
    explanationSteps: ["A habitat is a place where plants and animals live naturally.", "The ocean habitat is full of saltwater.", "Fish, seaweed, and crabs all have special features that help them live in the ocean."],
    hints: ["Think about where seaweed grows - is it on land or in water?", "Where do you have to go to see crabs scuttling around on the sand?"],
    tags: ["ocean", "habitat", "ecosystem", "fish", "crabs"], estimatedTimeSec: 20
  }
];
writeFile('A1.json', A1);

// ==================== A2.json (20 questions) ====================
const A2 = [
  {
    id: "se-a2-001", moduleId: "science.explorer", skill: "life-science", subSkill: "ecosystems", level: "A2", questionType: "multiple-choice", difficulty: 0.2,
    prompt: "Which of these describes a desert ecosystem?",
    choices: [{ key: "A", text: "Lots of rain, tall trees, and many rivers" }, { key: "B", text: "Very little rain, sandy or rocky ground, hot days and cold nights" }, { key: "C", text: "Snow and ice covering the ground all year" }, { key: "D", text: "Dense fog and moss covering everything" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "That sounds like a rainforest, not a desert. Deserts have very little rain.", C: "That describes a polar or tundra ecosystem, not a desert.", D: "That sounds like a cloud forest or swamp, not a desert." },
    explanation: "Deserts get less than 25 cm of rain per year. Despite the harsh conditions, many plants and animals like cacti, camels, and lizards have adapted to survive there.",
    explanationSteps: ["Deserts are defined by how little rain they get, not by temperature.", "Some deserts are hot (like the Sahara) and some are cold (like Antarctica).", "Desert animals often come out at night when it is cooler."],
    hints: ["Think about a place where it almost never rains.", "What kind of plants store water in their stems?"],
    tags: ["desert", "ecosystem", "habitat", "adaptation"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-002", moduleId: "science.explorer", skill: "life-science", subSkill: "food-chains", level: "A2", questionType: "multiple-choice", difficulty: 0.25,
    prompt: "In a grassland food chain, grass is eaten by a grasshopper, the grasshopper is eaten by a mouse, and the mouse is eaten by an owl. What is the grasshopper?",
    choices: [{ key: "A", text: "A producer" }, { key: "B", text: "A primary consumer" }, { key: "C", text: "A secondary consumer" }, { key: "D", text: "A decomposer" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Producers make their own food. The grasshopper eats plants, so it is a consumer.", C: "Secondary consumers eat primary consumers. The grasshopper is the first to eat, so it is primary.", D: "Decomposers break down dead matter. The grasshopper is alive and eating." },
    explanation: "In a food chain, the grasshopper is a primary consumer because it eats plants (producers). The mouse is a secondary consumer and the owl is a tertiary consumer.",
    explanationSteps: ["Plants (grass) are producers - they make their own food.", "Herbivores like grasshoppers are primary consumers - they eat producers.", "Carnivores that eat herbivores are secondary consumers."],
    hints: ["What does the grasshopper eat? That tells you what type of consumer it is.", "The word primary means first. What is the first animal in this chain?"],
    tags: ["food-chain", "consumer", "grassland", "ecology"], estimatedTimeSec: 30
  },
  {
    id: "se-a2-003", moduleId: "science.explorer", skill: "physical-science", subSkill: "states-of-matter", level: "A2", questionType: "multiple-choice", difficulty: 0.2,
    prompt: "Which state of matter has a definite shape and volume?",
    choices: [{ key: "A", text: "Solid" }, { key: "B", text: "Liquid" }, { key: "C", text: "Gas" }, { key: "D", text: "Plasma" }],
    answerKey: "A",
    wrongChoiceReasons: { B: "Liquids have a definite volume but take the shape of their container.", C: "Gases have no definite shape or volume - they expand to fill their container.", D: "Plasma is a state of matter found in stars, but it does not have a definite shape." },
    explanation: "Solids have tightly packed particles that vibrate in place. This gives solids a definite shape and volume. Examples include ice, rocks, and wood.",
    explanationSteps: ["In a solid, particles are packed closely together in a fixed arrangement.", "The particles can only vibrate, not move past each other.", "This is why a solid keeps its shape and does not flow."],
    hints: ["Think about a wooden block. Does its shape change when you put it in a bowl?", "Which state of matter can you hold in your hand without it changing shape?"],
    tags: ["states-of-matter", "solid", "matter"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-004", moduleId: "science.explorer", skill: "physical-science", subSkill: "states-of-matter", level: "A2", questionType: "multiple-choice", difficulty: 0.25,
    prompt: "When water boils, it changes from a liquid to a __________.",
    choices: [{ key: "A", text: "solid" }, { key: "B", text: "plasma" }, { key: "C", text: "gas (water vapor)" }, { key: "D", text: "crystal" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Water turns into a solid (ice) when it freezes, not when it boils.", B: "Plasma is found in stars and lightning. Boiling water does not turn into plasma.", D: "Crystals form when some liquids cool slowly. Boiling water turns into gas, not crystals." },
    explanation: "Boiling is a phase change where liquid water absorbs enough heat to turn into water vapor (a gas). The boiling point of water is 100 C (212 F) at sea level.",
    explanationSteps: ["When water is heated, the molecules move faster and faster.", "At 100 C, the molecules have enough energy to escape into the air as gas.", "The bubbles you see in boiling water are water vapor escaping."],
    hints: ["What do you see rising from a pot of boiling water?", "Think about the steam that comes out of a kettle."],
    tags: ["boiling", "evaporation", "states-of-matter", "water"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-005", moduleId: "science.explorer", skill: "earth-space", subSkill: "water-cycle", level: "A2", questionType: "gap-filling", difficulty: 0.25,
    prompt: "Fill in the blank: In the water cycle, water vapor cools high in the sky and turns back into tiny liquid droplets. This process is called __________.",
    choices: [{ key: "A", text: "evaporation" }, { key: "B", text: "condensation" }, { key: "C", text: "precipitation" }, { key: "D", text: "collection" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Evaporation is when water turns from liquid to gas and rises. This happens BEFORE condensation.", C: "Precipitation is when water falls from clouds as rain, snow, or hail. It comes after condensation.", D: "Collection is when water gathers in rivers, lakes, and oceans. That is a different step." },
    explanation: "Condensation is the process where water vapor (gas) cools and changes back into liquid water, forming clouds.",
    explanationSteps: ["Warm water vapor rises into the cool upper atmosphere.", "The vapor loses energy and turns into tiny liquid droplets.", "These droplets group together to form clouds."],
    hints: ["What happens to the outside of a cold glass of lemonade on a hot day?", "The word starts with con- and is the opposite of evaporation."],
    tags: ["water-cycle", "condensation", "clouds"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-006", moduleId: "science.explorer", skill: "earth-space", subSkill: "solar-system", level: "A2", questionType: "multiple-choice", difficulty: 0.2,
    prompt: "Which planet is known as the Red Planet?",
    choices: [{ key: "A", text: "Venus" }, { key: "B", text: "Jupiter" }, { key: "C", text: "Mars" }, { key: "D", text: "Saturn" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Venus is called Earth sister planet and looks bright white/yellow, not red.", B: "Jupiter is a gas giant with colorful bands of orange and white, not red overall.", D: "Saturn is known for its beautiful rings and is pale yellow, not red." },
    explanation: "Mars looks red because its surface contains a lot of iron oxide (rust). It has the tallest mountain in the solar system - Olympus Mons.",
    explanationSteps: ["Mars has iron-rich rocks and soil on its surface.", "The iron has oxidized (rusted) over billions of years.", "This rust gives Mars its distinctive red color."],
    hints: ["Think about the color of rust on an old metal bicycle.", "This planet is the fourth from the Sun, right after Earth."],
    tags: ["mars", "solar-system", "planets", "red-planet"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-007", moduleId: "science.explorer", skill: "earth-space", subSkill: "solar-system", level: "A2", questionType: "true-false", difficulty: 0.15,
    prompt: "True or False: The Earth is the closest planet to the Sun.",
    choices: [{ key: "A", text: "True" }, { key: "B", text: "False" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Mercury is actually the closest planet to the Sun. Earth is the third planet from the Sun." },
    explanation: "The order from the Sun is: Mercury, Venus, Earth, Mars. Mercury is closest, then Venus, then Earth.",
    explanationSteps: ["Mercury is about 58 million km from the Sun.", "Earth is about 150 million km from the Sun.", "Mercury, being closest, is extremely hot on its sun-facing side."],
    hints: ["Which planet is so close to the Sun that it is hard to see from Earth?", "There is a planet between the Sun and Earth."],
    tags: ["solar-system", "planets", "mercury", "earth"], estimatedTimeSec: 15
  },
  {
    id: "se-a2-008", moduleId: "science.explorer", skill: "physical-science", subSkill: "forces-motion", level: "A2", questionType: "multiple-choice", difficulty: 0.3,
    prompt: "A ball is rolling on the grass and gradually slows down. What force is causing it to slow?",
    choices: [{ key: "A", text: "Gravity" }, { key: "B", text: "Magnetism" }, { key: "C", text: "Friction" }, { key: "D", text: "Buoyancy" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Gravity pulls the ball down toward the ground, but it does not slow the ball sideways motion.", B: "Magnetism only affects certain materials like iron. A regular ball is not magnetic.", D: "Buoyancy is an upward force that helps things float, not a force that slows rolling." },
    explanation: "Friction is a force that resists motion between two surfaces touching each other. The grass rubs against the ball, creating friction that slows it down.",
    explanationSteps: ["When two surfaces rub together, friction is created.", "Friction always acts in the opposite direction of motion.", "Rougher surfaces create more friction, which is why a ball slows faster on grass than on ice."],
    hints: ["Would the ball slow down faster on grass or on smooth ice?", "Rub your hands together fast - what do you feel?"],
    tags: ["friction", "forces", "motion", "physics"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-009", moduleId: "science.explorer", skill: "life-science", subSkill: "human-body-systems", level: "A2", questionType: "multiple-choice", difficulty: 0.22,
    prompt: "What is the main function of the skeletal system?",
    choices: [{ key: "A", text: "To pump blood through the body" }, { key: "B", text: "To give the body structure and protect organs" }, { key: "C", text: "To help digest food" }, { key: "D", text: "To help you think" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "The heart and circulatory system pump blood, not the skeleton.", C: "The digestive system (stomach, intestines) digests food, not bones.", D: "The brain and nervous system handle thinking, not the skeleton." },
    explanation: "The skeletal system has 206 bones in adults. It provides support, protects organs (like the skull protecting the brain and ribs protecting the heart), and works with muscles to help us move.",
    explanationSteps: ["Bones form a strong framework that holds the body up.", "The skull protects the brain; the ribs protect the heart and lungs.", "Muscles pull on bones to make the body move."],
    hints: ["Think about a house frame - what holds up the walls and roof?", "What would happen to your brain if you did not have a skull?"],
    tags: ["skeletal-system", "bones", "human-body"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-010", moduleId: "science.explorer", skill: "life-science", subSkill: "animal-classification", level: "A2", questionType: "multiple-choice", difficulty: 0.28,
    prompt: "A whale lives in the ocean, breathes air, has a small amount of hair, and feeds milk to its babies. Which group does it belong to?",
    choices: [{ key: "A", text: "Fish" }, { key: "B", text: "Reptiles" }, { key: "C", text: "Mammals" }, { key: "D", text: "Amphibians" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Fish have gills and lay eggs. Whales breathe air with lungs and feed milk to babies.", B: "Reptiles are cold-blooded and lay eggs on land. Whales give live birth and are warm-blooded.", D: "Amphibians live part of their life in water and part on land. Whales live fully in water." },
    explanation: "Whales are marine mammals. They are warm-blooded, breathe air through lungs, give live birth, and nurse their young with milk - all key characteristics of mammals.",
    explanationSteps: ["Mammals are warm-blooded vertebrates with hair or fur.", "Female mammals produce milk to feed their babies.", "Even though whales live in the ocean, they share all these mammal traits."],
    hints: ["Think about how a whale gets oxygen - does it have gills or does it come up for air?", "What do baby whales drink?"],
    tags: ["whales", "mammals", "animal-classification", "marine-biology"], estimatedTimeSec: 30
  },
  {
    id: "se-a2-011", moduleId: "science.explorer", skill: "earth-space", subSkill: "earth-structure", level: "A2", questionType: "multiple-choice", difficulty: 0.25,
    prompt: "What is the outermost layer of the Earth called?",
    choices: [{ key: "A", text: "The core" }, { key: "B", text: "The mantle" }, { key: "C", text: "The crust" }, { key: "D", text: "The magma" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "The core is the center of the Earth, deep inside and extremely hot.", B: "The mantle sits between the core and the crust. It is not the outermost layer.", D: "Magma is molten rock found inside the Earth, not a layer of the Earth itself." },
    explanation: "The Earth has three main layers: the crust (outermost), the mantle (middle), and the core (innermost). The crust is the thin, rocky surface we live on.",
    explanationSteps: ["The crust is like the Earth outer shell.", "It is made of solid rock and is divided into tectonic plates.", "The crust is very thin compared to the other layers - like the skin of an apple."],
    hints: ["Think about what you stand on when you go outside.", "It is the thinnest layer, like the peel of a fruit."],
    tags: ["earth-structure", "crust", "geology"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-012", moduleId: "science.explorer", skill: "physical-science", subSkill: "sound-light", level: "A2", questionType: "multiple-choice", difficulty: 0.3,
    prompt: "Why can you see yourself in a mirror?",
    choices: [{ key: "A", text: "The mirror creates a copy of you" }, { key: "B", text: "Light bounces off you and reflects off the smooth mirror surface" }, { key: "C", text: "The mirror absorbs light and sends it back" }, { key: "D", text: "Your eyes send out beams that hit the mirror" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Mirrors do not create copies. They reflect the light that comes from you.", C: "Mirrors reflect light, they do not absorb it. Dark objects absorb light.", D: "Your eyes receive light, they do not send out beams like flashlights." },
    explanation: "Light reflects off your body, travels to the mirror, and the smooth mirror surface reflects that light back to your eyes. This is called reflection.",
    explanationSteps: ["Light from the room hits your body and bounces off.", "The light travels to the smooth mirror surface.", "The mirror reflects the light back to your eyes, so you see yourself."],
    hints: ["What happens when you shine a flashlight at a mirror?", "Think about why a piece of paper does not work like a mirror."],
    tags: ["light", "reflection", "mirrors", "optics"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-013", moduleId: "science.explorer", skill: "life-science", subSkill: "ecosystems", level: "A2", questionType: "gap-filling", difficulty: 0.28,
    prompt: "A __________ is a place where an organism lives and gets everything it needs to survive.",
    choices: [{ key: "A", text: "population" }, { key: "B", text: "habitat" }, { key: "C", text: "community" }, { key: "D", text: "biome" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "A population is a group of the same species living in the same area, not a place.", C: "A community includes all different populations living in an area, not a physical place.", D: "A biome is a large geographic region with similar climate and organisms. A habitat is more specific." },
    explanation: "A habitat is the natural home of an organism. It provides food, water, shelter, and space. Examples include a pond, a forest, or a desert.",
    explanationSteps: ["Every living thing has a habitat where it can survive.", "The habitat must provide everything the organism needs.", "Different organisms need different types of habitats."],
    hints: ["Think of your home - it is where you find everything you need.", "A fish habitat is water; a bird habitat might be a tree."],
    tags: ["habitat", "ecosystem", "ecology"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-014", moduleId: "science.explorer", skill: "earth-space", subSkill: "moon-phases", level: "A2", questionType: "multiple-choice", difficulty: 0.35,
    prompt: "About how long does it take for the Moon to go through all its phases, from one full moon to the next?",
    choices: [{ key: "A", text: "One day" }, { key: "B", text: "One week" }, { key: "C", text: "About one month" }, { key: "D", text: "One year" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "The Moon changes position daily, but a full cycle takes much longer than one day.", B: "One week only shows about a quarter of the cycle.", D: "One year is much too long. The Moon completes about 12 full cycles in a year." },
    explanation: "The lunar cycle takes about 29.5 days. As the Moon orbits Earth, we see different amounts of the sunlit side, creating the phases from new moon to full moon and back.",
    explanationSteps: ["The Moon orbits Earth about once every 27 days.", "Because Earth is also moving, it takes about 29.5 days for the same phase to appear.", "This 29.5-day period is called a lunar month."],
    hints: ["Look at a calendar - about how many days are between one full moon and the next?", "The word month actually comes from the word moon!"],
    tags: ["moon-phases", "lunar-cycle", "moon"], estimatedTimeSec: 30
  },
  {
    id: "se-a2-015", moduleId: "science.explorer", skill: "physical-science", subSkill: "energy-types", level: "A2", questionType: "multiple-choice", difficulty: 0.3,
    prompt: "When you eat food and then run around the playground, the food provides you with what type of energy?",
    choices: [{ key: "A", text: "Light energy" }, { key: "B", text: "Sound energy" }, { key: "C", text: "Chemical energy" }, { key: "D", text: "Electrical energy" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Light energy comes from the Sun or light bulbs, not from the food you eat.", B: "Sound energy comes from vibrations. You use energy to run, not produce sound.", D: "Electrical energy powers devices. Your body uses chemical energy from food." },
    explanation: "Food contains chemical energy stored in molecules like carbohydrates and fats. Your body breaks these down to release energy for movement, growth, and all body functions.",
    explanationSteps: ["Food molecules contain stored chemical energy in their bonds.", "Your digestive system breaks food down into nutrients.", "Your cells convert this chemical energy into movement and heat."],
    hints: ["Think about how you feel after eating a good meal - do you have more energy to play?", "What type of energy is stored in a battery? Food works in a similar way."],
    tags: ["energy", "chemical-energy", "nutrition", "body"], estimatedTimeSec: 25
  },
  {
    id: "se-a2-016", moduleId: "science.explorer", skill: "earth-space", subSkill: "weather-climate", level: "A2", questionType: "multiple-choice", difficulty: 0.22,
    prompt: "What instrument measures temperature?",
    choices: [{ key: "A", text: "A barometer" }, { key: "B", text: "A thermometer" }, { key: "C", text: "An anemometer" }, { key: "D", text: "A rain gauge" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "A barometer measures air pressure, not temperature.", C: "An anemometer measures wind speed, not temperature.", D: "A rain gauge measures how much rain has fallen, not temperature." },
    explanation: "A thermometer measures temperature. It contains a liquid (usually alcohol or mercury) that expands when heated and contracts when cooled, moving up or down a scale.",
    explanationSteps: ["Thermometers contain a liquid that expands when it gets warm.", "The liquid moves up the tube as temperature increases.", "We read the scale to find the temperature."],
    hints: ["The word thermo means heat. What instrument has thermo in its name?", "When you are sick, what does a doctor use to check if you have a fever?"],
    tags: ["weather", "temperature", "thermometer"], estimatedTimeSec: 20
  },
  {
    id: "se-a2-017", moduleId: "science.explorer", skill: "physical-science", subSkill: "electricity-magnetism", level: "A2", questionType: "true-false", difficulty: 0.2,
    prompt: "True or False: A magnet can attract a plastic spoon.",
    choices: [{ key: "A", text: "True" }, { key: "B", text: "False" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Magnets only attract materials that contain iron, nickel, or cobalt. Plastic is not magnetic." },
    explanation: "Magnets attract ferromagnetic materials like iron, nickel, and cobalt. Plastic, wood, paper, and glass are not attracted to magnets.",
    explanationSteps: ["Magnetic materials contain iron, nickel, or cobalt.", "Plastic is made from polymers and does not contain these metals.", "That is why a magnet will not pick up a plastic spoon."],
    hints: ["Test it with things around you - does a magnet stick to a plastic cup?", "Think about what kinds of objects a magnet on your fridge can hold up."],
    tags: ["magnetism", "magnets", "materials"], estimatedTimeSec: 15
  },
  {
    id: "se-a2-018", moduleId: "science.explorer", skill: "life-science", subSkill: "plant-life", level: "A2", questionType: "multiple-choice", difficulty: 0.3,
    prompt: "What is the main purpose of a flower on a plant?",
    choices: [{ key: "A", text: "To soak up water from the rain" }, { key: "B", text: "To make food through photosynthesis" }, { key: "C", text: "To help the plant reproduce and make seeds" }, { key: "D", text: "To protect the plant from animals" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "Roots soak up water, not flowers. Flowers are not good at absorbing water.", B: "Leaves are the main organs for photosynthesis, not flowers.", D: "Some flowers may have thorns or smell bad, but their main purpose is reproduction." },
    explanation: "Flowers are the reproductive organs of plants. They produce pollen and eggs, attract pollinators like bees and butterflies, and develop into fruits that contain seeds.",
    explanationSteps: ["Flowers produce pollen (male sex cells) and ovules (female sex cells).", "Bees and other insects carry pollen from one flower to another.", "After pollination, the flower develops into a fruit with seeds inside."],
    hints: ["Why do bees visit flowers so often?", "What happens to a flower after it wilts? Where do new plants come from?"],
    tags: ["flowers", "reproduction", "plants", "pollination"], estimatedTimeSec: 30
  },
  {
    id: "se-a2-019", moduleId: "science.explorer", skill: "earth-space", subSkill: "seasons", level: "A2", questionType: "multiple-choice", difficulty: 0.35,
    prompt: "Why does Earth have seasons?",
    choices: [{ key: "A", text: "Because Earth is closer to the Sun in summer and farther in winter" }, { key: "B", text: "Because Earth axis is tilted as it orbits the Sun" }, { key: "C", text: "Because the Sun gives off more heat at certain times of year" }, { key: "D", text: "Because clouds block the Sun more in winter" }],
    answerKey: "B",
    wrongChoiceReasons: { A: "Earth orbit is nearly circular. The distance to the Sun changes very little.", C: "The Sun energy output is very steady and does not change significantly.", D: "Cloud cover varies but does not cause seasons." },
    explanation: "Earth axis is tilted at about 23.5 degrees. As Earth orbits the Sun, different hemispheres receive more direct sunlight at different times, causing seasons.",
    explanationSteps: ["Earth axis is tilted 23.5 degrees from vertical.", "In summer, the Northern Hemisphere is tilted toward the Sun.", "This means more direct sunlight, longer days, and warmer temperatures."],
    hints: ["Think about how a flashlight beam looks when you shine it straight down versus at an angle.", "When it is summer in North America, what season is it in Australia?"],
    tags: ["seasons", "earth-tilt", "orbit", "astronomy"], estimatedTimeSec: 35
  },
  {
    id: "se-a2-020", moduleId: "science.explorer", skill: "life-science", subSkill: "food-chains", level: "A2", questionType: "multiple-choice", difficulty: 0.3,
    prompt: "What role do decomposers like mushrooms and bacteria play in an ecosystem?",
    choices: [{ key: "A", text: "They make their own food using sunlight" }, { key: "B", text: "They hunt and eat other animals" }, { key: "C", text: "They break down dead plants and animals, returning nutrients to the soil" }, { key: "D", text: "They only eat living plants" }],
    answerKey: "C",
    wrongChoiceReasons: { A: "That describes producers (plants), not decomposers.", B: "That describes predators or carnivores. Decomposers eat dead matter.", D: "Decomposers break down dead matter, not living plants." },
    explanation: "Decomposers like fungi, bacteria, and worms break down dead organisms and waste. This recycles nutrients back into the soil so plants can use them again.",
    explanationSteps: ["Dead plants and animals would pile up without decomposers.", "Decomposers break down complex organic matter into simple nutrients.", "These nutrients go into the soil to be used by new plants."],
    hints: ["What happens to a fallen log in the forest over time?", "Think about what helps dead leaves turn into soil."],
    tags: ["decomposers", "nutrient-cycle", "ecology", "soil"], estimatedTimeSec: 30
  }
];
writeFile('A2.json', A2);

console.log('All files written successfully!');
