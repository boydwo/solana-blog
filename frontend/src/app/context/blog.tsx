import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import idl from "../smart-contract/idl/solana_blog.json";
import { SolanaBlog } from "../smart-contract/solana-blog.smartcontract";
import { generateRandomAvatarUrl } from "../utils/generate-random-avatar.utils";
import { generateRandomName } from "../utils/generate-random-name.utils";


interface BlogContextType {
  user: {
    name: string;
    avatar: string;
    authority: web3.PublicKey;
  } | undefined;
  posts: {
    title: string;
    content: string;
    user: string;
  }[];
  initialized: boolean;
  initUser: () => void;
  createPost: (title: string, content: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const BlogContext = createContext<BlogContextType | null>(null);


export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};



export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    name: string;
    avatar: string;
    authority: web3.PublicKey;
}>();
  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState<{
    title: string;
    content: string;
    user: string;
}[]>([])
  const [transactionPending, setTransactionPending] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet()


    const program = useMemo((): Program<SolanaBlog> | null => {
      if (anchorWallet) {
        const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
        return new Program(idl as Idl, provider) as unknown as Program<SolanaBlog>;
      }
      return null; 
    }, [connection, anchorWallet]);
  

    useEffect(() => {
      const start = async () => {
        if (!program ||!publicKey) return;
  
        try {
          const [userPda] =  web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user"), publicKey.toBuffer()],
            program.programId
          );
          console.log("userPda", userPda);
          const userAccount = await program.account.userState.fetch(userPda);
          console.log("userAccount", userAccount);
          if (userAccount) {
            setInitialized(true);
            setUser(userAccount);
          }
  
          await fetchPosts(program, setPosts);

        } catch (error) {
          console.error("Error fetching data:", error);
          setInitialized(false);
        }
      };
  
      start();
    }, [program, publicKey, transactionPending]);
  

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true)
        const [userPda] =  web3.PublicKey.findProgramAddressSync(
          [Buffer.from("user"), publicKey.toBuffer()],
          program.programId
        );
        console.log("userPda-initUser", userPda);
        const name = generateRandomName();
        console.log("name-initUser", name);
        const avatar = generateRandomAvatarUrl(name);
        console.log("avatar-initUser", avatar);
        await program.methods
          .signupUser(name, avatar)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId ,
          } as any)
          .signers([]) 
          .rpc()

        setInitialized(true)
      } catch (error) {
        console.log(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  const initBlog = async ():Promise<{blogPda:web3.PublicKey} | undefined> => {
    if (program && publicKey) {
      try {
        setTransactionPending(true)
        console.log("[initBlog]")
        const [blogPda] =  web3.PublicKey.findProgramAddressSync(
          [Buffer.from("blog"), publicKey.toBuffer()],
          program.programId
        );

        const blogExists = await program.account.blogState.fetchNullable(blogPda);
        console.log("[blogExists] ::", blogExists)
        if(blogExists) {
          return {
            blogPda
          }
        }
        await program.methods
          .initBlog()
          .accounts({
            blog: blogPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId,
          } as any)
          .signers([]) 
          .rpc()
          console.log("[blogInitialized] ::", blogPda)
          return {
            blogPda
          }
      } catch (error) {
        console.log(error)
      } finally {
        setTransactionPending(false)
      }
    } 
  }

  const createPost = async (title:string, content:string) => {
    if (program && publicKey) {
      setTransactionPending(true)
      try {

        const blog = await initBlog()

        if(!blog){
          return
        }

        const blogAccount = await program.account.blogState.fetch(blog.blogPda);

        const currentPostKey =  blogAccount.currentPostKey;

        console.log("[currentPostKey] :: ",currentPostKey.toString())
        const [userPda] =  web3.PublicKey.findProgramAddressSync(
          [Buffer.from("user"), publicKey.toBuffer()],
          program.programId
        );


        const [postPda] = web3.PublicKey.findProgramAddressSync([Buffer.from("post"),blog.blogPda.toBuffer(), currentPostKey.toBuffer()], program.programId)

        const tx = await program.methods
        .createPost(title, content)
        .accounts({
          postAccount: postPda,
          userAccount: userPda,
          blogAccount: blog.blogPda,
          authority: publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc(); // `rpc` já inclui assinatura e envio da transação

      console.log("Transaction Signature:", tx);

      // Espera pela confirmação da transação antes de seguir
      const confirmation = await program.provider.connection.confirmTransaction(
        tx,
        "confirmed"
      );
      console.log("Transaction confirmed:", confirmation);
      await fetchPosts(program, setPosts);
      console.log("Post created successfully!");
        setShowModal(false)
      } catch (error) {
        console.error(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  async function fetchPosts(program: Program<SolanaBlog>, setPosts: { (value: SetStateAction<{ title: string; content: string; user: string; }[]>): void; (value: SetStateAction<{ title: string; content: string; user: string; }[]>): void; (arg0: { user: string; title: string; content: string; }[]): void; }) {
    const postAccounts = await program.account.postState.all();
  
    console.log("[postAccounts] ::", postAccounts);
    setTransactionPending(true)
    const sortedPosts = postAccounts.sort((a, b) => {
      return a.publicKey.toString().localeCompare(b.publicKey.toString());
    });
    setPosts(sortedPosts.map((post) => ({
      user: post.account.authority.toString(),
      title: post.account.title,
      content: post.account.content
    })));
  }
  

  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        initialized,
        initUser,
        createPost,
         showModal,
         setShowModal,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

