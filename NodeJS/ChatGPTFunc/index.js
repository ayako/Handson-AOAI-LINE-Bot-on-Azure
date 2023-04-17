const lineapi_url = 'https://api.line.me/v2/bot/message/reply';
const lineapi_token = 'YOUR_LINEAPI_TOKEN';
const aoai_url = 'https://YOUR_AOAI_SERVICE.openai.azure.com/openai/deployments/gtp-35-turbo_202203/chat/completions?api-version=2023-03-15-preview';
const aoai_key = 'YOUR_AOAI_KEY';

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body[0].type == 'message' ){
        const user_question = req.body[0].message.text;
        // const aoai_answer = postToAOAI(user_question);
        // replyToUser(aoai_answer, req.body[0].replyToken);
    
        context.res = {
            status: 200, /* Defaults to 200 */
            // body: 'activity completed successfully.'
            body: 'user_question is: ' + user_question
        };    
    }
    else
    {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: 'did nothing.'
        }
    }
}

function postToAOAI(req_message) {
    const req_body = {
      "messages": [
        {
          "role": "system",
          "content": "あなたは「しま〇ろう」というキャラクターです。0-6歳の子供が分かるように話してください。また、口調は親切で親しみやすくしてください。"
        },
        {
          "role": "user",
          "content": req_message
        },
        {
          "role": "assistant",
          "content": ""
        }
      ],
      "temperature": 0.7,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "max_tokens": 800,
      "stop": null
    }
  
    fetch(aoai_url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': aoai_key
      },
      body: JSON.stringify(req_body)
    })
    .then((res) => res.json())
    .then((json) => { 
      // 取得内容を表示
      console.log(json);
      return json.choices[0].message.content;
    })
    .catch((error) => {
      console.error('AOAI Post Error:', error.code + ': ' + error.message)
      return null;
    })
}

function replyToUser(answer,reply_token){
    const req_body = {
        "messages": [
          {
            "text": answer,
            "type": "text"
          }
        ],
        "replyToken": reply_token
      }

    fetch(lineapi_url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + lineapi_token
        },
        body: JSON.stringify(req_body)
    })
    .catch((error) => {
        console.error('LINE Api Post Error:', error.code + ': ' + error.message)
        return null;
    })
}