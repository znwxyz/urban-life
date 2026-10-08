/* 바퀴벌레 영어판 문장. 모양은 js/data/species/cockroach.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'cockroach', text);
})({
  "name": "Cockroach",
  "place": "a crack in the kitchen wall of a tteokbokki snack shop",
  "intro": "I'm a German cockroach. I hatched in a crack in the kitchen wall of a little snack shop that sells tteokbokki, along with forty brothers and sisters. The very last to hatch had one bent antenna. So we call him Curly. Wherever I go, Curly follows with his antenna on my back leg.",
  "kidUnit": "babies",
  "scenes": {
    "C1": {
      "title": "Orange Drops",
      "text": "A man in work clothes came by earlier and squeezed orange drops along every tile seam. It smells sweet. I've never smelled anything like it. The big brothers who went out first haven't come back. Curly's antenna keeps drifting toward the drops.",
      "choices": [
        {
          "t": "Drag Curly back into the crack",
          "msg": "Curly kicked and squirmed. The two of us went hungry in the crack for three days. The brothers who went to the drops never came back."
        },
        {
          "t": "Taste one drop",
          "msg": "Just the tip of my tongue, then I stopped. There was a bitter smell under the sweet.",
          "risk": {
            "msg": "Sweet. So sweet. But why are my legs so heavy?"
          }
        },
        {
          "t": "Just grab the crumbs nearby",
          "msg": "I carried back breadcrumbs one at a time. Enough for Curly too.",
          "hurt": {
            "msg": "A brother was flipped over and thrashing by the drops. I got tangled in him and sprained a leg."
          }
        },
        {
          "t": "Go to the drain with Curly",
          "msg": "A few wet grains of rice. That sweet smell doesn't reach down here.",
          "hurt": {
            "msg": "Dishwater came pouring down. Curly and I got washed a long way."
          }
        }
      ]
    },
    "C2": {
      "title": "The Delivery Bag",
      "text": "Dinner orders are piling up. Under the packing counter, delivery bags stand in a row. Every one smells like tteokbokki. Next to them is a little paper house I've never seen. Something tasty smells inside. The ones who go in don't come out.",
      "choices": [
        {
          "t": "Slip in between the napkins",
          "msg": "I slipped in between the napkins. I look back and Curly's at the end of the counter, waving his antenna. The bag gets tied shut. A motorbike goes vroom. An elevator goes ding."
        },
        {
          "t": "Stay in the kitchen with Curly",
          "msg": "All the bags went out. Curly and I stayed under the counter."
        },
        {
          "t": "Grab crumbs at the paper house",
          "msg": "I grabbed crumbs off the doorstep and came right out. The floor was sticky. Curly tried to follow me in. I blocked him, and I was the one who fell into a bag.",
          "risk": {
            "msg": "Huh. My leg won't come up. One, two... all six."
          }
        },
        {
          "t": "Nap in the shade under the counter",
          "msg": "I slept snuggled up to Curly. When I woke, I was between napkins. The bag is swinging. Curly's smell is getting farther away."
        }
      ]
    },
    "C3": {
      "title": "The 12th-Floor Doorway",
      "text": "The bag is set down on the floor by the front door. An apartment, 12th floor. The lady who lives alone unties the knot. \"Friday means tteokbokki.\" The living room is bright. Under the shoe cabinet it's dark.",
      "choices": [
        {
          "t": "Dash under the shoe cabinet",
          "msg": "A 1-centimeter gap under the shoe cabinet. Smells like dust and sand. Nobody saw me.",
          "hurt": {
            "msg": "There was a cobweb in the corner. I barely pulled one leg free."
          }
        },
        {
          "t": "Run across to under the sofa",
          "msg": "I made it under the sofa in one go. Cookie crumbs everywhere.",
          "risk": {
            "msg": "\"Eek!\" That's a slipper."
          }
        },
        {
          "t": "Cling to the tteokbokki tub",
          "msg": "I drank all the sauce I wanted and slipped out. It tastes like the shop.",
          "hurt": {
            "msg": "A finger pulling out the tub squashed me."
          }
        },
        {
          "t": "Hide under the doormat",
          "msg": "It's warm under the mat, but there's nothing to eat."
        }
      ]
    },
    "C4": {
      "title": "Behind the Fridge",
      "text": "The lights go off. The fridge motor hums and it's warm. The sink strainer smells strong. But the floor between here and there is wide open. It's my first night sleeping alone.",
      "choices": [
        {
          "t": "Go to the sink strainer",
          "msg": "I ate till I almost burst and shot back behind the fridge.",
          "risk": {
            "msg": "Click, the light's on. Then a hiss."
          }
        },
        {
          "t": "Chew the grease under the stove",
          "msg": "The burnt-on grease is nutty and good.",
          "hurt": {
            "msg": "I passed a burner that wasn't cool yet. The tip of my antenna got singed."
          }
        },
        {
          "t": "Go by the fridge motor",
          "msg": "It's warm, and crumbs roll in. This is it. This is my home. There's room for Curly too."
        },
        {
          "t": "Wait one more day under the shoes",
          "msg": "The kitchen's too far. Just one more day."
        }
      ]
    },
    "C5": {
      "title": "Friday Night",
      "text": "A week goes by. Friday night, the tteokbokki smell again. The lady spreads newspaper on the living room floor and eats in front of the TV. It's from the same snack shop. Maybe Curly rode in the bag.",
      "choices": [
        {
          "t": "Check the napkins in the bag",
          "msg": "I lifted every napkin, one by one. Just tteokbokki smell. No Curly.",
          "hurt": {
            "msg": "Her hand crumpled the bag and almost crumpled me too."
          }
        },
        {
          "t": "Eat rice cake off the paper",
          "msg": "One piece of rice cake is as big as a boulder. It's so spicy my antennae tingle.",
          "risk": {
            "msg": "The lady rolls up a sheet of newspaper."
          }
        },
        {
          "t": "Just listen from under the sofa",
          "msg": "Slurp, smack. TV laughter. When she's done, she ties the bag and puts it by the front door."
        },
        {
          "t": "Wait for Curly by the bag's knot",
          "msg": "I waved my antennae by the knot all night. No answer. I ate one dropped sesame seed and went back. I'll come again next Friday."
        }
      ]
    },
    "C6": {
      "title": "White Round Boxes",
      "text": "The lady must have seen black droppings under the sink. She put little white round boxes in every corner. It's that sweet smell from the wall at the snack shop. The roach from downstairs who ate from one yesterday is lying flipped over by the wall today.",
      "choices": [
        {
          "t": "Skip the sweet, check the rice bin",
          "msg": "There's a bitter smell hiding under the sweet. The one I smelled the day I dragged Curly away. I ate rice bran under the rice bin instead."
        },
        {
          "t": "Just one bite of the bait",
          "msg": "Tasty, and I'm fine? Must have been an old box.",
          "risk": {
            "msg": "I was fine at first. Really. At first."
          }
        },
        {
          "t": "Eat the crumbs by the flipped one",
          "msg": "There are crumbs nobody's touched. I didn't touch the flipped one.",
          "risk": {
            "msg": "I must have stepped in what was on it. Now I'm the one shaking."
          }
        },
        {
          "t": "Go hungry behind the fridge",
          "msg": "I starved and waited until the boxes were gone. Hungry, but alive."
        }
      ]
    },
    "C7": {
      "title": "An Egg Case Like a Bean",
      "text": "There's an egg case on my rear end. It looks like a kidney bean. I'm heavy and slow. I'm thirsty, but the water is down the bathroom drain. They say a house centipede lives there. The one with all the legs.",
      "choices": [
        {
          "t": "Too heavy. Drop the egg case",
          "msg": "I feel lighter. The egg case I dropped dried right up."
        },
        {
          "t": "Carry it to the drain for water",
          "msg": "I went and came back, slowly. Three weeks later, forty babies came out.",
          "risk": {
            "msg": "Thirty legs burst out of a crack in the tiles."
          }
        },
        {
          "t": "Make do with the fridge drip tray",
          "msg": "Water pooled in the drip tray under the fridge. Lukewarm and fishy, but it's water. Three weeks later, forty white babies came out behind the fridge. The last one out has one bent antenna.",
          "hurt": {
            "msg": "I slipped on the edge of the tray and lost a leg."
          }
        },
        {
          "t": "Leave it with the other roaches",
          "msg": "I tucked it next to the crowd under the sink. About half hatched. I don't know about the rest."
        }
      ]
    },
    "C8": {
      "title": "The Bug Bomb",
      "text": "The lady set off a bug bomb and left. White smoke fills up from the floor. Everyone's running, up and out, all at once. The babies won't budge from behind the fridge.",
      "choices": [
        {
          "t": "Take the pipes downstairs",
          "msg": "I spent a day in the kitchen downstairs and came back. About half the babies were left.",
          "risk": {
            "msg": "Downstairs is white smoke too. Today they're spraying the whole complex."
          }
        },
        {
          "t": "Hide deep in the motor with them",
          "msg": "The smoke covered the floor, then cleared. It didn't get inside the motor. Coughing, I counted the babies.",
          "hurt": {
            "msg": "A wisp of smoke seeped in through a gap in the motor. Cough."
          }
        },
        {
          "t": "Go down the drain, hold my breath",
          "msg": "I held my breath in the wet pipe and hung on. I thought I was going to die."
        },
        {
          "t": "Squeeze out under the front door",
          "msg": "I waited in the hallway all day, hungry.",
          "hurt": {
            "msg": "Someone walking down the hall kicked me with their toe."
          }
        }
      ]
    },
    "C9": {
      "title": "Moving Day in Winter",
      "text": "The lady is moving out. It's the middle of winter, but every door is open. Boxes pile up, and tape screeches all day. She's leaving the fridge. The next person will use it.",
      "choices": [
        {
          "t": "Ride in a moving box",
          "msg": "I got into a gap in the boxes. The truck rattles. Where will next Friday's bag go?",
          "hurt": {
            "msg": "One of my legs stuck to the box tape and tore off."
          }
        },
        {
          "t": "Raid crumbs where the boxes were",
          "msg": "Years of crumbs were piled up. A feast. Then I went back behind the fridge.",
          "risk": {
            "msg": "The heat's been cut off. The wind is cold. My legs are getting stiff."
          }
        },
        {
          "t": "Rest in the shade under a box",
          "msg": "I didn't move until the move was over. The door closed and the apartment went quiet."
        },
        {
          "t": "Stay behind the fridge",
          "msg": "The fridge stays. The new person is a college student. The first night, he ordered tteokbokki. From that shop. It's the only snack shop in the neighborhood."
        }
      ]
    },
    "C10": {
      "title": "The Flashlight",
      "text": "The college student orders tteokbokki every Friday. Every Friday I go to the front door and smell the bag. It's a habit now. Today isn't Friday. A pest control man comes and shines a flashlight behind the fridge.",
      "choices": [
        {
          "t": "Push the babies into the motor",
          "msg": "I nudged them in one by one with my antennae. The light passed. Two more egg cases hatched in the meantime. It's a big family."
        },
        {
          "t": "Run away from the light",
          "msg": "I made it under the sink in one run. The man only looked behind the fridge.",
          "risk": {
            "msg": "There was a light on the other side too. Hiss."
          }
        },
        {
          "t": "Freeze and play dead",
          "msg": "I didn't even move my antennae. The man said, \"Clean here,\" and left. After squeezing orange drops along every door gap."
        },
        {
          "t": "Grab the little one by the light",
          "msg": "The youngest was crawling toward the light. I grabbed its back leg and dragged it back. Like I dragged Curly, long ago. It squirmed the exact same way. Two more egg cases hatched in the meantime.",
          "hurt": {
            "msg": "The light hit my back. Hiss, once. I barely crawled behind the motor."
          }
        }
      ]
    },
    "C11": {
      "title": "The Last Friday",
      "text": "Winter is almost over. My legs are slow now. The front door takes forever. But it's Friday. The student sets the tteokbokki bag by the door and goes to the bathroom. A napkin that fell out of the bag is rustling. From under it pokes one bent antenna.",
      "choices": [
        {
          "t": "Touch antennae",
          "msg": "Our tips touched. It smells like tteokbokki. And under that, a very old smell. The smell of the wall crack."
        },
        {
          "t": "Climb on top of the bag",
          "msg": "I looked down from the top of the bag. Under the napkin, an old roach is curled up.",
          "risk": {
            "msg": "\"Ugh, a roach!\" A hand with a tissue comes down."
          }
        },
        {
          "t": "Go call the family",
          "msg": "I went behind the fridge and came back. My legs shook, scared I'd be too late. When I got back, the napkin was still there."
        },
        {
          "t": "Wait under the shoes for him",
          "msg": "I waited under the shoe cabinet. Something is slowly crawling out from under the napkin."
        }
      ]
    },
    "K1": {
      "title": "Closing Time at the Shop",
      "text": "Curly and I stayed at the snack shop. Lots to eat, but lots of people too. Delivery bags are going out in a line again today. The guy closing up drags out a hose to wash down the floor.",
      "choices": [
        {
          "t": "Ride a delivery bag this time",
          "msg": "I slipped in between the napkins. Curly was one step late again. He's at the end of the counter, waving his antenna.",
          "hurt": {
            "msg": "The hand tying the bag squished me a little."
          }
        },
        {
          "t": "Hold out in the crack with Curly",
          "msg": "We didn't come out of the crack until the floor was washed. Curly slept with his antenna on my leg."
        },
        {
          "t": "Lick the oil by the fryer",
          "msg": "The cooled oil is nutty and good. Nobody saw me.",
          "risk": {
            "msg": "\"Another one.\" He picks up the spray."
          },
          "hurt": {
            "msg": "Oil spat out of the fryer. Hot!"
          }
        },
        {
          "t": "Pick up crumbs off the floor",
          "msg": "Curly and I shared bits of fried batter.",
          "risk": {
            "msg": "Whoosh. The hose water sweeps the floor."
          }
        }
      ]
    },
    "B1": {
      "title": "Another Neighborhood",
      "text": "The new home is an apartment across the river, 3rd floor. Other roaches already live behind the fridge. Friday night, a delivery comes. A jjajangmyeon bowl, wrapped in plastic. Not the tteokbokki smell.",
      "choices": [
        {
          "t": "Eat the sauce through the wrap",
          "msg": "Salty and sweet. I've never tasted it before.",
          "hurt": {
            "msg": "A foot putting the bowl outside kicked me."
          }
        },
        {
          "t": "Squeeze in with the roaches here",
          "msg": "The strangers felt me over with their antennae for a long time. Then they made room."
        },
        {
          "t": "Try the paper house under the sink",
          "msg": "I only ate crumbs off the doorstep and came out. The floor is sticky.",
          "risk": {
            "msg": "Huh. My leg won't come up. One, two... all six."
          }
        },
        {
          "t": "Wait at the door for next Friday",
          "msg": "Next Friday, jjajangmyeon again. And the Friday after that."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "Friday Smells Like Tteokbokki",
      "cause": "old age",
      "line": "An old roach crawled out from under the napkin. One antenna is bent. \"Sis, you smell like a fridge.\" \"You still smell like tteokbokki.\" That night behind the fridge, the babies took turns touching their uncle's bent antenna."
    },
    "N1": {
      "title": "Room for Two Behind the Fridge",
      "cause": "old age",
      "line": "Curly came on the bag. Behind the fridge there's plenty of room for two. Curly says the motor's too loud. I like the sound."
    },
    "N2": {
      "title": "The Jjajangmyeon Bag",
      "cause": "old age",
      "line": "The new home gets a delivery every Friday too. Always jjajangmyeon. Still, every Friday I go to the front door and look under the napkins."
    },
    "N3": {
      "title": "Oldest in the Wall",
      "cause": "old age",
      "line": "Curly and I are the oldest in the snack shop wall. On days they squeeze out orange drops, I grab Curly's back leg. Even at his age, he still squirms."
    },
    "D1": {
      "title": "Orange Drops",
      "cause": "roach bait",
      "line": "I'd never had anything that sweet. I hope Curly doesn't follow me and eat some."
    },
    "D2": {
      "title": "The Paper House",
      "cause": "glue trap",
      "line": "Lots of friends inside. All stuck, just like me."
    },
    "D3": {
      "title": "The Slipper",
      "cause": "a slipper",
      "line": "There's nowhere to hide in the middle of a living room."
    },
    "D4": {
      "title": "Hiss",
      "cause": "bug spray",
      "line": "Half a second after the light came on. I was exactly half a second late."
    },
    "D5": {
      "title": "Dominoes",
      "cause": "roach bait",
      "line": "Poison comes slowly. Then it passes to the next one who licks me."
    },
    "D6": {
      "title": "Thirty Legs",
      "cause": "a house centipede",
      "line": "The egg case was too heavy to run."
    },
    "D7": {
      "title": "Smoke Downstairs Too",
      "cause": "a bug bomb",
      "line": "It was spraying day for the whole complex. There was nowhere to go."
    },
    "D8": {
      "title": "Winter in an Empty Home",
      "cause": "cold",
      "line": "There were plenty of crumbs. There just wasn't anywhere warm."
    },
    "D9": {
      "title": "The Flashlight",
      "cause": "pest control",
      "line": "The light was so bright I didn't know which way I was running."
    },
    "D10": {
      "title": "Wash-Down",
      "cause": "soapy water",
      "line": "Curly was in the wall crack. Good."
    },
    "D11": {
      "title": "Rolled-Up Newspaper",
      "cause": "a newspaper",
      "line": "It was one piece of tteokbokki from home."
    },
    "D12": {
      "title": "The Tissue",
      "cause": "a tissue",
      "line": "That bent antenna was just a hand's width away."
    },
    "W0": {
      "title": "Too Weak",
      "cause": "weakness",
      "line": "My antennae won't move now. I just wanted to rest a little."
    },
    "W1": {
      "title": "Empty Belly",
      "cause": "starvation",
      "line": "Too many days without finding a single crumb."
    }
  }
});
