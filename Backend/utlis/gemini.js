import "dotenv/config";

const getgeminiAPIResponse = async(message) => {
    const options = {
    method: "POST",
    headers: {
      "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemini-3.6-flash",
      contents: [
    {
      role: "user",
      parts: [{ text : message }]
    }
  ]
    })
  };

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", options);
    const data = await response.json();
    console.log(data);
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.candidates?.[0]?.output?.text ||
      "⚠️ No reply received from Gemini";
    return output ;
  } catch (err) {
    console.log(err);
  }
};

export default getgeminiAPIResponse;