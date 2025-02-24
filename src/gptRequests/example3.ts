export default function () {
  const getRequest = (text: string) => ({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: text }],
    functions: [
      {
        name: 'set_background_colour',
        description: 'sets the background colour of the window',
        parameters: {
          type: 'object',
          properties: {
            colour: {
              type: 'string',
              description: 'the colour to set the background to',
            },
          },
          required: ['colour'],
        },
      },
    ],
    function_call: 'auto',
  });

  const handleRequest = (data: any) => {
    const functionCall = data.choices[0].message.function_call;

    if (functionCall && functionCall.name === 'set_background_colour')
      document.body.style.backgroundColor = JSON.parse(
        functionCall.arguments
      ).colour;
  };

  return {
    getRequest,
    handleRequest,
  };
}
