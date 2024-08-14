use anchor_lang::prelude::*;

declare_id!("5x1PoPUPcNtR6czzvRqu49n2WMGmTYPxrN9zEVH9XpM3");

#[program]
pub mod dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn update_value(ctx: Context<UpdateValue>, value : u64) -> Result<()> {

        let storage_account = &mut ctx.accounts.storage_account;
        storage_account.value = value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize <'info>{
    #[account (init, payer = user, space = 9000)]
    pub initial_account : Account<'info , Init>,
    #[account(mut)]
    pub user : Signer<'info>,
    pub system_program : Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateValue<'info>{
    #[account(mut)]
    pub storage_account : Account<'info, Init>,
}

#[account]
pub struct Init {
    pub value : u64
}
