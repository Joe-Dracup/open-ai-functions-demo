import useUIInteractor from '../composables/useUIInteraction';

export default function () {
  const { response } = useUIInteractor();

  const getRequest = (text: string) => ({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: text }],
  });

  const handleRequest = (data: any) => {
    response.value = data.choices[0].message.content;
  };

  return {
    getRequest,
    handleRequest,
  };
}
