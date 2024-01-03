import axios from 'axios';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchGeneratedText = async (textType, retries = 3, backoffDelay = 500) => {
    let prompt = "";
  
    switch (textType.toLowerCase()) {
      case 'news':
        prompt = "Write a brief news article about current international relations:" ;
        break;
      case 'story':
        prompt = "Write a short story that starts with:";
        break;
      case 'poetry':
        prompt = "Compose a poem about:";
        break;
      case 'travel guides':
        prompt = "Create a travel guide introduction for:";
        break;
      case 'lifestyle':
        prompt = "Write a lifestyle blog post about:";
        break;
      case 'movie scripts':
        prompt = "Draft a movie script scene about:";
        break;
      default:
        prompt = `Write a ${textType.toLowerCase()}:`;
    }
  
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
        prompt: prompt,
        max_tokens: 125, // 设置为大约100到150之间
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(response.data); // 打印响应数据
  
      return response.data.choices[0].text;
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        await sleep(backoffDelay);
        return fetchGeneratedText(textType, retries - 1, backoffDelay * 2);
      }
      console.error('Error in generating text from OpenAI: ', error);
      return '';
    }
  };
  

export default fetchGeneratedText;
