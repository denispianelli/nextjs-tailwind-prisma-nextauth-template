# 🚀 Next.js Tailwind Prisma NextAuth Shadcn/ui Template

This template provides a robust starting point for building full-stack web
applications with **Next.js 14** using the App Router, **Tailwind CSS**,
**Prisma**, **NextAuth.js**, and **Shadcn/ui**, incorporating an authentication
system.

## [Live Demo](https://nextjs-tailwind-prisma-nextauth-template.vercel.app)

## 🔥 **Template Features:**

- **Light/Dark Mode:** Switch between light and dark mode seamlessly for optimal readability and user experience.

- **Fully Responsive:** Enjoy a consistent user experience across devices with a fully responsive design that adapts to different screen sizes.

- **Authentication:**

  - **Login and Sign Up:** Easily register for a new account or log in with existing credentials.
  - **OAuth Integration:** Authenticate using OAuth providers such as Google or GitHub for streamlined access.
  - **Email Verification:** Verify email addresses through one-time passwords sent via email for added security.

- **Rate-Limited Verification:** Prevent abuse by limiting the number of verification code attempts to 5 per 10 minutes using Redis rate limiting.

- **Forgot Password:** Recover access to your account with a reset password link sent directly to your email address.

- **Account Settings:**

  Take control of your account with a settings page that allows you to:

  - Update personal information.
  - Change your profile picture.
  - Change your password securely.
  - Permanently delete your account if needed.

### 🔧 Customizable and Extendable

- Tailor the template to your specific needs and extend functionality with ease to create a personalized experience for your users.
  Enhance your UI with [shadcn/ui](https://github.com/shadcn/ui)'s customizable
  and reusable UI components.
- Extend functionality by integrating additional features or third-party APIs.

---

## 🛠️ Getting started

Follow these steps to set up the template and start building your application:

### **Create a New Project**

```bash
 npx create-next-app -e https://github.com/denispianelli/nextjs-tailwind-prisma-nextauth-template my-app
```

### **Navigate to the Project Directory**

```bash
 cd my-app
```

### **Install Dependencies**

```bash
npm install
```

or

```bash
yarn install
```

### **Set Up Environment Variables and Deploy with Vercel 🚀**

Duplicate the .env.example file and rename the copy to .env. Then, follow the instructions below to populate it with the necessary configuration.

#### [Import your github repository to Vercel](https://vercel.com/new)

#### Postgres

- [Create a Vercel Postgres Database](https://vercel.com/docs/storage/vercel-postgres/quickstart#quickstart)

#### Redis

- [Create a Vercel KV Databse](https://vercel.com/docs/storage/vercel-kv/quickstart)

#### NextAuth

- Generate a secret string by running npx auth secret, for example: `AUTH_SECRET=LIjKViHdApuG+qsQk2KS/88iNrkC7seT8Eakd1MGLko=`.
- [Creating an OAuth App in Github](https://authjs.dev/guides/configuring-github#registering-your-app)
- [Creating an OAuth App in Google](https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen?hl=fr)

#### Nodemailer

- Get the app password from your Gmail account:

To get an App Password for your Gmail account, follow these detailed steps:

Note: You’ll need to have two-step verification enabled on your Gmail account before generating an App Password. If you haven’t enabled it, do so first by going to your Google Account settings.

1. Access Your Google Account:
2. Start by visiting the [Google Account management page](https://myaccount.google.com).
3. **Sign In:** Sign in to the Google Account associated with the Gmail address you want to use for sending emails programmatically.
4. **Security:** In the left sidebar, click on “Security.”
5. Scroll down to How you sign in to google and click on 2-step verificaiton.
6. **App Passwords:** Scroll down to “App passwords.” Click on “App passwords.” You may be prompted to re-enter your password for security purposes.
7. **App name:** Enter a custom name for this App Password. It helps you identify it later, so choose something related to the application or use case where you plan to use this App Password.
8. **Create:** Click the “Create” button. Google will create a unique 16-character App Password for your custom application/device.

Once generated, Google will display the App Password on the screen. Important:
This is the only time you’ll see this password. Make sure to save it securely
because you won’t be able to view it again. You’ll use this App Password in your
application code to authenticate with Gmail’s SMTP server.

For example:

```js
EMAIL_SERVER_PORT=465
EMAIL_SERVER_SERVICE=gmail
EMAIL_SERVER_USER=your.email@gmail.com
EMAIL_SERVER_PASSWORD=your secret app password
EMAIL_FROM=your.email@gmail.com
```

[_source_](https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628)

#### Uploadthing

- [Create an account](https://uploadthing.com/) if not already, go to your dashboard and copy paste your API key in the .env file.

#### Prisma

Run a migration to create your db tables

```bash
 npx prisma migrate dev --name init

```

#### 🛠 Start building your application

---

#### 🌟 **Star this Repository:**

If you find these features useful, please consider starring the repository to
show your support and help others discover it!

---

#### 🚀 **Happy Coding!**
