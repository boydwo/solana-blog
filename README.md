
# Solana Blog Application

## Overview
This is my final project for School of Solana Season 6 by Solana Foundation and Anckee.

The Solana Blog Application is a basic decentralized blogging platform built on the Solana blockchain. It allows users to:
- **Connect their wallets** (e.g., Phantom Wallet) to interact with the platform.
- **Initialize a blog** for posting content.
- **Create posts** with a title and description.
- **List posts** made by the user.

This application is powered by Solana's **Anchor framework** for the smart contract and a **Next.js** frontend for user interaction.

## Deployed Application

The application is live on **Solana Devnet**, allowing users to connect their wallets, create posts, and view existing posts on the blockchain.

You can explore and interact with the platform at the following link:  
**[Solana Blog Frontend](https://solana-blog-kappa.vercel.app/)**

### Smart Contract Details

The smart contract for the blog platform is deployed on **Solana Devnet**. To ensure proper functionality or to deploy your own instance, you may need the following information:

- **Program ID**: Replace the Program ID in your project if deploying a custom version. The deployed Program ID is:
  ```
  12dk1HZdLaKfcbTzVxLPg69ofa5v7Gj3AhjiVDN92pmF
  ```
- **Program Details**:
  - Supports user initialization.
  - Allows users to create blog posts with a title (max 32 characters) and content (max 500 characters).
  - Posts are linked to user accounts and managed through Solana's Program Derived Addresses (PDAs).

---

## Building and Testing the Anchor Program Locally

To build and test the Anchor program, follow these steps:

### Prerequisites
- Install [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools).
- Install [Anchor](https://book.anchor-lang.com/getting_started/installation.html).
- Ensure you have a keypair file (`id.json`) configured for Solana CLI.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/solana-blog.git
   cd solana-blog/solana-blog
   ```

2. Install dependencies:
   ```bash
   anchor build
   ```

3. Test the Anchor program:
   ```bash
   anchor test
   ```

4. Deploy the program to Solana Devnet:
   ```bash
   anchor deploy
   ```

---

## Running the Frontend Locally

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v16 or later).
- Install [Yarn](https://yarnpkg.com/).

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd solana-blog/frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run the application:
   ```bash
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Smart Contract Workflow

### Key Functions
1. **`initBlog`:** Initializes a new blog for the user.
2. **`signupUser`:** Registers a user with a unique name and avatar.
3. **`createPost`:** Creates a new post with a title and description.

### Accounts Structure (with PDA Overview)

In Solana, **Program Derived Addresses (PDAs)** are unique addresses generated deterministically by programs. They are used to associate data accounts with specific logic or entities without requiring private keys. PDAs are central to how this smart contract manages user accounts, posts, and blogs.

#### PDA Usage in the Blog Project

- **Blog Account PDA:**  
  This PDA is generated using the `authority` (user's wallet) and a fixed seed (`"blog"`). It uniquely identifies the blog associated with a user.

- **Post Account PDA:**  
  Post accounts are derived from the `blog_account` PDA and the `current_post_key`. This ensures that each post belongs to a specific blog and maintains a chronological chain of posts.

- **User Account PDA:**  
  The user account PDA is derived using the wallet's public key and the `"user"` seed. It stores user-specific metadata such as `name` and `avatar`.

#### Advantages of Using PDAs

- **Security:**  
  PDAs ensure that accounts are associated with a specific user or program logic.

- **Deterministic Access:**  
  The same PDA can always be recomputed using the same seeds and program ID, making data retrieval predictable and efficient.

- **Authority Management:**  
  PDAs allow programs to act as the "owner" of accounts, providing controlled access and updates.

By leveraging PDAs, this smart contract achieves a secure and organized structure for managing the relationships between users, blogs, and posts.

---

## Frontend Features

1. **Wallet Connection:** Users can connect their Phantom wallet to interact with the application.
2. **User Initialization:** Allows users to initialize their profile on the blockchain.
3. **Post Creation:** A modal form for creating posts, which triggers the smart contract.
4. **Post Listing:** Displays posts in a user-friendly list format.

---

## Notes and Future Enhancements

- Add timestamp support for posts directly in the smart contract.
- Enhance UI/UX with Tailwind CSS.
- Implement additional features like post editing and comments.
