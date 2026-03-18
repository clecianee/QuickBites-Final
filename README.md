# QuickBites

QuickBites is a React web application that allows users to search for recipes, save their favorites, and get suggestions based on the current weather.

This project was built as part of my learning journey into React, APIs, and full-stack development concepts.

---

## Features

- User authentication (login, register, guest mode)
- Protected routes for authenticated users
- Search recipes using the Spoonacular API
- View detailed recipe information in a modal
- Save recipes to a personal collection
- Mark recipes as tried or not tried
- Add and edit personal notes for recipes
- Delete saved recipes
- Weather-based recipe suggestions using Open-Meteo API
- Dynamic city search for weather updates
- Loading states and user feedback messages

---

## Technologies Used

- React
- React Router
- Firebase Authentication
- Firebase Firestore
- Spoonacular API
- Open-Meteo API
- JavaScript
- CSS

---

## How to Run the Project

1. Clone the repository

git clone <your-repo-link>

2. Install dependencies

npm install

3. Create a .env file and add your Spoonacular API key

VITE_SPOONACULAR_API_KEY=your_api_key_here

4. Start the App

npm run dev

Pages:

Auth Page – login or continue as guest
Register Page – create a new account
Home Page – welcome page with weather context
Search Page – search recipes and view suggestions
My Recipes Page – manage saved recipes and notes


Known Limitations for this project:

- Spoonacular API has a daily request limit, so some features may stop working after reaching the limit.
- Weather-based suggestions are simplified (basic categories like soup, salad, etc.).
- Some UI responsiveness can still be improved.

What we've learned with this project:

- How to build a multi-page React application
- How to work with external APIs
- Managing state with hooks and context
- Structuring a project with reusable components
- Handling user authentication and protected routes
- Improving user experience with loading and error states

Possible improvements:

- Improve recipe suggestions with more variety
- Add better form validation
- Improve responsive design across devices
- Add caching to reduce API calls
- Enhance accessibility

Best part about the process:

This project helped us connect multiple concepts together into one application, we focused on making the app functional, and structured, and user-friendly while continuing to improve our skills.

***