# Quiz Navigator

## Overview

Quiz Navigator is a React-based web application designed to help users practice for certification exams through interactive quizzes. It supports multiple question sets (e.g., Kubernetes and AWS certifications), offers features like timers, hints, and review modes, and includes a statistics page to track performance. The app features a responsive design with light and dark mode support, ensuring usability across devices, including mobile and high-resolution displays like 4K monitors.

### Features
- **Multiple Question Sets**: Choose from different certification question sets (e.g., Kubernetes, AWS).
- **Interactive Quizzes**: Answer multiple-choice or open-ended questions with a timer option.
- **Hints and Explanations**: Access hints and explanations for each question, with links to official documentation.
- **Review Mode**: Review answers after completing a quiz, including explanations and hints.
- **Statistics Tracking**: View quiz performance metrics, including average score, completion rate, and recent results.
- **Dark Mode**: Toggle between light and dark themes, with consistent background styling across the viewport.
- **Responsive Design**: Centered layout that adapts to various screen sizes, from mobile devices to 4K displays.

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (v14 or higher recommended) and **npm** (v6 or higher)
- A modern web browser (e.g., Chrome, Firefox)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd quiz-navigator
   ```

2. **Install Dependencies**:
   Run the following command to install the required npm packages, including React, React Router, and Tailwind CSS:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   Start the app in development mode:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

4. **Build for Production** (Optional):
   To create a production build, run:
   ```bash
   npm run build
   ```
   The optimized build will be generated in the `build/` directory. You can serve it using a static server (e.g., `npx serve -s build`).

## Usage

1. **Home Screen**:
   - On the home screen, select a question set (e.g., Kubernetes Certification Questions or AWS Certification Questions).
   - Click the toggle button in the top-right corner to switch between light and dark modes.

2. **Quiz Settings**:
   - After selecting a question set, configure the quiz:
     - Enable/disable question shuffling.
     - Set an optional timer (e.g., 10, 20, or 30 minutes).
   - Click "Start Quiz" to begin.

3. **Taking the Quiz**:
   - Answer questions using multiple-choice options or text input for open-ended questions.
   - Use the "Show Hint" button to view hints, which may include links to official documentation.
   - Navigate between questions using "Previous" and "Next" buttons.
   - If a timer is set, the quiz auto-submits when time runs out.

4. **Quiz Results**:
   - After submitting, view your score and options to:
     - Review answers with explanations.
     - Restart the quiz.
     - Return to the home screen.

5. **Statistics**:
   - Access the statistics page from the home screen to view:
     - Average score, completion rate, and total attempts.
     - Recent quiz results (up to 5).
   - Clear statistics if needed.

## Project Structure

- **`src/`**: Contains the source code.
  - **`components/`**: React components (e.g., `Home.tsx`, `Statistics.tsx`).
  - **`ThemeContext.tsx`**: Manages light/dark mode state and toggling.
  - **`questions/`**: JSON files for question sets (e.g., `cka.json`, `aws.json`).
  - **`index.css`**: Global styles, including viewport background and Tailwind directives.
- **`public/`**: Static assets, including `index.html`.
- **`tailwind.config.js`**: Tailwind CSS configuration, including safelisted classes.


## License
This project is licensed under the MIT License. See the `LICENSE` file for details.