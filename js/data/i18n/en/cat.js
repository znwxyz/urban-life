/* 길고양이 영어판 문장. 모양은 js/data/species/cat.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'cat', text);
})({
  "name": "Stray Cat",
  "place": "the coal-briquette shed behind a little shop, at the top of a hill",
  "intro": "An alley at the top of a hill in Seoul. In the coal-briquette shed behind Grandma's little shop, in a cardboard box, I was born with three brothers and sisters. They say street cats usually live two or three years. Our alley has lots of grandmas and grandpas. Lots of sparrows too. Every tiled roof has a nest in it.",
  "kidUnit": "kittens",
  "scenes": {
    "C1": {
      "title": "Three Tail Feathers",
      "text": "A baby sparrow fell out of the roof tiles onto the steps. I pounced, but only its tail feathers came off. It slipped away. Three feathers were left in my mouth. Now it's on the lid of a big clay jar, cheeping at me, mad. It has a white spot on top of its head.",
      "choices": [
        {
          "t": "Take the feathers to my box",
          "msg": "I hid the feathers in our box in the shed. My brothers and sisters come sniffing. Not sharing. My first catch. Half of one."
        },
        {
          "t": "Chase it up the wall",
          "msg": "I climbed all the way up the wall. It hopped over to the next roof. I didn't know how to get down, so I cried until evening. Mom came and carried me down by the scruff.",
          "risk": {
            "msg": "On the other side of the wall is the road. My paw slips. A motorbike gets louder."
          }
        },
        {
          "t": "Go drink Mom's milk",
          "msg": "Mom sniffed the feather smell on my mouth. Then she licked my face."
        },
        {
          "t": "Cry back at the cheeping",
          "msg": "I go mew, it goes cheep. Mew. Cheep. We kept at it until Grandma from the shop laughed and tossed me a dried anchovy."
        }
      ]
    },
    "C2": {
      "title": "The Tin Pot",
      "text": "Mom hasn't come back for five days. Every evening at sundown, Grandma from the shop puts a tin pot under her wooden bench. Rice mixed with anchovies. \"Eat up. No mom, you still have to eat to grow.\"",
      "choices": [
        {
          "t": "Sniff Grandma's hand",
          "msg": "Her hand smells like anchovies and pain patches. She rubbed my forehead with her thumb. Then she pushed the pot my way."
        },
        {
          "t": "Shove my face in the pot",
          "msg": "I licked it clean to the bottom before the others got there.",
          "hurt": {
            "msg": "I ate too fast and got an anchovy bone stuck in my throat. I hacked all night."
          }
        },
        {
          "t": "Climb onto the bench",
          "msg": "The bench soaks up sun all day, so it's warm. I lay next to Grandma and listened to her radio."
        },
        {
          "t": "Go down the hill",
          "msg": "I followed the market smell all the way down the hill and back. In front of the fish shop I found something with scales on it and ate it.",
          "risk": {
            "msg": "The bottom of the hill is a big road. Lights are coming from both sides."
          }
        }
      ]
    },
    "C3": {
      "title": "Cheep Cheep Cheep Cheep",
      "text": "Summer afternoon. I'm dozing in the shade under a wall. The white-spot sparrow is going cheep cheep cheep cheep on the power pole, making a fuss. I open my eyes. The Jindo dog from the house at the end of the alley has broken its leash. It sees me.",
      "choices": [
        {
          "t": "Leap up onto the wall",
          "msg": "I was up the wall in one jump. The dog barked below until its owner dragged it away. Only then did the sparrow go quiet. It woke me up on purpose."
        },
        {
          "t": "Puff up and hiss",
          "msg": "I puffed up all my fur and the dog stopped short. Its owner came running.",
          "hurt": {
            "msg": "Its teeth grazed my side. A whole clump of fur came out."
          }
        },
        {
          "t": "Hide in the drain gap",
          "msg": "I lay flat in the drain smell for a long time. Until the cheeping stopped."
        },
        {
          "t": "Ignore it, keep sleeping",
          "msg": "The dog just sniffed me and walked on. The sparrow kept cheeping for a long time after.",
          "risk": {
            "msg": "Its breath is right by my ear."
          }
        }
      ]
    },
    "C4": {
      "title": "Briquette Ash",
      "text": "It's snowing. Every morning, each house sets its burnt-out coal briquettes by the gate. Fresh ones stay warm a long time. In our box in the shed it's just me and the three feathers now. Under the little truck at the end of the alley, melted water has pooled.",
      "choices": [
        {
          "t": "Press my back to the ash",
          "msg": "My back gets toasty. Grandma laughed. \"Look at him, he knows briquettes cost money.\" Then she gave me rice in steaming soup.",
          "hurt": {
            "msg": "I got too close and the tips of my whiskers curled up and burned."
          }
        },
        {
          "t": "Lick the water under the truck",
          "msg": "I licked the melted water between the ice. My throat's a little less dry.",
          "risk": {
            "msg": "The water tastes sweet. Strangely sweet."
          }
        },
        {
          "t": "Get under the shop's heater",
          "msg": "I got under the chair by the heater. Grandma pretended not to see. I found a squid leg a customer dropped, too.",
          "hurt": {
            "msg": "A customer slammed the door and caught my tail."
          }
        },
        {
          "t": "Curl up on the feathers",
          "msg": "I put the three feathers under my belly and curled into a ball. They hardly smell like sparrow anymore.",
          "hurt": {
            "msg": "The wind got into the box all night. My nose is running."
          }
        }
      ]
    },
    "C5": {
      "title": "The Fur Thief",
      "text": "It's spring. My fur is coming out in clumps. I'm napping in the sun between the jars on the rooftop when my back starts to prickle. I open my eyes. The white-spot sparrow has a beakful of my fur. Must be for its nest.",
      "choices": [
        {
          "t": "Hold still and let it pluck",
          "msg": "I closed my eyes and pretended not to notice. It came back three times. My back feels a bit cooler."
        },
        {
          "t": "Swat at it",
          "msg": "My paw hit air. It sat on the clothesline with my fur still in its beak. Cheep. It's faster than me."
        },
        {
          "t": "Rub myself on the jars",
          "msg": "I rubbed against the jars and fur came off in big tufts. It picked up every bit. The nest in the roof tiles must be yellow by now.",
          "hurt": {
            "msg": "A jar lid slid off and landed on my paw."
          }
        },
        {
          "t": "Pounce on the pigeon",
          "msg": "I missed the pigeon by the water tank. But I caught a rat under a flowerpot.",
          "hurt": {
            "msg": "A pigeon wing smacked me in the face and I rolled across the roof."
          }
        }
      ]
    },
    "C6": {
      "title": "Red Letters",
      "text": "Red letters have appeared on every wall in the alley. VACANT. It means nobody lives there anymore. Today a moving truck stopped in front of Grandma's shop. She sets the pot under the bench and pours in a whole bag of anchovies.",
      "choices": [
        {
          "t": "Rub against Grandma's legs",
          "msg": "Grandma crouched down and stroked my back for a long time. \"They say no cats in the apartment.\" The truck went down the hill. The pot is heaped with anchovies."
        },
        {
          "t": "Jump in the back of the truck",
          "msg": "I hid in a gap behind a dresser. The truck stopped at a light by the market at the bottom of the hill. I got scared and jumped off. The truck kept going.",
          "hurt": {
            "msg": "The truck lurched and I tumbled around in the back."
          }
        },
        {
          "t": "Eat the anchovies first",
          "msg": "I stuffed my mouth with anchovies and chewed. When I looked up, the truck was gone. I didn't get to say goodbye."
        },
        {
          "t": "Watch from the bench",
          "msg": "I watched until the truck turned the corner. Grandma waved out the window."
        }
      ]
    },
    "C7": {
      "title": "Empty Houses",
      "text": "Almost everyone has left the alley. The pot's been empty a long time. I go into a house with no door. The calendar and the TV are still there on the floor. Every empty house has more rats. In a corner there's a flat board with an anchovy stuck on it.",
      "choices": [
        {
          "t": "Wait at the rat hole",
          "msg": "I waited half a day. The moment the rat poked its head out, I got it. Just like Mom used to.",
          "hurt": {
            "msg": "The rat bit my nose. It wants to live too."
          }
        },
        {
          "t": "Eat the anchovy on the board",
          "msg": "I nibbled carefully at the edge. Didn't step on it.",
          "risk": {
            "msg": "My front paw is stuck to the board. I push with a back paw to pull free. Now that's stuck too."
          }
        },
        {
          "t": "Sleep in a left-behind quilt",
          "msg": "Someone left a cotton quilt. It still smells a little like people."
        },
        {
          "t": "Go see the sparrow nest",
          "msg": "Babies are cheeping in the roof tiles. The white-spot sparrow flies in and out with bugs. It looks busy. I lay on the roof and we sat in the sun together."
        }
      ]
    },
    "C8": {
      "title": "The Covered Cage",
      "text": "At night, strangers come. They shine flashlights into the empty houses one by one, calling \"Here, kitty kitty.\" They put a wire cage covered with cloth at the mouth of the alley. It smells like tuna inside. The striped one who went in last week never came back.",
      "choices": [
        {
          "t": "Go into the cage",
          "msg": "Clack. Through the cloth I hear, \"Good kitty, good kitty.\" I'm in a car, going down the hill."
        },
        {
          "t": "Hide up on the roof",
          "msg": "I lay flat on the roof. The flashlight swept below me a few times. Right next to me, in the roof tiles, I could hear the sparrows sleeping."
        },
        {
          "t": "Steal just the tuna",
          "msg": "I reached in with one paw and dragged the can out. Pretty clever, right?",
          "hurt": {
            "msg": "The door clacked down on the tip of my tail. I barely got it out."
          }
        },
        {
          "t": "Follow those people",
          "msg": "They were counting the cats that were left. \"Eleven.\" I got counted too. They left a handful of food under the walls."
        }
      ]
    },
    "C9": {
      "title": "The Excavator",
      "text": "The ground's been shaking since morning. An excavator bites Grandma's shop roof off in one mouthful. Tiles pour down. The sparrow nest was in those tiles. The white-spot sparrow is hopping back and forth on the broken pieces.",
      "choices": [
        {
          "t": "Stay quietly by the sparrow",
          "msg": "We stayed there, the two of us, until the dust settled. A ball of yellow fur rolled out of the broken tiles. My fur. The sparrow picked it up again and flew to a pole by the construction site. I went that way too."
        },
        {
          "t": "Hide in an empty closet",
          "msg": "I lasted the day in a closet. In the evening the noise stopped and I came out.",
          "risk": {
            "msg": "The closet door rattles. Dirt pours from the ceiling."
          }
        },
        {
          "t": "Go down to the market",
          "msg": "I got away from the dust and went all the way down the hill. It smells like fish."
        },
        {
          "t": "Catch a fleeing rat",
          "msg": "When the houses come down, the rats run out. I caught one.",
          "hurt": {
            "msg": "I stepped between fallen bricks and twisted my paw."
          }
        }
      ]
    },
    "B1": {
      "title": "The Market Below",
      "text": "The market at the bottom of the hill. The fish shop man tosses fish heads. But a tom with a torn ear runs this place. In a corner, someone left some meat. Up on the hill, it goes boom, boom all day.",
      "choices": [
        {
          "t": "Go back up the hill",
          "msg": "I climbed back toward the booming. That's our alley up there."
        },
        {
          "t": "Catch the fish heads",
          "msg": "The man tosses me one every day at this time. I've settled in at the market."
        },
        {
          "t": "Fight the boss",
          "msg": "My ear got torn, but the boss turned away first. This market is mine now.",
          "risk": {
            "msg": "The boss has me by the scruff. He won't let go."
          }
        },
        {
          "t": "Eat the meat in the corner",
          "msg": "I ate till I was full. It tasted a little funny, but it was fine. I've settled in at the market.",
          "risk": {
            "msg": "My belly feels like it's burning. My legs won't listen."
          }
        }
      ]
    },
    "C10": {
      "title": "The Fence",
      "text": "Where our alley was, there's a tall steel wall now. Inside it, a building goes up one floor at a time. At night the guard puts food in a paper cup for me. He calls me \"Yellow.\" The white-spot sparrow has built a nest in a hole in the pipe of the site sign.",
      "choices": [
        {
          "t": "Eat from the paper cup",
          "msg": "He sets the cup down. \"Easy, Yellow.\" First time anyone's given me a name. I don't mind it."
        },
        {
          "t": "Sneak into the site",
          "msg": "Under the shipping containers the wind's not so bad. The workers drop bits of their lunch, too.",
          "risk": {
            "msg": "A dump truck is backing up by the dirt pile. The beeping is too close."
          }
        },
        {
          "t": "Go by the guard's heater",
          "msg": "He leaves his door open a crack. The box next to the heater is warm.",
          "hurt": {
            "msg": "I got too close to the heater. My whiskers curled up again."
          }
        },
        {
          "t": "Watch the pipe hole",
          "msg": "Cheeping comes from the pipe. The white-spot sparrow flies in and out. So it made a home on this wall too."
        }
      ]
    },
    "C11": {
      "title": "The Fallen Chick",
      "text": "The hill is apartments now. The flower beds are bigger than our alley, but I don't know anyone. Even the guard is new. Today a baby sparrow fell under the boxwood. A young cat I don't know is wiggling its rear. Up in the bush, the white-spot sparrow is cheeping like mad.",
      "choices": [
        {
          "t": "Stand in front of the chick",
          "msg": "I sat between the chick and the young cat and thumped my tail. The young cat flattened its ears and left. The chick fluttered back up into the boxwood.",
          "hurt": {
            "msg": "The young cat's claws split the tip of my nose."
          }
        },
        {
          "t": "Fight the young cat",
          "msg": "Hiss! I'm old, but this flower bed is mine. The young cat backed off. The chick climbed up while it could.",
          "risk": {
            "msg": "The young cat is faster than me. My legs have no strength."
          }
        },
        {
          "t": "Yowl for a person",
          "msg": "I yowled as loud as I could and the guard looked out. The young cat ran. He put the chick back in the boxwood with his gloved hand."
        },
        {
          "t": "Look away, bask in the sun",
          "msg": "I closed my eyes. The cheeping went on a long time. Then it stopped."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "The Yellow Nest",
      "cause": "old age",
      "line": "The white-spot sparrow and I sit under the boxwood a lot, talking about the old days. Grandma's pot. The briquette ash. The roof tiles. Every spring it still plucks fur off my back. \"That's why my kids aren't scared of cat smell.\" \"That's a problem.\" We laughed for a long time."
    },
    "N1": {
      "title": "Market Cat",
      "cause": "old age",
      "line": "My spot was under the fish shop's bench. The booming up the hill stopped a few years later. I never went up to look."
    },
    "N2": {
      "title": "Inside the Window",
      "cause": "old age",
      "line": "I got adopted along with the other cats rescued from the hill. There's always food. When a sparrow flies past the window, I check the top of its head first. For a white spot."
    },
    "N3": {
      "title": "New Faces",
      "cause": "old age",
      "line": "Everyone at the new flower beds was kind. All of them faces I'd never seen. At some point, the white-spot sparrow stopped coming."
    },
    "D1": {
      "title": "Over the Wall",
      "cause": "a motorbike",
      "line": "The sparrow flew over. I forgot I don't have wings."
    },
    "D2": {
      "title": "The Big Road Below",
      "cause": "a car",
      "line": "I only followed the smell of the market. I didn't know a road could be that wide."
    },
    "D3": {
      "title": "The Jindo Dog",
      "cause": "a dog",
      "line": "And the sparrow tried so hard to wake me."
    },
    "D4": {
      "title": "Sweet Water",
      "cause": "antifreeze",
      "line": "Why was that water so sweet?"
    },
    "D5": {
      "title": "Glue",
      "cause": "glue trap",
      "line": "The board was for rats. It can't tell me from a rat."
    },
    "D6": {
      "title": "The Closet",
      "cause": "demolition",
      "line": "The excavator man didn't know I was in the closet."
    },
    "D7": {
      "title": "Meat in the Corner",
      "cause": "rat poison",
      "line": "It was meat put out for the market rats. Well. At least I was full."
    },
    "D8": {
      "title": "Beep Beep",
      "cause": "a dump truck",
      "line": "Beep beep meant get out of the way."
    },
    "D9": {
      "title": "The Young Cat",
      "cause": "a turf fight",
      "line": "This flower bed is his now. I used to be that fast."
    },
    "D10": {
      "title": "The Market Boss",
      "cause": "a turf fight",
      "line": "The wound on my scruff never healed. Up in our alley, there was never anything to fight about."
    },
    "W0": {
      "title": "Too Weak",
      "cause": "weakness",
      "line": "My legs are heavy. I can't make it to the sunny spot."
    },
    "W1": {
      "title": "Starving",
      "cause": "starvation",
      "line": "I keep thinking about Grandma's pot."
    }
  }
});
