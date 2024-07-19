// functions/signIn.js
exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sign In successful" })
    };
  };
  