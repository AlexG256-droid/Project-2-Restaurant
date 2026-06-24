# Where2Bite

Where2Bite is a restaurant decision maker web app built with Node.js, Express, Vanilla JavaScript, and MongoDB Native Driver.

## Authors

- Victor Cao
- Alexander Gutting

## YouTube Link

Link to video: https://www.youtube.com/watch?v=_eEfZjcKVaA

## Slides Link

Link to slides: https://docs.google.com/presentation/d/1muBppYRrdEvFi9uGlmta_0DSvx7cIOMi_Db3xN7AdGs/edit?slide=id.p#slide=id.p

## Project Objective

Users can register, log in, create restaurant entries, save favorites, and randomly select a restaurant when they cannot decide where to eat.

## Screenshot

<img width="440" height="343" alt="Where2Bite" src="https://github.com/user-attachments/assets/20508af4-94f3-436c-aed0-7ef66d18e2f7" />

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript ES6 Modules
- Node.js
- Express
- MongoDB Native Node.js Driver
- Fetch API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`.

3. Start the server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Important Notes

- This project does not use React.
- This project does not use Mongoose.
- This project does not use template engines.
- Backend uses ES Modules only.

## Use of AI

We used Claude AI and ChatGPT to help write JS code that fits with the Favorites, Restaurants, and Random pages. While we setup the basic HTML and JS structure for those specific pages, the model helped generate some of the JS code needed for the website itself to function properly so that the user can pick and/or add his or her desired restaurants into a specified folder given specific restaurant data that was already added. The model type that Alex used was Claude Opus 4.8. These were the following prompts for the model:

“How can I edit my restaurants.js file so that the user can see different restaurant options to choose from that the user can also add to a favorites folder if interested?”.
“How can I edit my random.js file so that it picks a random item (restaurant) from the restaurants.json file for the user to potentially put in an existing folder?”
“How can I edit my favorites.js file so that it implements a “Favorites” folder that the user can add favorite restaurants to?”
“Does the random picker in HTML and JS successfully pick a random restaurant card for the user? If not, how can I change it so that it does match that criteria?”
