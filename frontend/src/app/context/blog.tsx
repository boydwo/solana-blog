import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  ReactNode,
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
    user: web3.PublicKey;
    prePostKey: web3.PublicKey;
    authority: web3.PublicKey;
  }[];
  initialized: boolean;
  initUser: () => void;
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
    user: web3.PublicKey;
    prePostKey: web3.PublicKey;
    authority: web3.PublicKey;
}[]>([])
  const [transactionPending, setTransactionPending] = useState(false)
  // const [showModal, setShowModal] = useState(false)
  // const [lastPostId, setLastPostId] = useState()

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
  
          const postAccounts = await program.account.postState.all([
            {
              memcmp: {
                offset: 8, // Defina o deslocamento correto para o campo de filtro
                bytes: publicKey.toBase58(),
              },
            },
          ]);
  
          setPosts(postAccounts.map((post) => ({
            user: post.account.user,
            title: post.account.title,
            content: post.account.content,
            prePostKey: post.account.prePostKey,
            authority: post.account.authority,
          })));

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


  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        initialized,
        initUser
        // createPost,
        // showModal,
        // setShowModal,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
