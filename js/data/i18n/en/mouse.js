/* 생쥐 영어판 문장. 모양은 js/data/species/mouse.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'mouse', text);
})({
  "name": "Mouse",
  "place": "inside the wall of a semi-basement room",
  "intro": "I'm a mouse. I was born inside the wall of a semi-basement room in a small apartment building, with six brothers and sisters. On the other side of the wall live a kid and the kid's mom. Mice like us only live where people live. A year or two, at most.",
  "kidUnit": "pups",
  "scenes": {
    "M1": {
      "title": "The Nest in the Wall",
      "text": "Mom made our nest out of shredded receipts and newspaper. Through the hole in the wall is the semi-basement room. Every night, something over there goes rattle-rattle, spinning and spinning.",
      "choices": [
        {
          "t": "Burrow in with the others",
          "msg": "The six of us became one lump. I can't tell whose belly or whose back. It's warm."
        },
        {
          "t": "Follow Mom into the room",
          "msg": "I followed the tip of Mom's tail. A few grains of rice were on the floor. I stuffed my cheeks.",
          "risk": {
            "msg": "Mom went around a spot. I stepped right on it. My feet won't come off the floor."
          }
        },
        {
          "t": "Peek at the rattling",
          "msg": "I looked out through the hole. In a wire cage, a round yellow mouse is running on a wheel. It's three times bigger than me. The kid mumbles in their sleep, \"Mandu, too loud.\""
        },
        {
          "t": "Chew on the nest paper",
          "msg": "Paper fills you up but gives you no strength. Still, I chewed something."
        }
      ]
    },
    "M2": {
      "title": "Sunflower Seeds",
      "text": "Mom hasn't come back in three days. My brothers and sisters have scattered out of the wall, one by one. I was so hungry I came out onto the floor. The cage is heaped with sunflower seeds. Mandu, cheeks bursting with seeds, looks down at me.",
      "choices": [
        {
          "t": "Pick up seeds under the cage",
          "msg": "I dug through the pile of shells. Three still had seeds inside. Mandu drops a lot."
        },
        {
          "t": "Put my nose to the bars",
          "msg": "Mandu sniffed, then took a seed out of its cheek and pushed it through the bars. It's wet with spit. Still tasty."
        },
        {
          "t": "Go for the snacks on the desk",
          "msg": "I climbed up the desk leg. The bottom of the chip bag was full of crumbs.",
          "hurt": {
            "msg": "I slipped on the way down. Landed on my back on the floor."
          }
        },
        {
          "t": "Wait in the wall for Mom",
          "msg": "I slept with my nose in the paper that still smelled like her. Mom didn't come that day either."
        }
      ]
    },
    "M3": {
      "title": "The Shiny Boards",
      "text": "The kid's mom found my poop under the sink. \"I think we have a mouse.\" The next day, shiny boards were laid in every corner of the kitchen. In the middle of each board sits a piece of fried food. The smell of oil pulls at my nose.",
      "choices": [
        {
          "t": "Go around along the wall",
          "msg": "Whiskers to the wall, I tiptoed around. Whenever I saw a board, I stopped and went around it. Under the sink, I found ramen crumbs."
        },
        {
          "t": "Steal from the board's edge",
          "msg": "I stepped only on the rim and dragged the food over. One whisker stuck and got pulled out.",
          "risk": {
            "msg": "Before I even reach it, my foot sticks. One, two… all four."
          }
        },
        {
          "t": "Raid the trash under the sink",
          "msg": "Tangerine peel, rice, anchovy heads. It's a feast today.",
          "hurt": {
            "msg": "The trash can lid slammed shut. My tail got caught, then slipped free."
          }
        },
        {
          "t": "Live under Mandu's cage",
          "msg": "There isn't a single board near the cage. The kid cleared them all away: \"What if Mandu's feet get stuck!\""
        }
      ]
    },
    "M4": {
      "title": "The Black Box",
      "text": "By summer, the food in the room isn't enough. I came out through a crack in the drainpipe into the building's parking lot. By the wall is a black plastic box. A sweet smell comes out of the hole. Under a car over there, a cat is flicking its tail.",
      "choices": [
        {
          "t": "Eat the pink lump in the box",
          "msg": "The pink lump was wet from the rain and had gone hard. I only took a spilled peanut beside it.",
          "risk": {
            "msg": "It was sweet and nutty. On the third day, my nose starts bleeding and won't stop."
          }
        },
        {
          "t": "Sneak along under the wall",
          "msg": "The gap under the wall is full of grass seeds and cracker crumbs. I dug them out one by one."
        },
        {
          "t": "Shake out a torn trash bag",
          "msg": "Chicken skin fell out. I ate it all while the cat was yawning.",
          "hurt": {
            "msg": "The cat's paw swept past my side. A tuft of fur came out."
          }
        },
        {
          "t": "Hide till sundown",
          "msg": "I hid in a crack in the sidewalk. When the sun set, the cat left."
        }
      ]
    },
    "M5": {
      "title": "The Flooding Room",
      "text": "It's been raining for three days. Water came back up the drain, and now the floor sloshes. The nest in the wall is already wet. The water keeps rising, and Mandu's cage is still on the floor.",
      "choices": [
        {
          "t": "Climb on top of Mandu's cage",
          "msg": "I clung to the top of the cage. Mandu looks up at me from below. Then the kid lifted the cage up onto the desk. Me too. Our eyes met. The kid said, \"Huh?\" That was it."
        },
        {
          "t": "Go out through the drainpipe",
          "msg": "I crawled up the pipe and out into the parking lot. The sound of water in the room fades.",
          "risk": {
            "msg": "Water is rushing down the pipe toward me."
          }
        },
        {
          "t": "Stay with the wet nest",
          "msg": "The water rose up to my chin, then stopped. My fur was soaked, and I shivered all night.",
          "hurt": {
            "msg": "The paper soaked up the water and sank. I splashed around for a long time."
          }
        },
        {
          "t": "Climb on top of the wardrobe",
          "msg": "I went up the gap behind the wardrobe all the way to the top. I waited in the dust for the water to drain."
        }
      ]
    },
    "O1": {
      "title": "Under a Car",
      "text": "The rain doesn't get in under the cars in the parking lot. The engine of a car that just came in is nice and warm. But cars come and go whenever. A crow is circling in the sky.",
      "choices": [
        {
          "t": "Warm up inside the engine",
          "msg": "I dried my fur in a gap by the engine and slept hard. In the morning the rain stopped, and I went back to the semi-basement.",
          "risk": {
            "msg": "The engine starts. The belt is turning."
          }
        },
        {
          "t": "Shake out a torn trash bag",
          "msg": "Cold rice and pickled radish. I filled up and went back to the semi-basement.",
          "hurt": {
            "msg": "The crow's beak pecked my back. I barely rolled back under the car."
          }
        },
        {
          "t": "Go back when the rain stops",
          "msg": "When the rain died down, I went back through the drainpipe. The water was gone from the floor."
        },
        {
          "t": "Curl up behind a tire",
          "msg": "I spent the night behind a tire. In the morning I went back to the semi-basement."
        }
      ]
    },
    "M6": {
      "title": "Whitetail",
      "text": "On summer nights, I go all the way to the alley behind the restaurants across the street. The food-waste bins stink. There I met a male whose tail is white at the tip. He sees me and his whiskers twitch. But behind the bin, two yellow eyes shine.",
      "choices": [
        {
          "t": "Follow Whitetail",
          "msg": "He knew a way. Through a crack in the wall, all the way to the flour sacks by the bakery's back door. We ate all night, the two of us."
        },
        {
          "t": "Grab a chicken bone and run",
          "msg": "While the cat was yawning, I grabbed a chicken bone and ran.",
          "risk": {
            "msg": "I looked right into the yellow eyes. Then the paw."
          }
        },
        {
          "t": "Search under the drain grate",
          "msg": "Noodles were caught in the grate. Slurp.",
          "hurt": {
            "msg": "The edge of the grate scraped my side. It stings."
          }
        },
        {
          "t": "Hide till the cat leaves",
          "msg": "I didn't move under the drain cover. Whitetail was hiding right beside me."
        }
      ]
    },
    "M7": {
      "title": "Little Pink Beans",
      "text": "I had seven babies in the wall behind the wardrobe. No fur, eyes shut, little pink beans. To make milk, I have to eat. There's a new wooden trap on the floor. An anchovy sits on top.",
      "choices": [
        {
          "t": "Ask Mandu for seeds",
          "msg": "Mandu emptied out both cheeks for me. Eleven seeds. I made the trip twice."
        },
        {
          "t": "Swipe the anchovy",
          "msg": "I flicked the anchovy off with my front teeth. Snap! The trap shut a beat too late.",
          "risk": {
            "msg": "Click. That's the last thing I remember."
          }
        },
        {
          "t": "Hold the babies and hang on",
          "msg": "I held them for three whole days. My belly stuck to my back. But all seven are still wriggling."
        },
        {
          "t": "Search under the kid's desk",
          "msg": "Under the desk, there's a heap of cookie crumbs. Almost like somebody dropped them on purpose.",
          "hurt": {
            "msg": "A chair wheel rolled over my tail."
          }
        }
      ]
    },
    "M8": {
      "title": "The Pest Control Man",
      "text": "The kid's mom called pest control. A man in work clothes stuffs steel wool into every hole in the wall and lays new boards on the floor. My babies are still in the wall. Their eyes aren't even open yet.",
      "choices": [
        {
          "t": "Carry the babies to the wardrobe",
          "msg": "I went back and forth seven times. The moment I came in with the last one, the hole was plugged with steel wool."
        },
        {
          "t": "Go next door alone",
          "msg": "I went through the wall into the empty semi-basement next door. It's quiet. Too quiet."
        },
        {
          "t": "Lick the peanut butter",
          "msg": "I only licked what was on the corner. My feet stuck and unstuck, stuck and unstuck.",
          "risk": {
            "msg": "I was hungry, so I took one more step. Stuck."
          }
        },
        {
          "t": "Chew through the steel wool",
          "msg": "I picked apart the metal strands one by one with my teeth and made a new way through.",
          "hurt": {
            "msg": "A metal spike stabbed my gums. I taste blood."
          }
        }
      ]
    },
    "M9": {
      "title": "Foxtail Grass",
      "text": "The wind's gone cold. My babies are all grown, and the wall is crowded. I have to gather food for winter. The foxtail grass in every flowerpot around the building is ripe. Down the alley, a crow tilts its head and looks this way.",
      "choices": [
        {
          "t": "Strip seeds and store them",
          "msg": "I stripped the seed heads and carried them all day. A handful of seeds piled up in a corner of the wall. I learned it from watching Mandu stuff its cheeks."
        },
        {
          "t": "Drag home some rice cake",
          "msg": "I dragged a piece of rice cake all the way to the wall. It's chewy.",
          "risk": {
            "msg": "A black shadow is coming down from above."
          }
        },
        {
          "t": "Send the grown kids out",
          "msg": "I pushed the grown ones out of the wall. That's how mice are. The wall got roomier."
        },
        {
          "t": "Dig through the recycling",
          "msg": "There's sweet stuff left at the bottom of a yogurt drink bottle.",
          "hurt": {
            "msg": "A piece of broken glass cut my paw."
          }
        }
      ]
    },
    "M10": {
      "title": "The Empty Cage",
      "text": "The kid is crying all night. Mandu got out through a gap in the cage door. The kid shines a flashlight under the bed and behind the wardrobe. Nothing. But I can smell it. Mandu's smell goes into the wall. Into our tunnels.",
      "choices": [
        {
          "t": "Go find Mandu in the wall",
          "msg": "Mandu was stuck behind the boiler pipe. Its belly was caught. I pushed from behind. \"You're really chubby.\" Mandu popped free and followed me, holding on to my tail, all the way to the hole. \"Mandu!\" The kid's voice cracked."
        },
        {
          "t": "Raid the empty cage's bowl",
          "msg": "The cage door is open. The whole seed bowl is mine.",
          "hurt": {
            "msg": "The flashlight caught me. I jumped and ran, and hit my head on the desk leg."
          }
        },
        {
          "t": "Search behind the fridge",
          "msg": "Behind the fridge, just dust and hair. Mandu wasn't there.",
          "risk": {
            "msg": "Squeezing between the wires, I stepped where the coating was worn off."
          }
        },
        {
          "t": "Pretend I didn't hear",
          "msg": "I curled up in the paper nest. Through the wall, the kid called for Mandu all night."
        }
      ]
    },
    "M11": {
      "title": "Moving Day",
      "text": "Red letters got painted on the building wall. Redevelopment, they say. The kid's family is moving out today too. Moving boxes are out in the alley, and next to them, in the snow, is Mandu's cage. It's snowing. Where will my family spend this winter?",
      "choices": [
        {
          "t": "Go see Mandu one last time",
          "msg": "I pushed through the snow to the cage. Mandu emptied its cheeks and pushed seeds out through the bars. One, two, three… they just keep coming."
        },
        {
          "t": "Take rice from next door",
          "msg": "Half a sack of rice was still there. I carried it off, cheeks stuffed.",
          "risk": {
            "msg": "Boom. The whole wall shakes. An excavator."
          }
        },
        {
          "t": "Hide among the moving boxes",
          "msg": "I squeezed myself between the boxes. The truck rattled and pulled away."
        },
        {
          "t": "Take the family to a boiler room",
          "msg": "We all moved behind the pipes in the boiler room of the building across the street. It's toasty."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "Twenty-Three Sunflower Seeds",
      "cause": "old age",
      "line": "Mandu pushed out twenty-three seeds. With those, my family and I made it through the winter in the boiler room. Now it's spring, and my babies run around with their cheeks stuffed with seeds. Wonder who they learned that from."
    },
    "N1": {
      "title": "The New Apartment",
      "cause": "old age",
      "line": "I came out of the box, and it was a new apartment. The floors are so shiny there's nothing to eat. Every night, I got by on the seeds Mandu dropped under the cage. I left my family behind in the snowy alley."
    },
    "N2": {
      "title": "A Winter Alone",
      "cause": "old age",
      "line": "I got through the winter alone. Now it's spring, and there's plenty to chew. Just no family to chew it with."
    },
    "N3": {
      "title": "Behind the Boiler Pipes",
      "cause": "old age",
      "line": "My family and I spent the winter behind the boiler pipes. We were always hungry. But sleeping all together, we could stand it."
    },
    "D1": {
      "title": "The Board",
      "cause": "a glue trap",
      "line": "Once all four feet are stuck, all you can do is scream. Now I know why Mom never came back."
    },
    "D2": {
      "title": "The Pink Lump",
      "cause": "rat poison",
      "line": "The pink lump was really sweet. That must be why everyone eats it."
    },
    "D3": {
      "title": "Yellow Eyes",
      "cause": "a stray cat",
      "line": "They say cats hunt even when they're full. I hope Whitetail got away."
    },
    "D4": {
      "title": "Click",
      "cause": "a mousetrap",
      "line": "It was one anchovy. My babies are waiting in the wall."
    },
    "D5": {
      "title": "Backflow",
      "cause": "sewer backflow",
      "line": "I thought water only ran downhill."
    },
    "D6": {
      "title": "Ignition",
      "cause": "a car engine",
      "line": "It was really warm inside the engine. Until the car moved."
    },
    "D7": {
      "title": "Zap",
      "cause": "electric shock",
      "line": "I only went in to find Mandu. There was nothing behind the fridge but dust."
    },
    "D8": {
      "title": "The Black Shadow",
      "cause": "a crow",
      "line": "Mice always look at the ground. We never see what comes from above."
    },
    "D9": {
      "title": "Excavator",
      "cause": "demolition",
      "line": "It was half a sack of rice. I didn't know it was the day the house came down."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "My whiskers don't twitch anymore. I'll rest a little, then go."
    },
    "W1": {
      "title": "An Empty Belly",
      "cause": "starvation",
      "line": "If only I'd had one more grain of rice."
    }
  }
});
