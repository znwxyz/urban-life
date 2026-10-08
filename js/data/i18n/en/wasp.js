/* 말벌 영어판 문장. 모양은 js/data/species/wasp.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'wasp', text);
})({
  "name": "Wasp",
  "place": "a crack in the outer wall of a villa",
  "intro": "I spent the winter in a crack in the outer wall of a villa. I'm a queen, a yellow-legged hornet. Everyone in the nest where I was born last fall died over the winter. Mom, my sisters, all of them. Now I have to chew paper and build a house alone, and raise my first babies alone.",
  "kidUnit": "young",
  "scenes": {
    "Q1": {
      "title": "Spring Sun",
      "text": "I poked my antennae out of the crack. The sun is warm, but the wind is still cold. My wing muscles are too stiff to buzz. Down the alley, a semi-basement window is open a hand's width, and warm air is leaking out.",
      "choices": [
        {
          "t": "Try flying right now",
          "msg": "Wobbly, but I'm up! A sip of nectar from a dandelion at the end of the alley.",
          "hurt": {
            "msg": "The cold wind froze me, and I dropped onto the asphalt. I crawled a long way to the sun."
          }
        },
        {
          "t": "Warm up on a sunny wall first",
          "msg": "The bricks have soaked up the sun. They're toasty. I shiver my wings, and there it is. Bzzz."
        },
        {
          "t": "Go in the basement window",
          "msg": "The air in the room is like the inside of a blanket. I warmed up all I wanted, then went back out through the gap.",
          "risk": {
            "msg": "\"Aaah, a bee!\" A slipper comes flying."
          }
        },
        {
          "t": "Sleep one more day in the crack",
          "msg": "I stayed curled up one more day. The next day, the sun stayed a little longer."
        }
      ]
    },
    "Q2": {
      "title": "First Nectar",
      "text": "The cherry blossoms in the park are in full bloom. I haven't eaten a thing all winter. Nectar glistens in every flower, but up on a high branch, a magpie is going chak-chak and looking down.",
      "choices": [
        {
          "t": "Go to the top blossoms",
          "msg": "The flowers at the top are the sweetest. The magpie was looking the other way.",
          "risk": {
            "msg": "Chak! Black wings block out the sun."
          }
        },
        {
          "t": "Taste the willow sap",
          "msg": "Sap is seeping from the cracked bark. I had to fight the ants a bit for a spot.",
          "hurt": {
            "msg": "A swarm of ants grabbed my legs. I barely shook them off and flew."
          }
        },
        {
          "t": "Low-branch flowers first",
          "msg": "One sip per flower. My belly fills up, sweet."
        },
        {
          "t": "Rest in the blossoms' shade",
          "msg": "I rested in the shade of the petals and licked a little nectar from a fallen flower."
        }
      ]
    },
    "Q3": {
      "title": "First House",
      "text": "I'm looking for a spot for my first house. Under the AC unit stand in the villa parking lot, rain can't get in and people don't notice. Behind the grille inside the AC unit looks darker and cozier. The front door eaves get lots of sun.",
      "choices": [
        {
          "t": "Under the AC unit stand",
          "msg": "Under the metal stand, a patch of shade the size of a palm. This is it. This is our home."
        },
        {
          "t": "Inside the AC unit grille",
          "msg": "It's cozy inside, but the metal smell is too strong. In the end, I came out and went under the stand.",
          "risk": {
            "msg": "Hmmm— someone upstairs must have turned on the AC. The fan blades start spinning right next to me."
          }
        },
        {
          "t": "Under the sunny door eaves",
          "msg": "The eaves are warm, but people's heads go by all day. In the end, I moved under the AC unit.",
          "hurt": {
            "msg": "\"A bee!\" A broom swept the eaves. It scraped my wingtip."
          }
        },
        {
          "t": "Build under a bike seat",
          "msg": "It was cozy, but the next day the bike was gone. I looked for another spot and ended up under the AC unit.",
          "hurt": {
            "msg": "I was under the seat when the bike took off with a jolt. I barely got free."
          }
        }
      ]
    },
    "Q4": {
      "title": "Chewing Paper",
      "text": "We build our houses out of paper. I scrape dry wood with my jaws and chew it up with spit, and it turns into thin paper. In the park there's a weathered fence, a wooden bench with someone sitting on it, and a freshly painted pavilion post.",
      "choices": [
        {
          "t": "Scrape the bench behind them",
          "msg": "I scraped quietly behind his back. I got a sweet taste of dropped cookie crumbs, too.",
          "risk": {
            "msg": "\"What, a bee!\" A hand comes swinging."
          }
        },
        {
          "t": "Scrape the painted post",
          "msg": "It's so glossy it barely scrapes. Still, I got a little.",
          "hurt": {
            "msg": "The paint smell made my head spin. I lay there for a long time."
          }
        },
        {
          "t": "Take it slow, bit by bit",
          "msg": "One ball of pulp, rest, then another. Slow, but the paper comes out fine."
        },
        {
          "t": "Scrape the weathered fence",
          "msg": "Scritch scritch. A ball of gray paper pulp. I layered it on in stripes, and now there are three rooms."
        }
      ]
    },
    "Q5": {
      "title": "Raising Them Alone",
      "text": "There are six rooms now. In each one, a white larva sticks its head out and clacks its jaws. That means they're hungry. But when I go hunting, the house is empty. A strange queen has been circling the AC unit for a while.",
      "choices": [
        {
          "t": "Hunt far, at the flower field",
          "msg": "Three flies, one moth. I came back, and the house was just as I left it.",
          "risk": {
            "msg": "I come back, and a strange queen is sitting on my nest."
          }
        },
        {
          "t": "Grab a caterpillar nearby",
          "msg": "One cabbage white caterpillar. I chewed it up small and shared it among the rooms. The strange queen hung around, then left."
        },
        {
          "t": "Stay and guard the nest",
          "msg": "I buzzed my wings, and the strange queen backed off. The kids went hungry for a day."
        },
        {
          "t": "Catch gnats by the AC unit",
          "msg": "I caught a few gnats swarming over the AC drip tray. No need to go far.",
          "hurt": {
            "msg": "I slipped and fell into the drip tray. I shivered for a long time with wet wings."
          }
        }
      ]
    },
    "Q6": {
      "title": "Bean",
      "text": "The first room I capped is moving. A small head pops out. My first daughter. She's much smaller than me, since I raised her alone. Small as a bean, so I'll call her Bean. Then a window upstairs slides open. \"Honey, a wasp nest under the AC!\" He's holding bug spray.",
      "choices": [
        {
          "t": "Hide behind the nest with Bean",
          "msg": "We held our breath. The man stared a long time, then closed the window. \"Let's call the fire department tomorrow.\" We can't stay here long."
        },
        {
          "t": "Buzz a warning out front",
          "msg": "I only buzzed my wings. The man flinched back and closed the window. Still, we can't stay here long.",
          "risk": {
            "msg": "Pssssht. White mist covers the whole nest."
          }
        },
        {
          "t": "Escape through the open window",
          "msg": "I darted in through the window right in front of me. But… wait, this is inside a house."
        },
        {
          "t": "Go get nectar for the kids",
          "msg": "I came back after drinking from the spirea. Bean was peeking into her little sisters' rooms. I think the man just left it.",
          "hurt": {
            "msg": "I came back, and the outside of the nest was wet with spray. I can't breathe."
          }
        }
      ]
    },
    "K1": {
      "title": "Trapped in the Living Room",
      "text": "It's a living room. TV noise, AC air. A kid is frozen on the sofa, and a man has picked up an electric fly swatter. The window I came in is already shut. The window over there has a screen that's open a crack.",
      "choices": [
        {
          "t": "Straight out the screen gap",
          "msg": "The gap is as wide as my wings. I twisted and squeezed out. Back to Bean."
        },
        {
          "t": "Wait in a ceiling corner",
          "msg": "In the evening, the window opened. I slipped out quietly with the breeze.",
          "risk": {
            "msg": "Zzzap! Blue sparks fly."
          }
        },
        {
          "t": "Go toward the lit lamp",
          "msg": "I bumped into the lamp a few times, then found the open window.",
          "hurt": {
            "msg": "My wing touched the hot lampshade."
          }
        },
        {
          "t": "Freeze on the window frame",
          "msg": "The kid said, \"Dad, just let it out.\" The man opened the window for me."
        }
      ]
    },
    "Q7": {
      "title": "Moving in the Monsoon",
      "text": "The spring house is too small. Bean already has twelve little sisters. In summer, we move up high. On a day of on-and-off monsoon rain, Bean leads the way. Our choices: the top of the zelkova, a boxwood bush in the flower bed, or the eaves of a third-floor balcony.",
      "choices": [
        {
          "t": "Under the 3rd-floor balcony",
          "msg": "We stay out of the rain, but people are right in our faces every time they hang laundry. A few days later, we moved again, to the zelkova.",
          "hurt": {
            "msg": "A hand shaking out laundry knocked me into the flower bed."
          }
        },
        {
          "t": "In the low boxwood bush",
          "msg": "It's close, so we built it fast. But people's footsteps are too close.",
          "risk": {
            "msg": "Brrrraaang— a weed trimmer tears into the bush."
          }
        },
        {
          "t": "At the top of the zelkova",
          "msg": "The wind and rain pushed us back over and over. Under a branch at the very top, the leaves make an umbrella. Bean chewed and stuck on the first paper of our new house."
        },
        {
          "t": "Wait for the rain to stop",
          "msg": "We only moved to the top of the zelkova after the rain stopped. Some larvae went hungry in the meantime."
        }
      ]
    },
    "Q8": {
      "title": "The City Beehives",
      "text": "The nest is as big as a soccer ball. The larvae beg for meat, but the rains kept me from hunting. Bean came back smelling of honeybees. A city beekeeper keeps hives in a corner of the park. Bees buzz out front, and beside them hangs a sweet-smelling plastic bottle.",
      "choices": [
        {
          "t": "Hunt bees at the hive",
          "msg": "I snatched a honeybee coming out. Bean and I carried it home together.",
          "hurt": {
            "msg": "Dozens of honeybees wrapped around me like a ball. Hot! I barely got out."
          }
        },
        {
          "t": "Check out the sweet bottle",
          "msg": "I only licked the sweet stuff dripping from the mouth of the bottle. I can see wasps trapped inside.",
          "risk": {
            "msg": "I followed the sweet smell into the bottle, and I can't see a way out."
          }
        },
        {
          "t": "Keep Bean away from the hives",
          "msg": "I held Bean back. The beekeeper was standing there with an electric racket."
        },
        {
          "t": "Just catch park flies and moths",
          "msg": "Smaller than honeybees, but safe. Bean and I took turns carrying them home."
        }
      ]
    },
    "Q9": {
      "title": "Bean in the Can",
      "text": "Heat wave. The nest is boiling, so the workers fan their wings and carry water. But Bean went out this morning and hasn't come back. I followed the sweet smell to a convenience store. Under a patio table, from a tipped-over soda can, I smell Bean.",
      "choices": [
        {
          "t": "Call Bean from the can opening",
          "msg": "Bzz, bzz. An answer from inside the can. Bean crawled out, soaked in soda. Her wingtips are in tatters."
        },
        {
          "t": "Go in and pull her out",
          "msg": "In the sticky soda, I pushed Bean up and out. I drank plenty of soda myself.",
          "risk": {
            "msg": "The can jerks up. \"Who threw this away?\" A finger covers the opening."
          }
        },
        {
          "t": "Eat the melted ice cream first",
          "msg": "Vanilla dropped on the ground is melting. Once I got my strength back, I found Bean in the can. We crawled out together.",
          "hurt": {
            "msg": "A hand fanning itself swung by. It hit my wing."
          }
        },
        {
          "t": "Leave Bean and go back",
          "msg": "I kept looking back the whole way home. That night, the spot by the nest entrance Bean always guarded was empty."
        }
      ]
    },
    "Q10": {
      "title": "White Suits",
      "text": "Chuseok, the harvest holiday, is near. The nest is as big as a watermelon, with over a thousand workers. Bean stopped coming back as the heat wave ended. Workers don't live long. Then a siren below. A firefighter in a white suit looks up at the tree, holding a long pole.",
      "choices": [
        {
          "t": "Have the guards buzz a warning",
          "msg": "At the buzzing, the firefighter stepped back. He just put up a tape line and left.",
          "risk": {
            "msg": "White gloves fit the bag on the end of the pole over the nest."
          }
        },
        {
          "t": "All hold still inside the nest",
          "msg": "The firefighter reached up with the pole, then shook his head. \"The branch is too weak to climb.\" He just put up a tape line, \"Caution: Wasp Nest,\" and left."
        },
        {
          "t": "Lead him to the empty spring nest",
          "msg": "I circled around the AC unit, and the firefighter went that way. What he took down was the empty house I built alone in spring. Thank you, first house.",
          "hurt": {
            "msg": "The end of the pole grazed my wing."
          }
        },
        {
          "t": "Hide behind a leaf, just me",
          "msg": "I trembled behind a leaf. The firefighter just put up a tape line and left. Bean's little sisters guarded the nest entrance to the end, I heard."
        }
      ]
    },
    "Q11": {
      "title": "New Queens",
      "text": "It's fall. The big rooms at the bottom of the nest are opening. Daughters as big as me. New queens. These are the rooms Bean first chewed on moving day. The wind is cold, and the spiderwebs on every branch have gotten thick.",
      "choices": [
        {
          "t": "Lay as many more eggs as I can",
          "msg": "I laid my last eggs. These will be males. Mates for the new queens."
        },
        {
          "t": "Go find the last flowers",
          "msg": "I came back from drinking late chrysanthemum nectar. In the meantime, almost all my daughters had left.",
          "risk": {
            "msg": "My wing sticks to a thick web between the branches."
          }
        },
        {
          "t": "See them off at the entrance",
          "msg": "One, two, ten… My daughters fly up into the sunlight. Live well, for Bean too."
        },
        {
          "t": "Rest inside and see them off",
          "msg": "Inside the warm nest, I listened to the wings. The sound of my daughters leaving, one by one."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "Autumn in the Paper House",
      "cause": "old age",
      "line": "I woke up alone in a crack in a villa wall this spring. I chewed paper and raised a thousand. New queens were born in the rooms Bean built on moving day, and they flew away. I won't make it through this winter. You get through it for me. When spring comes, start by chewing paper and build a house."
    },
    "N1": {
      "title": "Small House in the Bush",
      "cause": "old age",
      "line": "The nest in the bush stayed small. Only a few new queens, but they flew away. One is enough. I started alone this spring too."
    },
    "N2": {
      "title": "Bean's Empty Spot",
      "cause": "old age",
      "line": "The new queens flew away. But that summer, in front of the convenience store, why did I turn and leave Bean? I keep seeing her empty spot at the nest entrance."
    },
    "D1": {
      "title": "Basement Slipper",
      "cause": "a slipper",
      "line": "I only wanted to warm up. I should've stayed out of people's houses."
    },
    "D2": {
      "title": "Spring Magpie",
      "cause": "a magpie",
      "line": "Just one more flower. I hadn't even found a place to build yet."
    },
    "D3": {
      "title": "AC Fan Blades",
      "cause": "an AC fan",
      "line": "It looked cozy. But that was where the wind gets made."
    },
    "D4": {
      "title": "The Bench",
      "cause": "a swatting hand",
      "line": "I only wanted a little wood for paper. I wasn't going to sting."
    },
    "D5": {
      "title": "Stolen Nest",
      "cause": "another queen",
      "line": "Someone else's eggs will go in the rooms I chewed."
    },
    "D6": {
      "title": "White Mist",
      "cause": "bug spray",
      "line": "It was the day Bean was born."
    },
    "D7": {
      "title": "Weed Trimmer",
      "cause": "a weed trimmer",
      "line": "The whole bush went flying. Should've built up high."
    },
    "D8": {
      "title": "Plastic Bottle",
      "cause": "a wasp trap",
      "line": "The sweet smell was all a trap. There are lots of other wasps inside."
    },
    "D9": {
      "title": "Soda Can",
      "cause": "a soda can",
      "line": "It's dark and sweet inside the can. Bean is next to me, so it's less scary."
    },
    "D10": {
      "title": "Nest Removal",
      "cause": "nest removal",
      "line": "The firefighter was just doing his job. And we were just living."
    },
    "D11": {
      "title": "Autumn Web",
      "cause": "a spider",
      "line": "My daughters have all left. That's enough."
    },
    "D12": {
      "title": "Blue Sparks",
      "cause": "an electric swatter",
      "line": "I was only looking for a window to get out."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "My wings are heavy. Just one more sheet of paper, then I'll rest."
    },
    "W1": {
      "title": "Empty Belly",
      "cause": "starvation",
      "line": "One sip of nectar would have been enough."
    }
  }
});
