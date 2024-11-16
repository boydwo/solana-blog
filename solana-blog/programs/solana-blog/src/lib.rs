use anchor_lang::prelude::*;

declare_id!("12dk1HZdLaKfcbTzVxLPg69ofa5v7Gj3AhjiVDN92pmF");

#[program]
pub mod blog {
    use super::*;

    pub fn init_blog(ctx: Context<InitBlog>) -> Result<()> {
        let blog_account = &mut ctx.accounts.blog_account;
        blog_account.authority = ctx.accounts.authority.key();
        blog_account.current_post_key = Pubkey::default(); // Nenhum post no início
        Ok(())
    }

    pub fn signup_user(ctx: Context<SignupUser>, name: String, avatar: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        require!(name.len() <= 40, CustomError::NameTooLong);
        require!(avatar.len() <= 120, CustomError::AvatarTooLong);

        user_account.name = name;
        user_account.avatar = avatar;
        user_account.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        let blog_account = &mut ctx.accounts.blog_account;
        let post_account = &mut ctx.accounts.post_account;

        require!(title.len() <= 32, CustomError::TitleTooLong);
        require!(content.len() <= 500, CustomError::ContentTooLong);

        post_account.title = title;
        post_account.content = content;
        post_account.user = ctx.accounts.user_account.key();
        post_account.authority = ctx.accounts.authority.key();
        post_account.pre_post_key = blog_account.current_post_key;

        blog_account.current_post_key = post_account.key();

        emit!(PostEvent {
            label: "CREATE".to_string(),
            post_id: post_account.key(),
            author: ctx.accounts.user_account.key(),
            next_post_id: None,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitBlog<'info> {
    #[account(
        init,
        payer = authority,
        space = BlogState::LEN,
        seeds = [b"blog", authority.key().as_ref()],
        bump
    )]
    pub blog_account: Account<'info, BlogState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SignupUser<'info> {
    #[account(
        init,
        payer = authority,
        space = UserState::LEN,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = authority,
        space = PostState::LEN,
        seeds = [b"post", blog_account.key().as_ref(), blog_account.current_post_key.as_ref()],
        bump
    )]
    pub post_account: Account<'info, PostState>,
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserState>,
    #[account(mut, seeds = [b"blog", authority.key().as_ref()], bump)]
    pub blog_account: Account<'info, BlogState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct BlogState {
    pub current_post_key: Pubkey,
    pub authority: Pubkey,
}

impl BlogState {
    pub const LEN: usize = 8 + 32 + 32;
}

#[account]
pub struct UserState {
    pub name: String,
    pub avatar: String,
    pub authority: Pubkey,
}

impl UserState {
    pub const LEN: usize = 8 + 40 + 120 + 32;
}

#[account]
pub struct PostState {
    pub title: String,
    pub content: String,
    pub user: Pubkey,
    pub pre_post_key: Pubkey,
    pub authority: Pubkey,
}

impl PostState {
    pub const LEN: usize = 8 + 50 + 500 + 32 + 32 + 32;
}

#[error_code]
pub enum CustomError {
    #[msg("Name is too long.")]
    NameTooLong,
    #[msg("Avatar URL is too long.")]
    AvatarTooLong,
    #[msg("Title is too long.")]
    TitleTooLong,
    #[msg("Content is too long.")]
    ContentTooLong,
}

#[event]
pub struct PostEvent {
    pub label: String,
    pub post_id: Pubkey,
    pub author: Pubkey,
    pub next_post_id: Option<Pubkey>,
}
