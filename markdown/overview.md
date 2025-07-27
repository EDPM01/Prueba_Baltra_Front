## 👋 Overview

Welcome to our technical test and thank you for participating in Baltra’s hiring process! We want you to build a **WhatsApp chatbot** with a simple **web-based scheduling interface**. The goal is to let a user:

1. **Create** a message or announcement,
2. **Schedule** the date and time when it should be sent,
3. **Select** a specific group of recipients, and
4. **Automatically send** the message via WhatsApp at the scheduled time.

This exercise will help us gauge your ability to design an end-to-end solution—from front-end interface to backend services and API integrations—under real-world constraints. Although there is a scope for this test feel free to show us your creativity and coding prowess, you can take this base structure and expand from there!

## 🎯 Project Scope & Requirements

### WhatsApp Integration

- **Requirement**: Integrate with WhatsApp to send messages automatically.
- Set up a Whatsapp for business account and use the test numbers for this test. No need to set up an actual phone number. If you don’t have experience with the whatsapp API there are some great youtube tutorials.

### Scheduling System

- You must implement a mechanism to schedule messages. Acceptable approaches include:
    - Cron-based job scheduling
    - A background worker (Celery, Bull, etc.)
    - Any other scheduling library or cloud-based service

### Web UI for Scheduling

- **Message Authoring**: A text field (or richer editor if you prefer) to write the content.
- **Timing**: A date/time picker or a simple set of dropdowns for day/time.
- **Recipient Group Selection**: Show a list of potential groups/contacts. The user selects which group(s) the message goes to.
- **List of Scheduled Messages**: Display upcoming scheduled messages and their statuses.

### Data Storage

- **Store** messages in a database (or at least persist them so that reboots don’t wipe out the schedule). Any database is fine (SQLite, Postgres, MongoDB, etc.), as long as you clearly document how to run it locally.

## 💻  Technical Details

- **Language/Framework**: You must build the app using Python
- **Front-End**: Please use React
- **Packaging/Deployment**:
    - Ideally, provide a Dockerfile or instructions so we can run your app quickly.
    - Alternatively, a clear README with setup steps is sufficient.

## 📦  Deliverables

By the end of the test, you should provide:

1. **Source Code**
    - A link to a public or private repo with clear commit history.
2. **Technical Documentation**
    - **README**:
        - Setup instructions (how to install dependencies, run migrations if any, and start the server).
        - Explanation of how the scheduling is handled (which library or mechanism you used).
        - Any environment variables needed.
    - **Design Overview**: (recommended but not mandatory) a brief description of your architecture, chosen frameworks, and data models.
3. **Working Demo**
    - We should be able to run your project locally or in Docker, schedule a message, and confirm via WhatsApp that the message gets delivered at the specified time. Set Tomas’ number as one of the recipients (+1 6505165164)

## ✅ Evaluation Criteria

We’ll be looking at the following:

1. **Architecture & Code Organization**
    - How you structure your project, separate concerns, and keep your code maintainable.
2. **API Integration & Data Flow**
    - How smoothly you integrate with the WhatsApp API.
    - How you handle authentication, message formatting, and potential edge cases (e.g., rate limits).
3. **Scheduling Implementation**
    - Clarity and reliability of the job scheduler.
    - Handling of missed schedules or system downtime.
4. **Front-End Usability & UX**
    - A clean, simple UI that anyone can navigate.
    - Clear feedback when a message is scheduled successfully or if an error occurs.
5. **Documentation & Setup**
    - How easy it is for us to clone your repo and get the system running.
    - Clarity and completeness of your README and comments.
6. **Code Quality**
    - Readability, maintainability, and adherence to best practices.
    - Use of meaningful commit messages.

## ⏱️ Timeline & Expectations

- You will have 72 hours to complete this test.
- This doesn’t need to be production-ready code, but it should be demonstrably functional and reasonably robust.
- Optional Additions: Although we believe completion of this test will give us a good understanding of your problem-solving and full-stack engineering we would love to see you go above and beyond,  we are excited to see what you can build! Here are some suggestions but take this in any direction you want:
    - User authentication
    - Data on messages sent, received, recipient interactions, etc…
    - Ability to add images to templates
    - Tests to demonstrate code quality.

## 📝 Final Notes

- **Communication**: If you hit any blocking issues or need clarification, feel free to reach out. We’re here to see how you solve problems, not how you struggle with ambiguous specs. Text Tomas (+1 650 5165164) any time
- **Focus**: Don’t get bogged down in over-engineering. We prefer a clear, concise solution that meets the requirements.

We look forward to seeing what you build—**best of luck!**

---

**From the Baltra team, we thank you for your time and effort on this test**