const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname);

const a1 = [
  {
    "id": "cr-a1-001",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "initials-finals",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.1,
    "prompt": "\"妈\" (mā) 的拼音中，声母是什么？",
    "choices": [
      { "key": "A", "text": "m" },
      { "key": "B", "text": "a" },
      { "key": "C", "text": "ma" },
      { "key": "D", "text": "ā" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "A": "没错！'m' 是声母，'a' 是韵母。",
      "B": "'a' 是韵母，不是声母哦。声母在拼音的最前面。",
      "C": "'ma' 是完整的拼音，声母是开头的 'm'。",
      "D": "ā 是韵母 'a' 加上了第一声声调。"
    },
    "explanation": "在拼音 \"mā\" 中，声母是 'm'（开头的辅音），韵母是 'a'（后面的元音）。",
    "explanationSteps": ["一个拼音由声母和韵母组成。", "声母是拼音开头的辅音部分。", "\"mā\" 中 'm' 是声母，'a' 是韵母。"],
    "hints": ["声母在拼音的最前面，是辅音字母。", "\"妈妈\"的\"妈\"拼音是 m-a，前面的是声母。"],
    "tags": ["拼音", "声母", "基础"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-002",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "initials-finals",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "\"大\" (dà) 的拼音中，声母是什么？",
    "choices": [
      { "key": "A", "text": "d" },
      { "key": "B", "text": "a" },
      { "key": "C", "text": "da" },
      { "key": "D", "text": "à" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "A": "对啦！'d' 是声母，'a' 是韵母。",
      "B": "'a' 是韵母部分哦，声母是开头那个字母。",
      "C": "'da' 是完整的拼音，声母是开头的 'd'。",
      "D": "à 是带了声调的韵母。"
    },
    "explanation": "在拼音 \"dà\" 中，声母是 'd'，韵母是 'a'，第四声声调标在 'a' 上。",
    "explanationSteps": ["一个拼音由声母和韵母组成。", "\"dà\" 中 'd' 是声母，'a' 是韵母。", "第四声的符号是 '\\u0060'。"],
    "hints": ["声母是拼音开头的辅音字母。", "\"大小\"的\"大\"拼音是 d-à。"],
    "tags": ["拼音", "声母", "基础"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-003",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "tones",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.2,
    "prompt": "\"马\" (mǎ) 是第几声？",
    "choices": [
      { "key": "A", "text": "第一声 (mā)" },
      { "key": "B", "text": "第二声 (má)" },
      { "key": "C", "text": "第三声 (mǎ)" },
      { "key": "D", "text": "第四声 (mà)" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "第一声是平调（-），mā 是\"妈\"。",
      "B": "第二声是升调（/），má 是\"麻\"。",
      "C": "没错！第三声是先降后升（\\/），mǎ 是\"马\"。",
      "D": "第四声是降调（\\），mà 是\"骂\"。"
    },
    "explanation": "\"马\" (mǎ) 的声调符号是第三声（\\/），先降后升。",
    "explanationSteps": ["汉语拼音有四个声调和一个轻声。", "第三声的符号是先降后升（\\/）。", "\"马\"的拼音是 mǎ，第三声。"],
    "hints": ["看看 \"mǎ\" 上面的声调符号是什么形状？", "第三声像一个小钩子（\\/），先往下降再往上升。"],
    "tags": ["拼音", "声调", "第三声"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-004",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "tones",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.2,
    "prompt": "\"爸\" (bà) 是第几声？",
    "choices": [
      { "key": "A", "text": "第一声 (bā)" },
      { "key": "B", "text": "第二声 (bá)" },
      { "key": "C", "text": "第三声 (bǎ)" },
      { "key": "D", "text": "第四声 (bà)" }
    ],
    "answerKey": "D",
    "wrongChoiceReasons": {
      "A": "第一声是平调（-），bā 是\"八\"。",
      "B": "第二声是升调（/），像在问问题。",
      "C": "第三声是先降后升（\\/），bǎ 是\"把\"。",
      "D": "对啦！第四声是降调（\\），bà 是\"爸爸\"的\"爸\"！"
    },
    "explanation": "\"爸\" (bà) 的声调是第四声（\\），从高到低快速下降。",
    "explanationSteps": ["第四声的符号是从上往下降（\\）。", "\"爸\"读作 bà，声音短促有力。", "第四声像在生气地说\"不！\"。"],
    "hints": ["看看 \"bà\" 上面的声调符号方向。", "第四声是往下降的。"],
    "tags": ["拼音", "声调", "第四声"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-005",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "initials-finals",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.15,
    "prompt": "下面哪个拼音的韵母是 \"ao\"？",
    "choices": [
      { "key": "A", "text": "māo (猫)" },
      { "key": "B", "text": "mā (妈)" },
      { "key": "C", "text": "mǐ (米)" },
      { "key": "D", "text": "mù (木)" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "A": "没错！\"猫\"的拼音是 māo，韵母是 ao。",
      "B": "\"妈\"的韵母是 a，不是 ao 哦。",
      "C": "\"米\"的韵母是 i，不是 ao。",
      "D": "\"木\"的韵母是 u，不是 ao。"
    },
    "explanation": "韵母是拼音中声母后面的部分。\"猫\"的拼音 māo 中，声母是 m，韵母是 ao。",
    "explanationSteps": ["先找到拼音的声母（开头的辅音）。", "声母后面的部分就是韵母。", "māo 中 m 是声母，ao 是韵母。"],
    "hints": ["先看看每个拼音里声母后面是什么？", "韵母可以是一个字母，也可以是两个字母。"],
    "tags": ["拼音", "韵母", "复韵母"],
    "estimatedTimeSec": 25
  },
  {
    "id": "cr-a1-006",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "pinyin-blending",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.25,
    "prompt": "b-ā 拼在一起读什么？",
    "choices": [
      { "key": "A", "text": "pā" },
      { "key": "B", "text": "bā" },
      { "key": "C", "text": "bō" },
      { "key": "D", "text": "pō" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "p-ā 拼出来是 pā，声母不一样哦。",
      "B": "对！b-ā → bā，\"八\"的读音！",
      "C": "b-ō 才是 bō，注意韵母。",
      "D": "p-ō 才是 pō，声母韵母都不对。"
    },
    "explanation": "声母 b 和韵母 ā 拼在一起读作 bā，就像\"八\"的读音。",
    "explanationSteps": ["b 是声母，发音时双唇紧闭。", "ā 是韵母，嘴巴张开。", "b 和 ā 快速连读 → bā。"],
    "hints": ["先发 b 的音，然后快速过渡到 ā。", "b 像收音机里\"播\"的开头声音。"],
    "tags": ["拼音", "拼读", "基础"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-007",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "basic-characters",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.3,
    "prompt": "\"一\" 有几画？（笔画数）",
    "choices": [
      { "key": "A", "text": "1画" },
      { "key": "B", "text": "2画" },
      { "key": "C", "text": "3画" },
      { "key": "D", "text": "0画" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "A": "对！\"一\"就是一笔横画。",
      "B": "\"一\"只有一笔横，没有两画哦。",
      "C": "\"一\"是最简单的汉字之一，只有一画。",
      "D": "只要是汉字就至少有一画哦。"
    },
    "explanation": "\"一\"字只有一画，就是一笔横（一）。",
    "explanationSteps": ["\"一\"字由一个横笔画组成。", "横的写法是从左到右。", "所以\"一\"总共有1画。"],
    "hints": ["数一数\"一\"字有多少笔？", "从左到右写一次就是一笔。"],
    "tags": ["识字", "笔画", "基础"],
    "estimatedTimeSec": 15
  },
  {
    "id": "cr-a1-008",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "basic-characters",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.3,
    "prompt": "下面哪个字是\"水\"？",
    "choices": [
      { "key": "A", "text": "火" },
      { "key": "B", "text": "木" },
      { "key": "C", "text": "水" },
      { "key": "D", "text": "土" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "\"火\"是燃烧的火焰的意思，不是水。",
      "B": "\"木\"是树木的意思。",
      "C": "没错！\"水\"（shuǐ）就是水的意思。",
      "D": "\"土\"是泥土的意思。"
    },
    "explanation": "\"水\" (shuǐ) 是象形字，看起来像流动的水。部首是\"水\"。",
    "explanationSteps": ["\"水\"字中间像一条水流。", "两边像溅起的水花。", "这个字后来演变成现在的写法。"],
    "hints": ["想想什么东西是喝的呢？", "这个字看起来像一条小河。"],
    "tags": ["识字", "象形字", "基础"],
    "estimatedTimeSec": 15
  },
  {
    "id": "cr-a1-009",
    "moduleId": "chinese.reading",
    "skill": "vocabulary-chinese",
    "subSkill": "word-meanings",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.3,
    "prompt": "\"太阳\"是什么意思？",
    "choices": [
      { "key": "A", "text": "月亮" },
      { "key": "B", "text": "星星" },
      { "key": "C", "text": "太阳" },
      { "key": "D", "text": "云朵" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "月亮是晚上出来的，太阳是白天出来的。",
      "B": "星星是晚上天空中小小的亮点。",
      "C": "没错！\"太阳\"（tài yáng）就是白天给我们光和热的那个！",
      "D": "云朵是天空中白色的，和太阳不一样。"
    },
    "explanation": "\"太阳\" (tài yáng) 就是白天天空中的那个发光的星球，给我们光和热。",
    "explanationSteps": ["\"太\"的意思是很大的。", "\"阳\"和光有关。", "太阳就是白天给我们光和热的那个大球。"],
    "hints": ["白天天空中那个亮亮的是什么？", "它给我们温暖和光明。"],
    "tags": ["词语", "自然", "基础词汇"],
    "estimatedTimeSec": 15
  },
  {
    "id": "cr-a1-010",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "tones",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.25,
    "prompt": "\"妈妈\" (mā ma) 中，第二个\"妈\"读什么声调？",
    "choices": [
      { "key": "A", "text": "第一声 (mā)" },
      { "key": "B", "text": "第二声 (má)" },
      { "key": "C", "text": "轻声 (ma)" },
      { "key": "D", "text": "第三声 (mǎ)" }
    ],
    "answerKey": "C",
    "wrongChoiceReasons": {
      "A": "第一个\"妈\"是第一声，第二个是轻声。",
      "B": "第二声是升调，\"妈妈\"的第二个字读得又轻又短。",
      "C": "对啦！\"妈妈\"的第二个字读轻声（ma），又轻又短！",
      "D": "第三声是先降后升，\"妈妈\"的第二个字读得很轻。"
    },
    "explanation": "\"妈妈\" (mā ma) 中，第一个\"妈\"读第一声，第二个\"妈\"读轻声。轻声要读得又轻又短。",
    "explanationSteps": ["汉语中有一种特殊的声调叫轻声。", "轻声没有声调符号。", "轻声要读得又轻又短。"],
    "hints": ["读一读\"妈妈\"，第二个字是不是比较轻？", "轻声没有声调标记。"],
    "tags": ["拼音", "轻声", "口语"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-011",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "basic-characters",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.3,
    "prompt": "\"山\"字的拼音是什么？",
    "choices": [
      { "key": "A", "text": "sān" },
      { "key": "B", "text": "shān" },
      { "key": "C", "text": "sàn" },
      { "key": "D", "text": "shàn" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "sān 是\"三\"，而且 s 和 sh 的发音不同哦。",
      "B": "正确！\"山\"的拼音是 shān，第一声。",
      "C": "sàn 是\"散\"，声调和声母都不对。",
      "D": "shàn 是\"扇\"，虽然声母对了但是声调不对。"
    },
    "explanation": "\"山\" (shān) 的拼音是 sh-an，第一声。sh 是翘舌音。",
    "explanationSteps": ["\"山\"的声母是 sh（翘舌音）。", "韵母是 an。", "声调是第一声，读作 shān。"],
    "hints": ["\"山\"的声母是翘舌音 s-h。", "想一想，sh 和 s 发音有什么不同？"],
    "tags": ["识字", "拼音", "自然"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-012",
    "moduleId": "chinese.reading",
    "skill": "vocabulary-chinese",
    "subSkill": "compound-words",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.35,
    "prompt": "\"小朋友\"中哪个字表示\"小\"的意思？",
    "choices": [
      { "key": "A", "text": "小" },
      { "key": "B", "text": "朋" },
      { "key": "C", "text": "友" },
      { "key": "D", "text": "三个字都有" }
    ],
    "answerKey": "A",
    "wrongChoiceReasons": {
      "A": "对！\"小\"就是小的意思。",
      "B": "\"朋\"是朋友的意思，不是小。",
      "C": "\"友\"也是朋友的意思。",
      "D": "只有\"小\"表示\"小\"的意思哦。"
    },
    "explanation": "\"小朋友\"由\"小\"和\"朋友\"组成，意思是年龄小的朋友（孩子）。",
    "explanationSteps": ["\"小朋友\"分解为\"小\" + \"朋友\"。", "\"小\"表示年龄小。", "\"朋友\"表示伙伴。", "合起来就是小孩子。"],
    "hints": ["看看哪个字你认识？", "\"大小\"的\"小\"是这个字吗？"],
    "tags": ["词语", "合成词", "基础"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-013",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "pinyin-blending",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.3,
    "prompt": "g-ǒu 拼在一起读什么？",
    "choices": [
      { "key": "A", "text": "gōu" },
      { "key": "B", "text": "gǒu" },
      { "key": "C", "text": "gòu" },
      { "key": "D", "text": "kǒu" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "gōu 是第一声，这里的声调是第三声（\\/）哦。",
      "B": "对！g-ǒu → gǒu，就是\"狗\"的读音！",
      "C": "gòu 是第四声，g-òu 才是 gòu。",
      "D": "kǒu 是 k-ǒu，声母不一样。"
    },
    "explanation": "声母 g 和韵母 ǒu 拼在一起读作 gǒu，就是\"狗\"的读音。",
    "explanationSteps": ["g 是声母，舌根音。", "ǒu 是韵母，第三声。", "g 和 ǒu 快速连读 → gǒu。"],
    "hints": ["g 的发声位置在喉咙后面。", "\"小狗\"的\"狗\"就是这个读音。"],
    "tags": ["拼音", "拼读", "动物"],
    "estimatedTimeSec": 20
  },
  {
    "id": "cr-a1-014",
    "moduleId": "chinese.reading",
    "skill": "vocabulary-chinese",
    "subSkill": "word-meanings",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.35,
    "prompt": "下面哪个词表示颜色？",
    "choices": [
      { "key": "A", "text": "苹果" },
      { "key": "B", "text": "红色" },
      { "key": "C", "text": "书包" },
      { "key": "D", "text": "桌子" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "\"苹果\"是一种水果，不是颜色。",
      "B": "对！\"红色\"（hóng sè）就是 red 的意思！",
      "C": "\"书包\"是装书的包，不是颜色。",
      "D": "\"桌子\"是家具，不是颜色。"
    },
    "explanation": "\"红色\"表示颜色，\"红\"是红颜色，\"色\"表示颜色。",
    "explanationSteps": ["\"红\"表示像火一样的颜色。", "\"色\"是颜色的意思。", "\"红色\"就是红颜色。"],
    "hints": ["想想苹果有红的、绿的，这里的词是说什么？", "\"红\"后面加了\"色\"字。"],
    "tags": ["词语", "颜色", "基础词汇"],
    "estimatedTimeSec": 15
  },
  {
    "id": "cr-a1-015",
    "moduleId": "chinese.reading",
    "skill": "pinyin-phonics",
    "subSkill": "stroke-order",
    "level": "A1",
    "questionType": "multiple-choice",
    "difficulty": 0.35,
    "prompt": "写\"口\"字时，第一笔是什么？",
    "choices": [
      { "key": "A", "text": "竖" },
      { "key": "B", "text": "横折" },
      { "key": "C", "text": "横" },
      { "key": "D", "text": "横折钩" }
    ],
    "answerKey": "B",
    "wrongChoiceReasons": {
      "A": "\"口\"的第一笔不是竖，是从左上角开始写。",
      "B": "没错！\"口\"的第一笔是竖的横折（丨𠃍）。",
      "C": "\"口\"不是从一横开始的哦。",
      "D": "\"口\"的最后一笔才是横。"
    },
    "explanation": "\"口\"字的笔顺是：竖横折（第一笔）、横（最后一笔）。",
    "explanationSteps": ["\"口\"字由三笔组成。", "第一笔：左边的竖和上面的横连起来写的竖横折。", "第二笔：右边的竖。", "第三笔：下面的横。"],
    "hints": ["写\"口\"时是从左上角开始的。", "\"口\"像一个方框。"],
    "tags": ["识字", "笔顺", "书写"],
    "estimatedTimeSec": 25
  }
];

fs.writeFileSync(path.join(dir, 'A1.json'), JSON.stringify(a1, null, 2), 'utf8');
console.log('A1.json written (' + a1.length + ' questions)');
