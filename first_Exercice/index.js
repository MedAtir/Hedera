// Import the necessary libraries
const {
    Client,
    ConsensusTopicCreateTransaction,
    ConsensusTopicId,
    ConsensusTopicInfoQuery,
    ConsensusTopicUpdateTransaction,
    TopicMessageSubmitTransaction,
    TopicMessageQuery,
  } = require("@hashgraph/sdk");
  
  // Set up the client
  const client = Client.forTestnet();
  
  // Set up the keys
  const adminPrivateKey = "3030020100300706052b8104000a04220420f49980f65f2e060825a48910409ac9ca9754401875ae715618a7f7fdbb717c55";
  const adminPublicKey = Client.fromString(adminPrivateKey).publicKey;
  const submitPrivateKey = "302d300706052b8104000a032200025fe6bb0fa67a03d910b267e05059709c617d75961db3ee06b5174cd5a2d1f209";
  const submitPublicKey = Client.fromString(submitPrivateKey).publicKey;
  
  // Set up the memo and other parameters
  const memo = "Hedera is awesome!";
  const topicMaxMessageSize = 1024;
  const topicAutoRenewDurationSeconds = 2592000;
  const adminAccountId = '0.0.4575511';
  const topicAutoRenewAccountBalance = "2";
  
  // Create the topic
  (async function() {
    const createTopicResponse = await new ConsensusTopicCreateTransaction()
      .setAdminKey(adminPublicKey)
      .setSubmitKey(submitPublicKey)
      .setMaxTransactionFee(100000000)
      .setMaxMessageSize(topicMaxMessageSize)
      .setAutoRenewDuration(topicAutoRenewDurationSeconds)
      .setAutoRenewAccountId(adminAccountId)
      .setAutoRenewAccountPeriod(topicAutoRenewAccountBalance)
      .setTopicMemo(memo)
      .execute(client);
  
    const topicId = createTopicResponse.getConsensusTopicId();
  
    // Retrieve the topic info
    const topicInfo = await new ConsensusTopicInfoQuery()
      .setTopicId(topicId)
      .execute(client);
  
    // Modify the topic memo
    const newMemo = "Hedera is the best!";
    await new ConsensusTopicUpdateTransaction()
      .setTopicId(topicId)
      .setTopicMemo(newMemo)
      .execute(client);
  
    // Retrieve the updated topic info
    const updatedTopicInfo = await new ConsensusTopicInfoQuery()
      .setTopicId(topicId)
      .execute(client);
  
    // Submit a message to the topic
    const message = "Hello Hedera!";
    const submitMessageResponse = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client);
  
    const submittedMessage = submitMessageResponse.getConsensusTopicResponse();
  
    // Retrieve the published message
    const query = await new TopicMessageQuery()
      .setTopicId(topicId)
      .setStartTime(0)
      .setEndTime(Date.now());
  
    const messages = await query.execute(client);
  
    messages.forEach((msg) => {
      console.log("Message: " + new TextDecoder().decode(msg.message));
    });
  })();
  