/* 들개 영어판 문장. 모양은 js/data/species/dog.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'dog', text);
})({
  "name": "Stray Dog",
  "place": "under the porch of an empty house in a redevelopment zone",
  "intro": "I was born under the porch of an empty house with a red X painted on its gate. My mom is a dog somebody left behind in this neighborhood. A broken red leash still hangs from her neck. The only person left on this alley is the old man next door.",
  "kidUnit": "pups",
  "scenes": {
    "G1": {
      "title": "The Red X",
      "text": "I'm piled up under the porch with my five brothers and sisters. Mom went out to find food and isn't back yet. At dawn, the gate next door opened, and a squeaky wheel went creak, creak out of the alley. In the evening, that sound comes back.",
      "choices": [
        {
          "t": "Burrow in with the others",
          "msg": "We slept belly to belly. Late at night, Mom came back and fed us."
        },
        {
          "t": "Whimper for Mom",
          "msg": "I called until my voice went hoarse. Mom came running and licked my face first."
        },
        {
          "t": "Crawl out from the porch",
          "msg": "I found a bread crust by a broken flowerpot. Mom came, grabbed me by the scruff, and carried me back.",
          "risk": {
            "msg": "A big wheel is rolling in from the end of the alley. Mom's barking sounds far away."
          }
        },
        {
          "t": "Prick my ears at the creaking",
          "msg": "In the evening, the sound came back. A cart piled high with flattened boxes. The man pulling it is old and bent over."
        }
      ]
    },
    "G2": {
      "title": "Half a Red Bean Bun",
      "text": "Now I can walk out from under the porch. The old man next door squats by his cart, eating a red bean bun. He breaks it in half and looks at me. Mom is on the wall with her ears up.",
      "choices": [
        {
          "t": "Eat from the old man's hand",
          "msg": "His palm is rough and the bun is sweet. \"Just you and me left in this neighborhood. You can be the chief.\" From that day on, I'm Chief."
        },
        {
          "t": "Grab the bun and run",
          "msg": "I shared it with my brothers and sisters. Red bean paste all over my mouth.",
          "hurt": {
            "msg": "My brother tried to take the bun and bit my ear."
          }
        },
        {
          "t": "Watch from behind Mom",
          "msg": "The old man left the bun on the gate step and went inside. Mom sniffed it, then pushed it to me."
        },
        {
          "t": "Climb the boxes on the cart",
          "msg": "The top of the pile is warm from the sun. The old man laughed. \"That's my seat.\"",
          "hurt": {
            "msg": "The boxes slid, and I tumbled down with them."
          }
        }
      ]
    },
    "G3": {
      "title": "The Yellow Arm",
      "text": "The ground's been shaking since morning. A yellow arm is tearing the roof off a house two doors down. Mom carries my brothers and sisters over the wall, one by one. I'm still here. The old man stands at his gate, watching the yellow arm for a long time.",
      "choices": [
        {
          "t": "Follow Mom's tail",
          "msg": "I followed Mom over the pile of bricks. Our new spot is under the shed in the old man's yard."
        },
        {
          "t": "Hide deep under the porch",
          "msg": "Dust poured down, but the porch held. In the evening, Mom carried me out.",
          "risk": {
            "msg": "The ceiling caves in. Mom is calling, but I can't get out."
          }
        },
        {
          "t": "Cut through the fallen wall",
          "msg": "In the bricks, I found some kimbap someone dropped.",
          "risk": {
            "msg": "A rusty nail in a board went through my paw. A few days later, my jaw starts to go stiff."
          }
        },
        {
          "t": "Run behind the old man's legs",
          "msg": "I hid behind his legs. \"You scared too? Me too.\" He picked me up and tucked me between the boxes on his cart."
        }
      ]
    },
    "G4": {
      "title": "Four in the Morning",
      "text": "Four in the morning. The creaking heads out of the alley. I followed. The old man stomps flat the boxes put out in front of convenience stores and restaurants, then loads them on the cart. On the big road, cars zoom by.",
      "choices": [
        {
          "t": "Walk close by the cart wheel",
          "msg": "Creak, and I take a step. \"Following me everywhere. You really are the chief.\" The girl at the convenience store peeled me a sausage."
        },
        {
          "t": "Dig through the boxes",
          "msg": "There was leftover fried chicken in a box.",
          "hurt": {
            "msg": "A broken bottle in the box cut my front paw."
          }
        },
        {
          "t": "Fetch a box from the roadside",
          "msg": "I dragged a box over from the edge of the road. The old man patted my head. \"Well, look at you.\"",
          "risk": {
            "msg": "I turn around with the box in my mouth, and the lights are too close."
          }
        },
        {
          "t": "Ride on top of the boxes",
          "msg": "I lay on the boxes and rode along. The old man grumbled as he pulled. \"You're the heaviest thing on here.\""
        }
      ]
    },
    "G5": {
      "title": "One Work Glove",
      "text": "Now the old man's gate has a red X too. He ties his blanket and rice cooker onto the cart. He's moving to a tiny room behind the scrapyard across the big road. \"No dogs allowed there.\" He pushes one work glove under the porch. \"Lie on this if you get cold.\"",
      "choices": [
        {
          "t": "Take the glove under the porch",
          "msg": "The glove smells like makgeolli and cardboard. It smells like him. The creaking got smaller at the end of the alley."
        },
        {
          "t": "Follow the cart to the big road",
          "msg": "At the crosswalk, the old man looked back. \"Go on home.\" The light turned green, and only the cart crossed.",
          "hurt": {
            "msg": "A bike shot past right next to me. I rolled over and over."
          }
        },
        {
          "t": "Lie down next to Mom",
          "msg": "Mom licked my head. The broken leash on her neck touched my ear."
        },
        {
          "t": "Hang on to his pant leg",
          "msg": "The old man squatted down and rubbed my ears for a long time. He took his last red bean bun out of his pocket and gave it to me.",
          "hurt": {
            "msg": "The pant leg slipped out of my mouth, and I fell over backward."
          }
        }
      ]
    },
    "G6": {
      "title": "A Creak I Don't Know",
      "text": "The empty houses are all torn down. I don't know where Mom and the others went. Hungry, I came to the alley behind the restaurants. I heard creaking and turned, but it was some old woman's cart. In the corner, there's a chunk of meat. It smells so good.",
      "choices": [
        {
          "t": "Wait at the back door",
          "msg": "The man from the pork bone soup place put out a whole scoop of bones. \"Haven't seen you before. Eat up.\""
        },
        {
          "t": "Eat the meat in the corner",
          "msg": "I ate till I was full. The tip of my tongue is a little bitter. It's probably fine.",
          "risk": {
            "msg": "My legs are shaking. There's foam coming out of my mouth."
          }
        },
        {
          "t": "Rip open a trash bag",
          "msg": "Chicken bones and rice spilled out.",
          "hurt": {
            "msg": "A broken soju bottle cut my snout."
          }
        },
        {
          "t": "Follow the old woman's cart",
          "msg": "Her gloves smelled different. Still, she let me doze between the boxes by her cart."
        }
      ]
    },
    "G7": {
      "title": "The Pack on the Hill",
      "text": "A pack of strays lives on the hill behind the park. They all came up from torn-down neighborhoods. Some still have leash marks on their necks. The leader, Blackie, glares at me. Winter is too long to get through alone.",
      "choices": [
        {
          "t": "Roll over and show my belly",
          "msg": "Blackie sniffed me for a long time, then turned away. They let me in at the very bottom. The bottom only gets bones.",
          "hurt": {
            "msg": "The number two dog bit my butt. They say that's how it goes at the bottom."
          }
        },
        {
          "t": "Bare my teeth and stand up",
          "msg": "He bit my ear, but I held my ground. Blackie looked away first.",
          "risk": {
            "msg": "Blackie has me by the neck and shakes. The sky spins."
          }
        },
        {
          "t": "Follow the pack into the hills",
          "msg": "I followed the pack up the mountain. The smell of people gets fainter and fainter."
        },
        {
          "t": "Stay alone behind the restroom",
          "msg": "I made a spot behind the park restroom. People out on walks give me treats sometimes.",
          "hurt": {
            "msg": "A big dog off its leash came at me."
          }
        }
      ]
    },
    "G8": {
      "title": "Minus Fifteen",
      "text": "They say tonight will be minus fifteen. The pack sleeps huddled in a pile of dead leaves. Warm air blows out of the park restroom vent. But that's where people walk. I still have the old man's work glove. It's pretty worn out.",
      "choices": [
        {
          "t": "Sleep on the glove in the pack",
          "msg": "I buried my nose in the glove. Cardboard, makgeolli. Back to back with the pack, I made it through the night."
        },
        {
          "t": "Sleep by the vent",
          "msg": "It was warm, and I slept like a log. At dawn, the cleaning man chased me off with a broom.",
          "hurt": {
            "msg": "The broom handle hit my back. It aches."
          }
        },
        {
          "t": "Look for food in the snow",
          "msg": "I dug a few bones out of a frozen food-waste bin.",
          "risk": {
            "msg": "I'm lost in the blizzard. I can't feel my paws."
          }
        },
        {
          "t": "Burrow into the leaves",
          "msg": "Under a blanket of leaves, it's warmer than I thought. I'm hungry, though."
        }
      ]
    },
    "G9": {
      "title": "The Wire Loop",
      "text": "It's spring. A sausage is hanging in the bushes by the trail. Under it, a shiny wire loop is hidden on the ground. The youngest in the pack is poking its nose in there.",
      "choices": [
        {
          "t": "Snatch the sausage",
          "msg": "I grabbed it and ran like lightning. The wire grazed my back.",
          "risk": {
            "msg": "The wire tightens around my neck. The more I pull, the tighter it gets."
          }
        },
        {
          "t": "Shove the youngest away",
          "msg": "We tumbled over and over. Meanwhile, the wire loop snapped shut on its own. Nobody was caught."
        },
        {
          "t": "Go around the bushes",
          "msg": "I ate a few wild raspberries and a grasshopper.",
          "hurt": {
            "msg": "A thorn scratched me near my eye."
          }
        },
        {
          "t": "Dig up the stake",
          "msg": "I dug out the stake and the wire went slack. I pulled the sausage out and ate it.",
          "hurt": {
            "msg": "The end of the wire cut my front paw."
          }
        }
      ]
    },
    "G10": {
      "title": "The Loudspeaker Truck",
      "text": "\"Buying dogs, buying goats!\" A truck with a loudspeaker stopped in the alley. A man waves a piece of meat and whistles. Whimpering comes from the cage on the back of the truck.",
      "choices": [
        {
          "t": "Go toward the whistle",
          "msg": "I snatched the meat and ran. Curses flew after me.",
          "risk": {
            "msg": "A noose is around my neck. The cage door shuts."
          }
        },
        {
          "t": "Bark and back away",
          "msg": "I barked my head off. Windows opened one by one, and the truck left. The old man from the corner store shook out some bread crumbs for me."
        },
        {
          "t": "Hide under the site fence",
          "msg": "This is where the empty house I was born in used to be. Now it's just a fence and tall steel beams. The truck sounds faded away.",
          "hurt": {
            "msg": "The edge of the metal fence scraped my back."
          }
        },
        {
          "t": "Run for the hills",
          "msg": "I ran to the mountain without looking back."
        }
      ]
    },
    "G11": {
      "title": "Eight Lanes",
      "text": "The wind brings a smell I know. Cardboard, makgeolli. Across the big road, creaking. Carts are going one after another into some yard. It's the scrapyard the old man said he was going to.",
      "choices": [
        {
          "t": "Cross on green with the people",
          "msg": "I walked tight between people's legs. The countdown went 3, 2, 1. I made it across.",
          "hurt": {
            "msg": "Someone in a hurry stepped on my paw."
          }
        },
        {
          "t": "Dash between the cars",
          "msg": "I ran through the honking. I barely made it. My legs are shaking.",
          "risk": {
            "msg": "I froze at the center line. The lights are too fast."
          }
        },
        {
          "t": "Wait a day by the store",
          "msg": "The girl working there peeled me a sausage. The next morning, when the cars thinned out, I crossed behind some people."
        },
        {
          "t": "Take the footbridge stairs",
          "msg": "The stairs never end. My legs were shaking, but I crossed over the top."
        }
      ]
    },
    "G12": {
      "title": "The Scrapyard Scale",
      "text": "Carts are lined up in the scrapyard. At the very end is an old man, bent over. Only one work glove hangs on his cart handle. The scrapyard man puts the pile of boxes on the scale. \"Thirty-eight kilos. Three thousand eight hundred won.\"",
      "choices": [
        {
          "t": "Bring him the glove",
          "msg": "I set the glove down at his feet. He looked from the glove to me and back."
        },
        {
          "t": "Jump up on the scale",
          "msg": "The needle swung around. The scrapyard man said, \"That's a dog.\" The old man looked at me for a long time."
        },
        {
          "t": "Sit by the cart wheel",
          "msg": "Creak. When the wheel moved, I moved a step. The old man stopped walking."
        },
        {
          "t": "Wag my tail big",
          "msg": "My tail wags on its own. My whole butt wags with it."
        }
      ]
    },
    "S1": {
      "title": "Rules of the Hill",
      "text": "The pack only goes down at dusk. In the day we stay off the hiking trails. At night we dig through the apartment food-waste bins. Tonight, there's a smell of meat by the container at the construction site.",
      "choices": [
        {
          "t": "Go down with the pack",
          "msg": "We tipped over a food-waste bin. The whole pack ate well.",
          "hurt": {
            "msg": "A rock the security guard threw hit me in the head."
          }
        },
        {
          "t": "Eat the meat by the container",
          "msg": "I ate a whole chunk of meat. It smelled a little strange, though.",
          "risk": {
            "msg": "My belly feels like it's burning. My legs won't listen."
          }
        },
        {
          "t": "Rest in the den under the rock",
          "msg": "I slept piled up with the pack in the den under the rock. I kept the glove under my chin."
        },
        {
          "t": "Go down to the big road alone",
          "msg": "I came all the way down to the big road at the foot of the mountain. Between the car sounds, I hear creaking."
        }
      ]
    },
    "S2": {
      "title": "A Complaint Was Filed",
      "text": "Someone filed a complaint: \"Stray dogs are threatening children.\" The district office's animal catchers came. A cage with chicken in it was set down by the recycling bins.",
      "choices": [
        {
          "t": "Steal the meat from the cage",
          "msg": "I got out right before the door dropped!",
          "risk": {
            "msg": "Clang. The door came down. They're loading me into a truck."
          }
        },
        {
          "t": "Go deep in the hills with the pack",
          "msg": "We went deep into the mountains. All the way to where there's no smell of people."
        },
        {
          "t": "Run toward the big road",
          "msg": "I ran without thinking, and now I'm at the big road. Across it, I hear creaking.",
          "hurt": {
            "msg": "The loop on a catch pole grazed my ear. It bled."
          }
        },
        {
          "t": "Hide deep in the den",
          "msg": "I hid for three days without eating. The catchers left."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "Chief",
      "cause": "old age",
      "line": "\"That you, Chief?\" The old man picked up the glove and hung it on his cart handle. Now there are two. Every morning before dawn, I ride on top of the boxes. \"Chief, you're the heaviest thing on here.\""
    },
    "N1": {
      "title": "Five Winters on the Hill",
      "cause": "heartworm",
      "line": "I got through five winters with the pack. Every winter, I slept with my nose in the glove. The smell was gone long ago."
    },
    "N2": {
      "title": "Ten Steps Behind",
      "cause": "old age",
      "line": "The old man didn't recognize me all grown up. Still, every morning before dawn, I walked ten steps behind the creaking. Sometimes half a red bean bun fell off the cart."
    },
    "D1": {
      "title": "The Fallen Porch",
      "cause": "buried in demolition",
      "line": "The yellow arm didn't know I was under the porch."
    },
    "D2": {
      "title": "The Rolling Wheel",
      "cause": "a car",
      "line": "The driver probably couldn't see me. I was too small."
    },
    "D3": {
      "title": "A Good Smell",
      "cause": "poison",
      "line": "Someone put that meat there on purpose. My belly was full, though."
    },
    "D4": {
      "title": "Blackie's Teeth",
      "cause": "a turf fight",
      "line": "Even on the hill, every spot was already taken."
    },
    "D5": {
      "title": "Blizzard",
      "cause": "the cold",
      "line": "I don't know where I dropped the glove. I'm so sleepy."
    },
    "D6": {
      "title": "The Wire Loop",
      "cause": "a snare",
      "line": "They say it was set for water deer. The youngest is okay."
    },
    "D7": {
      "title": "The Loudspeaker Truck",
      "cause": "a dog dealer",
      "line": "The dogs in the cage all had eyes just like mine."
    },
    "D8": {
      "title": "Eight Lanes",
      "cause": "a car",
      "line": "I heard creaking on the other side."
    },
    "D9": {
      "title": "Ten Days' Notice",
      "cause": "shelter euthanasia",
      "line": "The sign on my shelter cage said \"Yellow, about 2 years old.\" That isn't my name."
    },
    "D10": {
      "title": "A Rusty Nail",
      "cause": "tetanus",
      "line": "My mouth won't open. Mom keeps licking me."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "wounds and sickness",
      "line": "My legs won't listen anymore. I'll just lie here a little."
    },
    "W1": {
      "title": "Hunger",
      "cause": "starvation",
      "line": "If only I had half a red bean bun."
    }
  }
});
