import os
import openai

import dotenv

# Load environment variables from .env file
# Needs to have OPENAI_API_KEY set
dotenv.load_dotenv()

"""FIRST PROMPT:

Give me some ideas about games I could build with a new LLM model.

E.g. they should be Space Invaders, Tetris, Chess, Doom, Flipper and a bunch more.

Give me 7 concepts.

For each concept, give me:
1. A fun twist on the name, this could be a pun on the name, or somehow involving AI terms or the like. Give me 5 versions of this.
2. A prompt for an LLM to build the game. Ask the LLM to build on Next App Router, in TypeScript, TailwindCSS. Ask it to use inline SVGs. Ask it to have a visually rich style.

Finally give me the README.md for an open source repository, o1-games, that contains all these games.

---

SECOND PROMPT:

Write me a Python script that will prompt the OpenAI API using o1-preview to make all these games, write the .tsx file for the game, and store in app/{game_slug} files.
"""

# List of games with slugs and prompts
games = [
    {
        'slug': 'space-encoders',
        'name': 'Space Encoders',
        'prompt': 'Create a visually rich, modern rendition of Space Invaders using Next.js App Router in TypeScript and TailwindCSS. Use inline SVGs for all graphics. Implement engaging gameplay where players defend against waves of alien invaders with a sleek, modern design.'
    },
    {
        'slug': 'ai-man',
        'name' : "AI-Man",
        'prompt': 'Build a visually rich, modern version of Pac-Man using Next.js App Router, TypeScript, and TailwindCSS. Incorporate inline SVGs for all characters and maze elements. Implement classic gameplay with contemporary visuals and seamless animations.'
    },
    {
        'slug': 'code-break',
        'name': 'Code Break',
        'prompt': 'Develop a modern, visually stunning version of Breakout using Next.js App Router, TypeScript, and TailwindCSS. Utilize inline SVGs for bricks, paddle, and ball. Implement fluid animations and realistic physics within a polished, vibrant design.'
    },
    {
        'slug': 'ai-steroids',
        'name': 'Aisteroids',
        'prompt': 'Develop a visually rich version of Asteroids using Next.js App Router in TypeScript with TailwindCSS. Use inline SVGs for the spaceship and asteroids. Implement precise controls and fluid animations with a modern graphical style.'
    },
    {
        'slug': 'code-fighter',
        'name': 'Code Fighter',
        'prompt': 'Create a visually stunning fighting game inspired by Street Fighter using Next.js App Router, TypeScript, and TailwindCSS. Use inline SVGs for fighters and backgrounds. Implement smooth animations and responsive controls within a polished interface.'
    },
    {
        'slug': 'code-lemmings',
        'name': 'Code Lemmings',
        'prompt': 'Create a visually appealing version of Lemmings using Next.js App Router, TypeScript, and TailwindCSS. Use inline SVGs for characters and environments. Implement classic puzzle mechanics with modern visuals and animations.'
    },
    {
        'slug': 'code-crush',
        'name': 'Code Crush',
        'prompt': 'Build a visually rich match-three puzzle game inspired by Candy Crush using Next.js App Router, TypeScript, and TailwindCSS. Use inline SVGs for candies and UI elements. Implement engaging mechanics with vibrant visuals and smooth animations.'
    },
    {
        'slug': 'among-code',
        'name': 'Among Code',
        'prompt': 'Create a visually rich social deduction game inspired by Among Us using Next.js App Router, TypeScript, and TailwindCSS. Employ inline SVGs for characters and environments. Implement engaging multiplayer mechanics with polished visuals and seamless user experience.'
    }
]

# Base directory where the app folder is located
base_dir = 'app'

# Ensure the base directory exists
os.makedirs(base_dir, exist_ok=True)

# Iterate over each game
for game in games:
    slug = game['slug']
    prompt = game['prompt']
    name = game['name']
    
    print(f"Generating code for {slug}...")
    
    # Create the directory for the game
    game_dir = os.path.join(base_dir, slug)
    os.makedirs(game_dir, exist_ok=True)

    prompt +=f"\n\nCall the game {name} as a nod to the original."""

    prompt +=f"\nDon't use browser alert windows for game updates such as 'Game Over' or 'You Win'. Instead, show the update in-game on-screen."""

    prompt += "\n\nOutput only the code that I should put into the page.tsx file for the game. Don't include any text before or after. Output all the code needed, don't skip anything."
    
    # Construct the API request
    response = openai.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model='o1-preview'
    )
    
    # Get the generated code
    code = response.choices[0].text.strip()
    
    # Define the file path
    file_path = os.path.join(game_dir, 'page.tsx')
    
    # Write the code to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"{slug}:")
    print(prompt)
    print("----")

    

print("All games have been generated.")
