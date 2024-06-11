# SpeakX Assignment(Full-stack Twitter(X.com) Clone)

Welcome to the SpeakX Assignment repository. This project is a full-stack clone of [X.com (formerly twitter.com)](https://twitter.com/). Below you will find information about the project's features, setup instructions, and other relevant details.

## Project Links

- **Backend URL**: [SpeakX Backend](https://speakx-assignment-m1b0.onrender.com/)
- **Frontend URL**: [SpeakX Frontend](https://speak-x-shiva-assignment.vercel.app/)
- **Repository**: [SpeakX_Assignment](https://github.com/Shiva-Tadigadapa/SpeakX_Assignment/)

## Features

### User Authentication
- **Google Authentication**: Users can log in using their Google account.
- **Email Verification**: Users can verify their email address upon registration. 
- **JWT Authentication**: Secure authentication using JSON Web Tokens for both Google Auth and Email/Password.
- **OTP Verification**: Using NodeMailer implemented secure otp verification and login system.

### User Profile
- **Profile Management**: Users can view and update their profile details.
- **Profile Picture**: Users can upload and change their profile picture.

### Posts
- **Create Post**: Users can create new posts with text and media.
- **Edit Post**: Users can edit their existing posts.
- **Delete Post**: Users can delete their posts.
- **Like/Unlike Post**: Users can like or unlike posts.
- **View Posts**: Users can view all posts in a feed.

### Comments
- **Add Comment**: Users can add comments to posts.
- **Edit Comment**: Users can edit their comments.
- **Delete Comment**: Users can delete their comments.
- **Nested Comments**: Users can reply to comments, creating a nested comment thread.

### Follow System
- **Follow/Unfollow**: Users can follow or unfollow other users.
- **Followers/Following List**: Users can view their followers and following lists.

### Search
- **Search Users**: Users can search for other users by username or email.
- **Search Posts**: Users can search for posts by content.

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/Shiva-Tadigadapa/SpeakX_Assignment.git
   cd SpeakX_Assignment/server

### SetUp for .env
 ```bash
PORT=3000
MONGO_URI=mongodb+srv://shivatadigadapa:Fu64DhpTA0jtdEZH@cluster001.zonnttz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster001
JWT_SECRET=hello_my_name_is_not_bala_shiva
GOOGLE_CLIENT_ID=199764480225-1npvvugr55pmnehika7e2dnkmpv42c01.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
SESSION_SECRET=hello_my_name_is_bala_shiva

