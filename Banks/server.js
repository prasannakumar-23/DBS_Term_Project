const express = require('express');
const bodyParser = require('body-parser');
const { BankInfo, Account } = require('./models.js');

const app = express();
console.log(BankInfo)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a bank
app.post('/banks', async (req, res) => {
  try {
    const { bankName, bankBranch, bankLocation, bankContactInfo } = req.body;
    console.log(req.body)
    console.log(bankName, bankBranch, bankLocation, bankContactInfo)
    const bank_name=bankName;
    const bank_branch=bankBranch;
    const bank_location=bankLocation;
    const bank_contact_info=bankContactInfo;
    const bank = await BankInfo.create({
      bank_name,
      bank_branch,
      bank_location,
      bank_contact_info,
    });
    res.status(201).json(bank);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Create an account in a bank
app.post('/accounts', async (req, res) => {
  try {
    const { accountNumber, accountHolderName, accountType, accountBalance, bankId,username,password } = req.body;
    console.log (accountNumber, accountHolderName, accountType, accountBalance, bankId,username,password)
    const bank = await BankInfo.findByPk(bankId);
    if (!bank) {
      return res.status(404).send('Bank not found');
    }
    const account_number=accountNumber;
    const account_holder_name=accountHolderName;
    const account_type=accountType;
    const account_balance=accountBalance;
    const bank_id=bankId
    const account = await Account.create({
      account_number,
      account_holder_name,
      account_type,
      account_balance,
      username,
      password,
      bank_id
    });
    res.status(201).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Transfer funds from one account to another
// Transfer funds from one account to another
app.post('/transfer', async (req, res) => {
  try {
    const { senderAccountId, receiverAccountId, amount, username, password } = req.body;
    const amount1=parseFloat(amount)
    console.log(typeof amount)
    console.log(amount+1)

    const senderAccount = await Account.findOne({ where: { account_number: senderAccountId, username, password } });
    const receiverAccount = await Account.findOne({where:{account_number: receiverAccountId}});
    if (!senderAccount || !receiverAccount) {
      return res.status(404).send('Account not found');
    }
    if (senderAccount.account_balance < amount1) {
        console.log("hello from if")
        console.log(senderAccount.account_balance)
        console.log(amount1)
      return res.sendStatus(400).send('Insufficient balance');

    }
    await senderAccount.decrement('account_balance', { by: amount1 });
    await receiverAccount.increment('account_balance', { by: amount1 });
    const timestamp = new Date().getTime();
    console.log("hello")
    console.log(timestamp)
    console.log(typeof timestamp)
    const str=timestamp.toString();
    res.status(200).send(str);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

app.post("/deposit",async (req,res)=>{
try {
    const { senderAccountId,amount, username, password } = req.body;
    const amount1=parseFloat(amount)
    console.log(typeof amount)
    console.log(amount+1)

    const senderAccount = await Account.findOne({ where: { account_number: senderAccountId, username, password } });
    if (!senderAccount) {
      return res.status(404).send('Account not found');
    }
    await senderAccount.increment('account_balance', { by: amount1 });
    const timestamp = new Date().getTime();
    console.log("hello")
    console.log(timestamp)
    console.log(typeof timestamp)
    const str=timestamp.toString();
    res.status(200).send(str);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
})

// Get all banks
app.get('/banks', async (req, res) => {
  try {
    const banks = await BankInfo.findAll();
    res.json(banks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(5050, () => {
  console.log('Server listening on port 5000');
});
