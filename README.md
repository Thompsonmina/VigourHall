## Vigour Hall

Vigour hall is a community of fitness entuisiats united by challenges

Vigour Hall is a crypto native social community of fitness enthuisiasts. Where people can participate in fitness challenges and can get rewarded for consistently showing up. With the overall goal of having a better quality of life.

Vigour Hall consists of five fitness challenges a user can enroll in, each challenge also consists of tiers. The higher your tier the better your reward. Think of joining a challenge as analogous to a knight joining a medival guild, Where each tier represents your objective.

## Why Vigour Hall
Vigour Hall ultimate objective is to cultivate a large community of fitness enthuisats by incentivitising them with rewards. As someone that struggles with being consistent with my health as well having cultivated bad health habits and behaviours in the past. Vigour hall strives to help people like me by rewarding consistency and providing a community of like minded fitness enthuisiiats. VigourHall also aspires to provide a crypto native solution for granting users ownership of thier health and fitness data.

## How it works

### Creating an Account
Being a big believer of Address agnostic user accounts. VigourHall is address agnostic. To become a user, you must choose a unique username which is associated to the address you use to perform the transaction.  you are then given a unique pass phrase to keep safe. This unique passphrase is what you can then use to reassociate your username to a different address. If something happens to the one you initially used to create the account.

### The Challenge side
There are five major challenges a user can enroll in at any point in time on VigourHall. 

Water Challenge
Body Fat Challenge
Sleep Challenge
Steps Challenge
Activity Challenge

Each Challenge is meant to encourage healthy habits in its given domain. The Challenges are made up of three tiers of gradually increasing difficulty. You earn your vigour tokens when you complete challenges. Right now vigour tokens have no monetary value and are simply for bragging points and the simple psychological feeling of acheivement. But this is subject to change in the future.

Once a user creates an account with us, They can enroll in any challenge (up to all of them). Once enrolled they automatically start from tier 1, a user must submit a proof of completion for the current tier of an enrolled challenge. Right now this data is gotten by integrating with fitbit to read the data specific to an enrolled challenge. 

For eaxmple if a new user kate joins the Water challenge, For tier 1 she has to submit proof that she is drinking at least one litre of water a day. To get this proof, with kate's consent the app fetchs her water consumption data from fitbit, and check to see if it satisfies the criteria. After a certain number of completions kate will start getting rewarded for them. Also if she keeps a certain number of streaks on tier one of the challenge kate can decided to upgrade to a tier 2, which has a harder objective (drink at least 2.5 litres of water a day) but a larger payout.

Users will not get penalised for completing a challenge objective during the day but not logging in to submit to the dapp that same day. As long as the objectives are fulfilled and tracked on a fitness tracker (fitbit). Whenever a user comes back, those completions will be valid

### Data Storage
By default no fitness user data is stored by the app apart from the boolean fact that a challenge has been completed. But a user can opt to store thier data each time they submit thier data for challenge verification. If a user opts to do this, thier data gets encrypted and stored on filecoin and ipfs.

### Challenge Verification
In order to securely get fitbit data using OAUTH as well as verify challenge data we needed to introduce a lightweight web server (created with flask) to the mix. The server is responsible for fetching the fitness data as well verifying challenges to the smart contract. The smart contract only allows verified parties to submit challenge completion data on behalf of users. Rigth now the only verified party is the server.



## Further Improvements/ Future Iteration Plans
Integrate more fitness tracker apps so people have more options for verifying thier challenge tier objectives.

Make the platform more social by integrating with open social protocols like lens and adding communication channels to allow users communicate with each other

Allowing the users to optionally stake amounts of money of thier discretion that would be released based on criteria that they set up, like having a 7 day streak or having up to 100 completions

Establish more Verified parties or come up with a way for parties to become verified and give users the choice of what party to use, to avoid centralisation

Allow users to opt in to store more fitness data not neccessarily related to the challenges  with the aim of establishing a data dao based on a continous stream of personal fitness data of hundreds, maybe thousands and possibly milliosn of individuals. Obviously with robust ways to make sure the data is annonymised so that the data dao can provide value to researches and interested bodies by offering this data for compensation to the DAO, As well protecting users PIL and rewarding them as members of the dao for thier contributions. 


### Sponsors
- Scroll

The vigour token address 0x4058039b994C1e5A4F0eEaB35F8AF1519FB224Bd
- Filecoin


Scroll








