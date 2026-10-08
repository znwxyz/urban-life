/* 나비 영어판 문장. 모양은 js/data/species/butterfly.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'butterfly', text);
})({
  "name": "Butterfly",
  "place": "a planter box garden in an apartment flower bed",
  "intro": "I opened my eyes inside a yellow egg, stuck to the back of a kale leaf growing in a styrofoam box in the corner of a flower bed. I'm a cabbage white caterpillar. Right now I'm smaller than a grain of rice, but someday I'll have wings. They say once the wings come, I'll only live two or three weeks.",
  "kidUnit": "eggs",
  "scenes": {
    "B1": {
      "title": "A Green World",
      "text": "I chewed my way out of the yellow eggshell. Under my feet, over my head, everything is green. It's kale, grown in a box in the corner of the flower bed by an old woman. Beyond the leaf, cheep, a sparrow's shadow goes by.",
      "choices": [
        {
          "t": "Eat my eggshell first",
          "msg": "I ate up the shell I came out of. My first meal. Tasty."
        },
        {
          "t": "Eat the soft leaf edge",
          "msg": "The edge of the leaf is the softest. Crunch crunch. Even the sound is delicious.",
          "risk": {
            "msg": "The leaf tip bounces. Cheep. A beak comes down."
          }
        },
        {
          "t": "Hug the leaf vein",
          "msg": "The vein is the same color as me. The sparrow went right past. I nibbled a little at a time, right there."
        },
        {
          "t": "Go around to the underside",
          "msg": "The back of the leaf is shady and cool. I nibbled slowly there.",
          "hurt": {
            "msg": "I slipped off the tip of the leaf and dropped all the way to the dirt. It took forever to climb back up."
          }
        }
      ]
    },
    "B2": {
      "title": "Wooden Chopsticks",
      "text": "\"Oh dear, cabbage worms again.\" It's the old woman's voice. Wooden chopsticks come down, lifting the leaves one by one. My brothers and sisters get picked up one at a time and dropped into a cup of water. Plip. Plip.",
      "choices": [
        {
          "t": "Lie flat like a leaf vein",
          "msg": "I didn't even breathe. The chopsticks only picked from the leaf next to me."
        },
        {
          "t": "Crawl behind the leaf, quick",
          "msg": "I made it over to the back of the leaf. The chopsticks pinched air.",
          "hurt": {
            "msg": "I hurried and fell off the leaf. I got stuck in the dirt in the box and barely got out."
          }
        },
        {
          "t": "Just keep eating",
          "msg": "I'm hungry, what can I do? Crunch crunch. Luckily, the chopsticks went the other way.",
          "risk": {
            "msg": "Crunch— and the chopsticks catch me. I'm lifted into the air."
          }
        },
        {
          "t": "Look up at the old woman",
          "msg": "Our eyes met. \"This one's got bright little eyes. You, at least, become a butterfly.\" She moved me to the very last leaf."
        }
      ]
    },
    "B3": {
      "title": "A Tiny Wasp",
      "text": "Behind me, bzzz, a very tiny wasp is circling. Its tail is pointed like a needle, and it's glaring only at me. My brother on the next leaf hasn't been eating lately. Now his side is covered in little yellow cotton balls.",
      "choices": [
        {
          "t": "Twist and thrash",
          "msg": "I swung my head side to side like crazy. The wasp backed way off."
        },
        {
          "t": "Spit up green juice",
          "msg": "I spat bitter green juice out of my mouth. The wasp shook off its antennae and left."
        },
        {
          "t": "Pretend not to see, keep eating",
          "msg": "I finished a whole leaf. I guess the wasp went to someone else.",
          "risk": {
            "msg": "Ow. Something like a needle went into my back and came out."
          }
        },
        {
          "t": "Hide in a hole I chewed",
          "msg": "I hid half my body in the hole I chewed in the leaf. The wasp can't find me.",
          "hurt": {
            "msg": "I got stuck in the hole, wiggled, and fell off the leaf."
          }
        }
      ]
    },
    "B4": {
      "title": "A Place to Hang",
      "text": "I'm full. Strangely, I can't eat any more. To become a pupa, I need to hang from something solid. The flower bed fence, the corner of the box, a tall grass stem. Over there, a weed trimmer is whining.",
      "choices": [
        {
          "t": "Under the box corner",
          "msg": "The box corner smells like water. It's where the old woman waters with her can. I crawled back toward the fence."
        },
        {
          "t": "Climb the fence bar",
          "msg": "I climbed about a hand's width up the green metal bar. This is it. I spun silk and tied a belt around my waist."
        },
        {
          "t": "Hang from a tall grass stem",
          "msg": "The tip of the stem sways. No, it shakes too much. I moved to the fence.",
          "risk": {
            "msg": "The whine is right next to me."
          }
        },
        {
          "t": "Rest under a leaf for a day",
          "msg": "One last rest in the shade of a kale leaf. The next day, I crawled to the fence.",
          "hurt": {
            "msg": "A sparrow poked through the leaves. I barely got away."
          }
        }
      ]
    },
    "B5": {
      "title": "Pupa",
      "text": "I'm a pupa now. My body has gone hard, and inside, it feels like I'm melting and being shaped all over again. Funny, I'm not scared. But now the rain is pouring down. I'm hanging on the fence by one silk belt around my waist.",
      "choices": [
        {
          "t": "Hold still and hang on",
          "msg": "The raindrops pounded, but I didn't move. The silk belt held."
        },
        {
          "t": "Wiggle the water off",
          "msg": "Wiggle wiggle. The rainwater dripped off. I feel lighter.",
          "risk": {
            "msg": "Snap. One side of the silk belt broke."
          }
        },
        {
          "t": "Dream about wings",
          "msg": "In my dream, I flew on white wings. The rain sounds like a lullaby.",
          "hurt": {
            "msg": "Rain soaked in under the silk belt. I'm all damp."
          }
        },
        {
          "t": "Listen for the old woman",
          "msg": "\"Oh my, it's hanging here.\" Suddenly the rain stops falling on me. She leaned an umbrella against the fence and left."
        }
      ]
    },
    "B6": {
      "title": "Wet Wings",
      "text": "The shell split open, and I spilled out. My wings are crumpled and damp. The morning sun warms them. But a magpie is combing through the flower bed.",
      "choices": [
        {
          "t": "Hang on till my wings dry",
          "msg": "I hung on to my empty shell and pushed strength into my wings. The crumpled wings opened wide and white."
        },
        {
          "t": "Try flying right away",
          "msg": "Flap flap. I barely made it to the top of the fence!",
          "risk": {
            "msg": "My wings are still folded. I drop into the middle of the flower bed."
          }
        },
        {
          "t": "Flap to dry them faster",
          "msg": "They dried fast, all right. But the tip of my left back wing dried folded."
        },
        {
          "t": "Hide behind my empty shell",
          "msg": "I pressed myself behind the empty shell. The magpie only looked for worms and left.",
          "hurt": {
            "msg": "The wind from the magpie's wings knocked me sideways. One leg slipped."
          }
        }
      ]
    },
    "B7": {
      "title": "First Flower",
      "text": "I flew! The wind lifts me right up. The world was this big all along. A sweet smell drifts over from the park. There's a field of white fleabane flowers, and in front of it, a spiderweb glitters.",
      "choices": [
        {
          "t": "Land on a fleabane flower",
          "msg": "I unrolled my straw of a mouth into the yellow middle. Sweet. So this is nectar."
        },
        {
          "t": "Past the web to the big flower",
          "msg": "I just barely slipped past the edge of the web. The flower is as big as my face.",
          "risk": {
            "msg": "My wingtip sticks to the web. The threads shake."
          }
        },
        {
          "t": "Ride the wind higher",
          "msg": "I went up higher than the treetops. The apartment roofs are under my feet.",
          "hurt": {
            "msg": "A gust caught me and threw me into a branch."
          }
        },
        {
          "t": "Rest in a leaf's shade",
          "msg": "I folded my wings in the shade of a wide leaf. The sunlight comes through the leaf, green."
        }
      ]
    },
    "B8": {
      "title": "A Road with No Flowers",
      "text": "The flower smell is gone. Endless asphalt, rows of cars, hot wind. The ground is so hot the air wobbles. Over there, in a crack in the sidewalk, I see something yellow.",
      "choices": [
        {
          "t": "To the dandelion in the crack",
          "msg": "One small dandelion. It tastes like dust, but nectar is nectar.",
          "hurt": {
            "msg": "While I was drinking, a sneaker stomped down right next to me. The wind knocked me over."
          }
        },
        {
          "t": "Fly into the sky in the car glass",
          "msg": "It wasn't the real sky. It was the sky reflected in the glass. I turned away just in time.",
          "risk": {
            "msg": "That sky looks so cool. Straight ahead— tap."
          }
        },
        {
          "t": "Rest in the shade under a car",
          "msg": "It's cool under the car. Except for the oil smell."
        },
        {
          "t": "Ride the wind up high",
          "msg": "I rode the wind up over the alley. Far off, I see red flowers on a wall."
        }
      ]
    },
    "B9": {
      "title": "Bitter Mist",
      "text": "I've made it to the roses on the wall, but a man is pointing a long wand from the tank on his back. Psshhh. White mist covers the rose vines. It's spray for aphids. The air is bitter and stings.",
      "choices": [
        {
          "t": "Fly high, away from the mist",
          "msg": "With the wind at my back, I flew over the wall. The stinging smell fades."
        },
        {
          "t": "Drink from the sprayed roses",
          "msg": "The petals are wet. But the nectar is rich.",
          "risk": {
            "msg": "The nectar is bitter. My legs are going numb."
          }
        },
        {
          "t": "Hide behind the ivy leaves",
          "msg": "I held my breath behind a leaf. The mist passed.",
          "hurt": {
            "msg": "The mist seeped between the leaves. My antennae droop."
          }
        },
        {
          "t": "Escape through an open window",
          "msg": "The villa window right next to me is open. I slipped in… but I can't see a way out."
        }
      ]
    },
    "K1": {
      "title": "Behind the Screen",
      "text": "I'm trapped between the window and the screen. I can see right outside, but I can't get out. My legs catch on the mesh, and the glass is slippery. Dried-up little flies are lying on the windowsill.",
      "choices": [
        {
          "t": "Look for a gap at the edge",
          "msg": "I felt along every corner of the screen. There's a gap! I barely squeezed out."
        },
        {
          "t": "Go to the windowsill flowers",
          "msg": "A geranium is touching the windowsill. I drank and waited, and someone opened the window wide.",
          "hurt": {
            "msg": "The window slid shut and caught the tip of my wing."
          }
        },
        {
          "t": "Keep flying at the glass",
          "msg": "Flap, flap. Just as I was getting tired, a kid opened the screen. \"Go on, butterfly.\"",
          "risk": {
            "msg": "Flap, flap. The sun goes down. My wings keep getting heavier."
          }
        },
        {
          "t": "Sit still and wait",
          "msg": "At sunset, the screen slid open. A kid's palm gently pushed me outside."
        }
      ]
    },
    "B10": {
      "title": "The White Dance",
      "text": "Over the park lawn, a pair of white wings comes toward me. A male. He circles around me, fluttering his wings. But over there, kids are running this way with a butterfly net. \"A white butterfly!\"",
      "choices": [
        {
          "t": "Rise up high with him",
          "msg": "Round and round, the two of us spiraled up to the treetop. Too high for the net."
        },
        {
          "t": "Drink nectar first",
          "msg": "I'm full. I looked back, and the white wings were gone."
        },
        {
          "t": "Hide flat in the grass",
          "msg": "I folded my wings between the blades of grass. When the kids passed, the male came back to find me.",
          "hurt": {
            "msg": "The net swept through the grass. The mesh scraped my wingtip."
          }
        },
        {
          "t": "Skim just over the net",
          "msg": "I just grazed the top of the net. He followed me over.",
          "risk": {
            "msg": "Whoosh. A green net covers the sky."
          }
        }
      ]
    },
    "B11": {
      "title": "The Old Woman's Garden",
      "text": "My wings are worn thin. The wing dust has rubbed off, and you can see through the tips. There's one last place to go. The styrofoam box in the corner of the flower bed where I was born. The kale has grown again. The old woman is squatting, looking at the leaves.",
      "choices": [
        {
          "t": "Lay eggs under the leaves",
          "msg": "One egg per leaf. Yellow eggs dotted on the backs of the leaves. The old woman sees me and narrows her eyes."
        },
        {
          "t": "Land on the back of her hand",
          "msg": "Her wrinkled hand is warm. \"Are you that bright-eyed little one from before?\" She held her hand to a kale leaf. I laid my eggs there, one by one."
        },
        {
          "t": "Lay eggs on the top leaf, fast",
          "msg": "I laid lots of eggs on the soft leaf at the very top.",
          "risk": {
            "msg": "Cheep. A sparrow lands on the corner of the box."
          }
        },
        {
          "t": "Have a sip of nectar first",
          "msg": "I drank from the fleabane in the flower bed, then came back and laid my eggs slowly."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "Eggs Under the Kale",
      "cause": "old age",
      "line": "The old woman saw the yellow eggs under the leaf and smiled. \"Eat just a little, and become butterflies.\" The wind is warm. That's a pretty good afternoon."
    },
    "N1": {
      "title": "Dancing Alone",
      "cause": "old age",
      "line": "I never found a mate. Still, the fleabane was sweet, and the sky was so much bigger than I thought."
    },
    "N2": {
      "title": "Flying Low",
      "cause": "old age",
      "line": "With a folded wingtip, I couldn't make it up to the box. I laid a few eggs under a shepherd's purse leaf in the flower bed. I hope she looks there too."
    },
    "D1": {
      "title": "Shadow on the Leaf Tip",
      "cause": "a sparrow",
      "line": "I'd only had one bite of the world."
    },
    "D2": {
      "title": "The Water Cup",
      "cause": "the gardener's chopsticks",
      "line": "Plip. My brothers and sisters are floating in the cup. The kale was hers, after all."
    },
    "D3": {
      "title": "Yellow Cotton Balls",
      "cause": "a parasitic wasp",
      "line": "Since that day my insides tickle. Instead of becoming a butterfly, I became a home for tiny wasp babies."
    },
    "D4": {
      "title": "Weed Trimmer",
      "cause": "weed trimming",
      "line": "Whine— the grass lay down all at once, and I lay down with it."
    },
    "D5": {
      "title": "The Broken Belt",
      "cause": "a fallen pupa",
      "line": "I fell into a puddle. The day I'd get my wings never came."
    },
    "D6": {
      "title": "Morning Magpie",
      "cause": "a magpie",
      "line": "I should've hung on a little longer. The sun was so warm."
    },
    "D7": {
      "title": "Shiny Threads",
      "cause": "a spiderweb",
      "line": "Not everything that sparkles is a flower."
    },
    "D8": {
      "title": "Sky in the Glass",
      "cause": "a car window",
      "line": "The sky couldn't have been inside the glass."
    },
    "D9": {
      "title": "Bitter Nectar",
      "cause": "pesticide",
      "line": "It was for aphids, they said. I'm not an aphid."
    },
    "D10": {
      "title": "Behind the Screen",
      "cause": "exhaustion",
      "line": "I could see everything outside. There just wasn't a way out."
    },
    "D11": {
      "title": "Butterfly Net",
      "cause": "a butterfly net",
      "line": "\"Yay, I got one!\" The kid sounded so happy."
    },
    "D12": {
      "title": "The Top Leaf",
      "cause": "a sparrow",
      "line": "The top leaf was the easiest one for a sparrow to see, too."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "My body's heavy. Just a little rest in the shade of a leaf."
    },
    "W1": {
      "title": "Empty Belly",
      "cause": "starvation",
      "line": "If only there'd been one more bite of leaf, one more drop of nectar."
    }
  }
});
