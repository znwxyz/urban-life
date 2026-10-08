/* 참새 영어판 문장. 모양은 js/data/species/sparrow.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'sparrow', text);
})({
  "name": "Sparrow",
  "place": "a gap behind the dry cleaner's sign",
  "intro": "I hatched in a gap behind the dry cleaner's sign. Our home is straw woven with yellow plastic string. Through the gap I can see the alley. From morning to night, people go by. Where is everybody going? City sparrows usually live about two years, they say.",
  "kidUnit": "eggs",
  "scenes": {
    "S1": {
      "title": "Behind the Sign",
      "text": "Four of us are squeezed in tight behind the sign. Mom has one white feather on her left wing. Even from far away, I can spot her. Through the gap I can see the alley. But a magpie on the awning has been looking this way for a while.",
      "choices": [
        {
          "t": "Open my mouth the widest",
          "msg": "Mom pops a caterpillar right into my mouth.",
          "hurt": {
            "msg": "My brother shoves me, and I bump my head on the corner of the sign."
          }
        },
        {
          "t": "Peek out at the alley",
          "msg": "A yellow umbrella, a black bag, a little white dog. Everyone's going somewhere. Mom pushes my head back inside with her beak.",
          "risk": {
            "msg": "The magpie hops off the awning. Its beak is so big."
          }
        },
        {
          "t": "Curl up under the yellow string",
          "msg": "I fall asleep buried among my brothers and sisters. Even in my dreams, footsteps go by."
        },
        {
          "t": "Burrow under Mom's wing",
          "msg": "Mom is warmer than my brothers and sisters. The white feather brushes my head and tickles."
        }
      ]
    },
    "S2": {
      "title": "First Day in the Bushes",
      "text": "My wings aren't grown yet, but I sort of fall out from behind the sign. Now I'm in the bushes of a flower bed. \"Stay here. Don't follow people,\" Mom says, and goes off to find bugs. Outside the bushes, a kid squats down. \"A baby bird!\" A palm reaches out.",
      "choices": [
        {
          "t": "Hide deep in the bushes",
          "msg": "Mom and Dad bring me bugs dozens of times a day. In three days I fly all the way up to the wall."
        },
        {
          "t": "Hop onto the kid's palm",
          "msg": "The kid's palm is warm. The kid cups me in both hands and stands up. \"Mom! Can I keep the bird?\""
        },
        {
          "t": "Cheep loud for Mom",
          "msg": "Mom comes right away and feeds me till I'm full.",
          "risk": {
            "msg": "Instead of Mom, a cat heard me."
          }
        },
        {
          "t": "Peck the kid's shoelace",
          "msg": "The shoelace looks like a worm, so I peck it. It doesn't taste like anything. The kid giggles.",
          "hurt": {
            "msg": "The kid jumps and stamps. My wing tip gets stepped on."
          }
        }
      ]
    },
    "B1": {
      "title": "The Shoebox",
      "text": "I'm in the kid's room. They've put a towel in a shoebox for me. The kid holds out soggy pet food on a toothpick. Outside the window: cheep, cheep. It's Mom. One corner of the window screen is torn a little.",
      "choices": [
        {
          "t": "Squeeze out through the screen",
          "msg": "I make myself flat and slip out. Mom is still in the flower bed.",
          "risk": {
            "msg": "My head gets through, but my wings catch. I can't go forward or back."
          }
        },
        {
          "t": "Eat whatever they give me",
          "msg": "My belly's full. The cheeping outside the window gets quieter every day."
        },
        {
          "t": "Cheep all night long",
          "msg": "The kid's mom says, \"His mother's looking for him. Let's put him back.\" The kid sets the whole box down in the flower bed and waves. Mom flies right over."
        },
        {
          "t": "Fly when the window opens",
          "msg": "In the morning they open the window to air out the room, and I go. All the way to the flower bed in one go!",
          "hurt": {
            "msg": "On the way out I hit the edge of the glass. I see stars."
          }
        }
      ]
    },
    "S3": {
      "title": "The Shutter Goes Up",
      "text": "Now I find my own food. Seven a.m., the shutter rattles up. The dry cleaner sweeps the sidewalk out front. He loads plastic-wrapped clothes onto his scooter and gets ready to go somewhere. Where's he going? Mom said don't follow people.",
      "choices": [
        {
          "t": "Search where he swept",
          "msg": "Where the broom went by, there are grains of rice and bread crumbs. He laughs. \"You clocking in too?\""
        },
        {
          "t": "Follow the scooter",
          "msg": "The scooter's too fast. I lose it after two alleys. It went toward the apartments. Must be where the clothes' owners live. On the way back I pick up rice in front of the kimbap shop.",
          "risk": {
            "msg": "I follow the scooter around the corner. A big truck is right in front of me."
          }
        },
        {
          "t": "Just watch from the wire",
          "msg": "I sit on the power line and look down at the alley. Everyone's going somewhere. Only I'm sitting here."
        },
        {
          "t": "Eat seeds with my siblings",
          "msg": "We strip the foxtail grass in the flower bed. Bland, but filling.",
          "hurt": {
            "msg": "My brother steals my share. We fight and I tumble off the flower-bed curb."
          }
        }
      ]
    },
    "S4": {
      "title": "The Sandbox",
      "text": "Lunchtime. Kids with yellow backpacks file past. I follow them to a playground. The sandbox is warm. Sparrows are rubbing themselves in the sand. A sand bath gets rid of mites, they say. But high in the sky, something is flapping and hanging perfectly still.",
      "choices": [
        {
          "t": "Bathe alone, with lots of room",
          "msg": "Nobody's shoving, so I roll around all I want. So fresh.",
          "risk": {
            "msg": "The sand is warm. But the shadow suddenly gets bigger."
          }
        },
        {
          "t": "Bathe in the middle of the flock",
          "msg": "I roll around among twenty others. If anyone cheeps, we all dart into the bushes together."
        },
        {
          "t": "Pick up the kids' snack crumbs",
          "msg": "Under the bench, there are puffed rice cake crumbs everywhere.",
          "hurt": {
            "msg": "A kid kicks a ball my way. I sprain a wing."
          }
        },
        {
          "t": "Rest in the slide's shade",
          "msg": "It's cool under the slide. Listening to the kids laugh, I doze off."
        }
      ]
    },
    "S5": {
      "title": "Where Are You Going?",
      "text": "The sun hangs on the villa rooftops. One by one, the kids take their moms' hands and go. Where's everyone going? \"Home, of course,\" one kid says. Then from the power line: cheep, cheep. A white feather. Mom's calling me. The sign is three alleys away.",
      "choices": [
        {
          "t": "Follow Mom back to the sign",
          "msg": "I fly the three alleys in one go. Into the gap behind the sign. Mom gives my head a peck, then gives me the last caterpillar. It didn't hurt."
        },
        {
          "t": "Follow the kid and see",
          "msg": "I follow the kid across the big road. The kid disappears into an apartment lobby. I look around. Not a single alley looks familiar."
        },
        {
          "t": "Eat rice at the kimbap shop first",
          "msg": "By the time I finish the rice, it's dark. I feel my way back, following only Mom's voice.",
          "hurt": {
            "msg": "In the dark, I fly into a power line."
          }
        },
        {
          "t": "Sleep in the playground tree",
          "msg": "My first night outside. The streetlight stays on all night. In the morning I go back to the sign, and Mom stares at me for a long time.",
          "hurt": {
            "msg": "The wind blows all night. However much I puff up, I'm cold."
          }
        }
      ]
    },
    "B2": {
      "title": "A Strange Alley",
      "text": "I've never seen this alley before. The shops have their shutters down, and it smells like food-waste bins. I can't hear Mom. Over there, two cat eyes glint.",
      "choices": [
        {
          "t": "Hide behind a sign over a shutter",
          "msg": "I cram myself into a gap behind a sign and stay up all night. In the morning I fly toward the sunrise and see the dry cleaner's sign."
        },
        {
          "t": "Dig through the food-waste bins",
          "msg": "I eat all the fried crumbs I want. At dawn I follow the power lines, and there's our alley.",
          "risk": {
            "msg": "Suddenly the cat is right next to me. It didn't make a sound."
          }
        },
        {
          "t": "Try living here",
          "msg": "In the morning, people here roll up their shutters too. There's rice flour piled in front of the rice-cake shop. Not bad."
        },
        {
          "t": "Cheep for Mom",
          "msg": "No one answers. At dawn, far away: cheep, cheep. I fly toward it, and there's our alley.",
          "hurt": {
            "msg": "The cat hears me and climbs the wall. I lose my tail feathers getting away."
          }
        }
      ]
    },
    "S6": {
      "title": "The Tree in the Glass",
      "text": "Fall. I fly with the flock now. At the very front, a white feather. Mom's in the flock too. Every evening we fly to the park. A ginkgo tree shows in the glass wall of a new café. Straight at it is a shortcut. Mom and the flock go the long way, along the power lines.",
      "choices": [
        {
          "t": "Fly straight at the tree",
          "msg": "At the last second I see myself in the glass and swerve. Phew, I got there first.",
          "risk": {
            "msg": "The tree's right there. Just a little farther."
          }
        },
        {
          "t": "Catch grubs in the planter",
          "msg": "I find grubs in the soil of the planter outside the café.",
          "hurt": {
            "msg": "The owner shoos me with a broom. I lose a tail feather."
          }
        },
        {
          "t": "Follow Mom the long way",
          "msg": "I fly with my eyes on the white feather. We go the long way along the power lines, and the park grass is full of seeds."
        },
        {
          "t": "Rest under the eaves",
          "msg": "I doze under the sunny eaves. When I wake up, the flock is already gone."
        }
      ]
    },
    "S7": {
      "title": "The Sticky Board",
      "text": "In a corner of the recycling area there's a yellow board, with grains of rice laid out neatly on it. It's there to catch mice, they say. Over there, rice is leaking from a thrown-out rice sack. That's on the cat's path.",
      "choices": [
        {
          "t": "Eat the rice on the board",
          "msg": "I peck only at the edge of the board and fly off. My feet nearly stuck.",
          "risk": {
            "msg": "My feet won't come off. I flap, and now my wings are stuck too."
          }
        },
        {
          "t": "Eat next to a lookout",
          "msg": "One keeps watch and the rest of us eat. When it cheeps, we all fly.",
          "hurt": {
            "msg": "A cat pounces. I lose my tail feathers and barely get away."
          }
        },
        {
          "t": "Have the sack all to myself",
          "msg": "So much rice!",
          "hurt": {
            "msg": "A cat's claw scratches my wing. I can't fly for a long time."
          }
        },
        {
          "t": "Wait it out in the bushes",
          "msg": "I'm hungry, but I hold out."
        }
      ]
    },
    "S8": {
      "title": "Snowy Night",
      "text": "January. It's snowing. I'm small, so the heat leaves me fast. Under the eaves of the villa, everyone's puffed up round and huddled together. At the very end, a white feather. The spot next to Mom is empty. Over there, warm steam comes out of a boiler vent.",
      "choices": [
        {
          "t": "Go into the boiler vent",
          "msg": "I warm up at the mouth of the vent and come out at dawn. There's soot on my feathers.",
          "risk": {
            "msg": "So warm... but there's nowhere to stand. I'm slipping."
          }
        },
        {
          "t": "Look for seeds under the snow",
          "msg": "I dig through the snow and find seeds.",
          "hurt": {
            "msg": "My feet freeze. I can't feel them for a long time."
          }
        },
        {
          "t": "Squeeze in next to Mom",
          "msg": "Mom lifts her wing a little for me. Pressed together, we make one round ball. In the morning we look for seeds together."
        },
        {
          "t": "Sleep under the store's lights",
          "msg": "Under the all-night convenience store sign, it's a little warmer. There are crumbs, too.",
          "hurt": {
            "msg": "It's right in the path of the cold wind. I shiver all night."
          }
        }
      ]
    },
    "S9": {
      "title": "Cheep Chorus",
      "text": "Spring. Every bush is going crazy with cheeping. The males puff out their black bibs and shiver their wings. But this morning a man in a mask walked by spraying white smoke. Bugs are lying all over the grass.",
      "choices": [
        {
          "t": "Pick up the fallen bugs",
          "msg": "A free bug feast. I'm lucky. Nothing happens.",
          "hurt": {
            "msg": "I'm dizzy all day."
          },
          "risk": {
            "msg": "My stomach churns and my legs shake. Those bugs had poison on them."
          }
        },
        {
          "t": "Go closer, shivering my wings",
          "msg": "Someone starts cheeping right in time with me. A mate!"
        },
        {
          "t": "Just stay with the flock",
          "msg": "I'll find a mate next year. It's comfy in the flock."
        },
        {
          "t": "Fight the rival",
          "msg": "I chased him off! I have a mate.",
          "hurt": {
            "msg": "We roll around tangled up and I lose a beakful of feathers."
          }
        }
      ]
    },
    "S10": {
      "title": "A Place for a Nest",
      "text": "My mate and I look for a nest spot. Last winter, the sign I was born behind became a new flat one. Not a single gap. The pipe gaps on the villa parking ceiling are narrow and dark. There's a green net over an AC unit, and behind it looks cozy.",
      "choices": [
        {
          "t": "Go in behind the net",
          "msg": "I get in through a tear in the net and settle in. I lay five eggs.",
          "risk": {
            "msg": "I stick my head through the gap, and the mesh catches around my neck."
          }
        },
        {
          "t": "Build in the pipe gap",
          "msg": "Straw, feathers, yellow plastic string. I carry it all in, one piece at a time. Just like Mom's. I lay five eggs."
        },
        {
          "t": "Build between the sign spikes",
          "msg": "I pile straw between the sharp anti-bird spikes. If anything, it holds better. I lay four eggs.",
          "hurt": {
            "msg": "A spike scrapes my belly."
          }
        },
        {
          "t": "Eat first, then look",
          "msg": "Choosing late, I end up in a hole in a streetlight pole. I lay four eggs.",
          "hurt": {
            "msg": "I get into a fight over the spot with another sparrow couple."
          }
        }
      ]
    },
    "S11": {
      "title": "The Crow",
      "text": "The babies have hatched. I have to carry caterpillars all day long. There's a bit of white on the youngest one's wing tip. But a crow is sitting at the end of the pipe, tilting its head. It's looking into the nest.",
      "choices": [
        {
          "t": "Chase it off with the neighbors",
          "msg": "Even the neighbor sparrows come and make a racket. The crow flies off like it can't be bothered. All five are safe.",
          "hurt": {
            "msg": "The crow's wing smacks me into the pipe."
          }
        },
        {
          "t": "Go at the crow",
          "msg": "I peck the top of its head and get out of there. The crow runs away! All five are safe.",
          "risk": {
            "msg": "The crow's beak turns toward me."
          }
        },
        {
          "t": "Block the entrance",
          "msg": "I block the nest entrance with my body. Three babies make it. The youngest is one of them.",
          "hurt": {
            "msg": "The crow's beak stabs my back."
          }
        },
        {
          "t": "Go catch bugs",
          "msg": "I come back with a beakful of caterpillars... and only two are left. The youngest is still there."
        }
      ]
    },
    "S12": {
      "title": "Where's Everyone Going?",
      "text": "The babies have left the nest. The youngest has a white feather on its left wing. It's scared of nothing. Mornings, it follows the dry cleaner. Afternoons, the kids going to school. The sun hangs on the villa rooftops. Everyone's going home, but I can't see the youngest.",
      "choices": [
        {
          "t": "Cheep from the power line",
          "msg": "Cheep, cheep. I call just the way Mom used to. From the end of the alley, a white feather comes flying."
        },
        {
          "t": "Search every alley",
          "msg": "I search three alleys. The youngest is sitting in the playground tree. We come back together.",
          "hurt": {
            "msg": "Dodging a cat in a dim alley, I fly into a wall."
          }
        },
        {
          "t": "Search across the big road",
          "msg": "I find the youngest in an apartment flower bed across the big road. It was watching people.",
          "risk": {
            "msg": "I'm crossing low over the big road, and the cars are too fast."
          }
        },
        {
          "t": "Put the others to bed first",
          "msg": "I'm tucking the three into the pipe gap when the youngest slips in right behind them."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "The White Feather",
      "cause": "old age",
      "line": "\"Mom, where do people go every evening?\" \"Home.\" The youngest burrows under my wing. One white feather on the left wing. Just like my mom's."
    },
    "N1": {
      "title": "Balcony Planter",
      "cause": "old age",
      "line": "Once I could fly, the kid opened the window for me. I didn't go far. A planter on their balcony became my home. Every time the kid leaves for school, I ask: where are you going?"
    },
    "N2": {
      "title": "One of the Flock",
      "cause": "old age",
      "line": "I never found a mate. On winter nights I slept huddled under the eaves with the flock. At the very end, where the white feather used to sit, now I sit."
    },
    "N3": {
      "title": "Market Sparrow",
      "cause": "old age",
      "line": "I lived two years in that alley. Every evening people pull down their shutters and go home. I go under the rice-cake shop's sign. This is my home."
    },
    "D1": {
      "title": "The Gap in the Sign",
      "cause": "a magpie",
      "line": "Mom told me to keep my head in."
    },
    "D2": {
      "title": "Too Loud",
      "cause": "a stray cat",
      "line": "I was only calling for Mom."
    },
    "D3": {
      "title": "The Wings That Hung Still",
      "cause": "a kestrel",
      "line": "I should've stayed in the middle of the flock."
    },
    "D4": {
      "title": "Following the Scooter",
      "cause": "a truck",
      "line": "I never did find out where he was going."
    },
    "D5": {
      "title": "The Tree in the Glass",
      "cause": "a window",
      "line": "I thought the ginkgo in the glass was real."
    },
    "D6": {
      "title": "The Sticky Board",
      "cause": "glue trap",
      "line": "The rice was laid out a little too neatly."
    },
    "D7": {
      "title": "The Vent",
      "cause": "a fall down a vent",
      "line": "The steam was warm, so I went in. There was nothing to hold on to."
    },
    "D8": {
      "title": "The Green Net",
      "cause": "bird netting",
      "line": "There was a way in. There wasn't a way out."
    },
    "D9": {
      "title": "The Crow",
      "cause": "a crow",
      "line": "Babies, stay pressed deep inside the pipe."
    },
    "D10": {
      "title": "The Torn Screen",
      "cause": "a window screen",
      "line": "Outside the window, Mom kept calling."
    },
    "D11": {
      "title": "White Smoke",
      "cause": "pesticide",
      "line": "I didn't know why there were so many bugs on the ground."
    },
    "D12": {
      "title": "A Strange Alley",
      "cause": "a stray cat",
      "line": "I should've only gone as far as I could hear Mom."
    },
    "D13": {
      "title": "The Big Road",
      "cause": "a car",
      "line": "Did the youngest make it home?"
    },
    "W0": {
      "title": "Worn Out",
      "cause": "exhaustion",
      "line": "I puff up my feathers, but I don't get warm anymore."
    },
    "W1": {
      "title": "Starving",
      "cause": "starvation",
      "line": "Even one day without food is dangerous. This is day three."
    }
  }
});
