export default function () {
  const getRequest = (text: string) => ({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: text }],
    functions: [
      {
        name: 'console_log',
        description:
          'allows the user to log into the console through their input',
        parameters: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message to log to the console',
            },
          },
          required: ['message'],
        },
      },
    ],
    function_call: 'auto',
  });

  const handleRequest = (data: any) => {
    const functionCall = data.choices[0].message.function_call;

    if (functionCall && functionCall.name === 'console_log')
      console.log(JSON.parse(functionCall.arguments));
  };

  return {
    getRequest,
    handleRequest,
  };
}
