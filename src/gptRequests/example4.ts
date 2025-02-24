import { useCarListing } from '../composables/useCarListing';

export default function () {
  const getRequest = (text: string) => ({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: text }],
    functions: [
      {
        name: 'set_form_value',
        description:
          'Sets the value of the form allowing the user to list their car for sale',
        parameters: {
          type: 'object',
          properties: {
            make: {
              type: 'string',
              description: 'The make/brand of the car',
            },
            model: {
              type: 'string',
              description: 'The specific model of the car',
            },
            year: {
              type: 'number',
              description: 'The manufacturing year of the car',
            },
            price: {
              type: 'number',
              description: 'The listing price of the car in dollars',
            },
            description: {
              type: 'string',
              description:
                'Detailed description of the car including condition and features',
            },
            contactEmail: {
              type: 'string',
              description:
                'Email address for interested buyers to contact the seller',
            },
          },
        },
      },
    ],
    function_call: 'auto',
  });

  const handleRequest = (data: any) => {
    const { setState } = useCarListing();

    const functionCall = data.choices[0].message.function_call;

    console.log(functionCall);

    if (functionCall && functionCall.name === 'set_form_value')
      console.log(JSON.parse(functionCall.arguments));

    setState(JSON.parse(functionCall.arguments));
  };

  return {
    getRequest,
    handleRequest,
  };
}
