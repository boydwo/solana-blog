import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";
import { SolanaBlog } from "../target/types/solana_blog";


describe("blog", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Blog as Program<SolanaBlog>;

  const bob = anchor.web3.Keypair.generate();

  const title = "First Post";
  const longTitle = "A".repeat(50); // Exceeds the limit
  const content = "This is the first post content.";
  const longContent = "A".repeat(501); // Exceeds the limit

  describe("Initialize Blog", async () => {
    it("Should initialize the blog successfully", async () => {
      await airdrop(provider.connection, bob.publicKey);

      const [blogPkey, _blogBump] = await getBlogAddress(bob.publicKey, program.programId);

      await program.methods.initBlog().accounts({
        blog: blogPkey,
        authority: bob.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any).signers([bob]).rpc({ commitment: "confirmed" });

      const blogAccount = await program.account.blogState.fetch(blogPkey);
      assert.strictEqual(blogAccount.authority.toBase58(), bob.publicKey.toBase58());
    });

    it("Should fail to initialize the blog twice", async () => {
      const [blogPkey] = await getBlogAddress(bob.publicKey, program.programId);

      let shouldFail = "This should fail";
      try {
        await program.methods.initBlog().accounts({
          blog: blogPkey,
          authority: bob.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (err) {
        shouldFail = "Failed";
      }
      assert.strictEqual(shouldFail, "Failed");
    });
  });

  describe("Create Post", async () => {
    it("Should create a post successfully", async () => {
      const [blogPkey] = await getBlogAddress(bob.publicKey, program.programId);
      // Simulates the initial current_post_key  (first post)
      const defaultPostKey = anchor.web3.PublicKey.default; // Pubkey::default() in Solana

      // Post PDA 
      const [postPkey, postBump] = await getPostAddress(blogPkey, defaultPostKey, program.programId);

      const [userAccountPkey, userBump] = await getUserAccountAddress(bob.publicKey, program.programId);

      await program.methods.signupUser("Bob", "https://avatar.url").accounts({
        userAccount: userAccountPkey,
        authority: bob.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any).signers([bob]).rpc({ commitment: "confirmed" });

      await program.methods.createPost(title, content).accounts({
        postAccount: postPkey,
        userAccount: userAccountPkey,
        blogAccount: blogPkey,
        authority: bob.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any).signers([bob]).rpc({ commitment: "confirmed" });

      const postAccount = await program.account.postState.fetch(postPkey);
      assert.strictEqual(postAccount.title, title);
      assert.strictEqual(postAccount.content, content);
    });

    it("Should fail to create a post with a title longer than 32 bytes", async () => {
      const [blogPkey] = await getBlogAddress(bob.publicKey, program.programId);

    // Get the Blog state after the first post
      const blogAccount = await program.account.blogState.fetch(blogPkey);
      const currentPostKey = blogAccount.currentPostKey;
    
      // Post PDA 
      const [postPkey, postBump] = await getPostAddress(blogPkey, currentPostKey, program.programId);
      const [userAccountPkey, userBump] = await getUserAccountAddress(bob.publicKey, program.programId);
    
      let shouldFail = "This should fail";
      try {
        await program.methods.createPost(longTitle, content).accounts({
          postAccount: postPkey,
          userAccount: userAccountPkey,
          blogAccount: blogPkey,
          authority: bob.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }as any).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (err) {
        const parsedError = anchor.AnchorError.parse(err.logs);
        assert.strictEqual(parsedError.error.errorCode.code, "TitleTooLong");
        shouldFail = "Failed";
      }
      assert.strictEqual(shouldFail, "Failed");
    });

    it("Should fail to create a post with content longer than 500 bytes", async () => {
      const [blogPkey] = await getBlogAddress(bob.publicKey, program.programId);
    
    // Get the Blog state after the first post
    const blogAccount = await program.account.blogState.fetch(blogPkey);
    const currentPostKey = blogAccount.currentPostKey;
  
      // Post PDA 
      const [postPkey, postBump] = await getPostAddress(blogPkey, currentPostKey, program.programId);
      const [userAccountPkey, userBump] = await getUserAccountAddress(bob.publicKey, program.programId);
    
      let shouldFail = "This should fail";
      try {
        await program.methods.createPost(title, longContent).accounts({
          postAccount: postPkey,
          blogAccount: blogPkey,
          userAccount: userAccountPkey,
          authority: bob.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }as any).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (err) {
        const parsedError = anchor.AnchorError.parse(err.logs);
        assert.strictEqual(parsedError.error.errorCode.code, "ContentTooLong");
        shouldFail = "Failed";
      }
      assert.strictEqual(shouldFail, "Failed");
    });
  });
});

async function airdrop(connection, publicKey, amount = 1 * anchor.web3.LAMPORTS_PER_SOL) {
  const airdropSignature = await connection.requestAirdrop(publicKey, amount);
  await connection.confirmTransaction(airdropSignature, "confirmed");
}

async function getBlogAddress(author:PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("blog"), author.toBuffer()],
    programId
  );
}
async function getPostAddress(
  blogAccount: PublicKey, 
  currentPostKey: PublicKey, 
  programId: PublicKey 
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("post"), 
      blogAccount.toBuffer(),
      currentPostKey.toBuffer(), 
    ],
    programId
  );
}
async function getUserAccountAddress(authority: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user"), authority.toBuffer()],
    programId
  );
}